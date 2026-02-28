import { Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface WeeklySchedule {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

interface ScheduleDisplayProps {
  weeklySchedule: WeeklySchedule[];
  expanded: boolean;
  onToggle: () => void;
}

export function ScheduleDisplay({
  weeklySchedule,
  expanded,
  onToggle,
}: ScheduleDisplayProps) {
  const days = [
    { name: "Monday", idx: 1 },
    { name: "Tuesday", idx: 2 },
    { name: "Wednesday", idx: 3 },
    { name: "Thursday", idx: 4 },
    { name: "Friday", idx: 5 },
    { name: "Saturday", idx: 6 },
    { name: "Sunday", idx: 0 },
  ];

  const now = new Date();
  // Remap JS getDay() (0=Sunday, 1=Monday, ...) to idx (1=Monday, ..., 0=Sunday)
  const jsDay = now.getDay();
  const currentDay = jsDay === 0 ? 0 : jsDay;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTimeToMinutes = (t?: string) => {
    if (!t) return 0;
    const parts = t.split(":");
    const h = parseInt(parts[0] || "0", 10);
    const m = parseInt(parts[1] || "0", 10);
    return h * 60 + m;
  };

  // Find today's schedule
  const todaySched = weeklySchedule.find(
    (s) => s.dayOfWeek === currentDay && !s.isClosed,
  );
  const openUntil = todaySched ? todaySched.endTime.slice(0, 5) : null;

  // Is open now?
  const isOpenNow = () => {
    if (!todaySched) return false;
    const start = parseTimeToMinutes(todaySched.startTime);
    const end = parseTimeToMinutes(todaySched.endTime);
    return nowMinutes >= start && nowMinutes <= end;
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-accent" />
          <div className="text-left">
            <p className="font-semibold">
              {isOpenNow() ? (
                <span className="text-accent flex items-center gap-2">
                  Open until <span className="text-black">{openUntil}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">Closed</span>
              )}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="schedule-list"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "0.75rem" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden space-y-2"
          >
            {days.map((d) => {
              const sched = weeklySchedule.find((s) => s.dayOfWeek === d.idx);
              let dotClass = "bg-gray-300";
              let timeDisplay = "Closed";

              if (sched && !sched.isClosed) {
                const start = parseTimeToMinutes(sched.startTime);
                const end = parseTimeToMinutes(sched.endTime);
                // Format the time display
                timeDisplay = `${sched.startTime.slice(
                  0,
                  5,
                )} - ${sched.endTime.slice(0, 5)}`;

                if (d.idx === currentDay) {
                  dotClass = nowMinutes > end ? "bg-red-500" : "bg-green-500";
                } else {
                  dotClass = "bg-green-500";
                }
              }

              return (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${dotClass}`} />
                    <span
                      className={`font-medium ${
                        d.idx === currentDay
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {d.name}
                    </span>
                  </div>
                  <div
                    className={`text-sm ${
                      sched && !sched.isClosed
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {timeDisplay}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
