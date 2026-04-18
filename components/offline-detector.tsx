'use client';

import { useRef, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export function OfflineDetector() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const retryBtnRef = useRef<HTMLButtonElement>(null);
  const isRetryingRef = useRef(false);
  const onlineDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (overlayRef.current) overlayRef.current.style.display = 'flex';
  };

  const hide = () => {
    if (overlayRef.current) overlayRef.current.style.display = 'none';
  };

  // Verify real connectivity before hiding — the online event can fire
  // falsely when the SW serves cached responses
  const verifyAndHide = async () => {
    try {
      await fetch('/api/health', { method: 'HEAD', cache: 'no-store' });
      hide();
    } catch {
      // Still actually offline despite the online event — keep showing
    }
  };

  useEffect(() => {
    if (!navigator.onLine) show();

    const handleOffline = () => {
      // Cancel any pending online verification
      if (onlineDebounceRef.current) clearTimeout(onlineDebounceRef.current);
      show();
    };

    const handleOnline = () => {
      // Debounce + verify before hiding — avoids flicker from false online events
      if (onlineDebounceRef.current) clearTimeout(onlineDebounceRef.current);
      onlineDebounceRef.current = setTimeout(() => verifyAndHide(), 1500);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (onlineDebounceRef.current) clearTimeout(onlineDebounceRef.current);
    };
  }, []);

  const handleRetry = async () => {
    const btn = retryBtnRef.current;
    if (isRetryingRef.current || !btn) return;

    isRetryingRef.current = true;
    btn.disabled = true;
    btn.textContent = 'Checking...';

    try {
      await fetch('/api/health', { method: 'HEAD', cache: 'no-store' });
      hide();
    } catch {
      // still offline
    } finally {
      isRetryingRef.current = false;
      btn.disabled = false;
      btn.textContent = 'Try Again';
    }
  };

  return (
    <div
      ref={overlayRef}
      style={{ display: 'none' }}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-border">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div
            className="absolute inset-0 rounded-full border-4 border-muted-foreground/20 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <WifiOff size={32} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">You're Offline</h2>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Check your internet connection and try again.
        </p>

        <button
          ref={retryBtnRef}
          onClick={handleRetry}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
