"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  sender: string;
  senderName: string;
  senderId?: string;
  text: string;
  timestamp: string;
}

interface InquiryChatProps {
  inquiryId: string;
  currentUserId: string;
  currentUserRole: "client" | "vendor" | "admin";
  disabled?: boolean;
  darkMode?: boolean;
  pollInterval?: number; // ms, default 5000
}

export function InquiryChat({
  inquiryId,
  currentUserId,
  currentUserRole,
  disabled = false,
  darkMode = false,
  pollInterval = 5000,
}: InquiryChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const fetchMessages = useCallback(async (silent = false) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const fetched: Message[] = data.inquiry?.messages || [];

      setMessages(fetched);

      // Notify if new messages arrived (not from us)
      if (silent && fetched.length > lastMessageCountRef.current) {
        const newest = fetched[fetched.length - 1];
        if (newest.senderId !== currentUserId) {
          toast.info(`New message from ${newest.senderName}`);
        }
        scrollToBottom();
      }
      lastMessageCountRef.current = fetched.length;
    } catch {}
    finally {
      setLoading(false);
    }
  }, [inquiryId, currentUserId]);

  // Initial load
  useEffect(() => {
    fetchMessages(false).then(() => scrollToBottom("instant"));
  }, [fetchMessages]);

  // Polling
  useEffect(() => {
    const interval = setInterval(() => fetchMessages(true), pollInterval);
    return () => clearInterval(interval);
  }, [fetchMessages, pollInterval]);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || disabled) return;

    setSending(true);
    // Optimistic update
    const optimistic: Message = {
      sender: currentUserRole,
      senderName: "You",
      senderId: currentUserId,
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    scrollToBottom();

    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        // Rollback optimistic update
        setMessages((prev) => prev.filter((m) => m !== optimistic));
        setText(trimmed);
        toast.error("Failed to send message");
      } else {
        // Refresh to get server-confirmed message
        await fetchMessages(false);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m !== optimistic));
      setText(trimmed);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
      " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const isOwnMessage = (msg: Message) =>
    msg.senderId === currentUserId || msg.sender === currentUserRole;

  const bg = darkMode ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-200";
  const inputBg = darkMode ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400";
  const chatBg = darkMode ? "bg-[#0f0f0f]" : "bg-gray-50";

  return (
    <div className={`flex flex-col rounded-xl border ${bg} overflow-hidden`}>
      {/* Messages area */}
      <div className={`flex-1 min-h-[300px] max-h-[420px] overflow-y-auto p-4 space-y-3 ${chatBg}`}>
        {loading ? (
          <div className="flex items-center justify-center h-full py-12">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full py-12">
            <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const own = isOwnMessage(msg);
              return (
                <div key={i} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${own ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    {!own && (
                      <span className={`text-xs font-medium px-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {msg.senderName}
                      </span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      own
                        ? "bg-accent text-white rounded-br-sm"
                        : darkMode
                          ? "bg-white/10 text-gray-100 rounded-bl-sm"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[10px] px-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      {!disabled && (
        <div className={`p-3 border-t ${darkMode ? "border-white/10" : "border-gray-200"} flex gap-2 items-end`}>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            className={`flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${inputBg}`}
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="shrink-0 w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
