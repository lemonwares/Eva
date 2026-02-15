"use client";

import {
  type OnboardingData,
  type WeeklyScheduleDay,
  WEEKDAYS,
} from "../types";

interface Props {
  formData: OnboardingData;
  handleScheduleChange: (
    idx: number,
    field: keyof WeeklyScheduleDay,
    value: string | boolean,
  ) => void;
}

export function ScheduleStep({ formData, handleScheduleChange }: Props) {
  return (
    <div className="space-y-4">
      {formData.weeklySchedule.map((day, idx) => {
        const isOpen = !day.isClosed;
        return (
          <div
            key={day.dayOfWeek}
            className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-colors ${
              isOpen ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"
            }`}
          >
            {/* Day name + toggle */}
            <div className="flex items-center gap-3 sm:w-44 shrink-0">
              <button
                type="button"
                role="switch"
                aria-checked={isOpen}
                onClick={() => handleScheduleChange(idx, "isClosed", isOpen)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  isOpen ? "bg-[#0097b2]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    isOpen ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${isOpen ? "text-gray-800" : "text-gray-400"}`}
              >
                {WEEKDAYS[day.dayOfWeek]}
              </span>
            </div>

            {/* Time inputs */}
            {isOpen ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) =>
                    handleScheduleChange(idx, "startTime", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2]/20"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) =>
                    handleScheduleChange(idx, "endTime", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2]/20"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
