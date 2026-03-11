"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Clock } from "lucide-react";

interface WeeklySchedule {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

interface BusinessHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (schedules: WeeklySchedule[]) => Promise<void>;
  initialSchedules?: WeeklySchedule[];
  darkMode: boolean;
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BusinessHoursModal({
  isOpen,
  onClose,
  onSubmit,
  initialSchedules = [],
  darkMode,
}: BusinessHoursModalProps) {
  const [schedules, setSchedules] = useState<WeeklySchedule[]>(() => {
    // Initialize with existing schedules or default values
    if (initialSchedules.length === 7) {
      return initialSchedules;
    }
    
    // Create default schedule for all 7 days
    return Array.from({ length: 7 }, (_, i) => {
      const existing = initialSchedules.find((s) => s.dayOfWeek === i);
      return existing || {
        dayOfWeek: i,
        startTime: "09:00",
        endTime: "17:00",
        isClosed: i === 0 || i === 6, // Closed on Sunday and Saturday by default
      };
    });
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleClosed = (dayIndex: number) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.dayOfWeek === dayIndex
          ? { ...schedule, isClosed: !schedule.isClosed }
          : schedule
      )
    );
  };

  const handleTimeChange = (
    dayIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.dayOfWeek === dayIndex
          ? { ...schedule, [field]: value }
          : schedule
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(schedules);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save hours");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                darkMode ? "bg-[#1a1a1a]" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
                  darkMode
                    ? "bg-[#1a1a1a] border-white/10"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Business Hours
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`p-1 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-white/10 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  } disabled:opacity-50`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.dayOfWeek}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        darkMode
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {/* Day Name */}
                      <div className="w-28">
                        <span
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {WEEKDAYS[schedule.dayOfWeek]}
                        </span>
                      </div>

                      {/* Closed Toggle */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={schedule.isClosed}
                          onChange={() => handleToggleClosed(schedule.dayOfWeek)}
                          className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Closed
                        </span>
                      </div>

                      {/* Time Inputs */}
                      {!schedule.isClosed && (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) =>
                              handleTimeChange(
                                schedule.dayOfWeek,
                                "startTime",
                                e.target.value
                              )
                            }
                            className={`px-3 py-2 rounded-lg border text-sm ${
                              darkMode
                                ? "bg-white/5 border-white/10 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30`}
                          />
                          <span
                            className={darkMode ? "text-gray-400" : "text-gray-600"}
                          >
                            to
                          </span>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) =>
                              handleTimeChange(
                                schedule.dayOfWeek,
                                "endTime",
                                e.target.value
                              )
                            }
                            className={`px-3 py-2 rounded-lg border text-sm ${
                              darkMode
                                ? "bg-white/5 border-white/10 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? "bg-white/5 text-white hover:bg-white/10"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Hours"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
