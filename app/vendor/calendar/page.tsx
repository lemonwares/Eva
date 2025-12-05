"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  X,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarEvent {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  location: string;
  type: string;
  color: string;
  status: string;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const getEventColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-500";
    case "PENDING":
      return "bg-yellow-500";
    case "COMPLETED":
      return "bg-blue-500";
    case "CANCELLED":
      return "bg-red-500";
    default:
      return "bg-accent";
  }
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function VendorCalendarPage() {
  const { darkMode } = useVendorTheme();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [view, setView] = useState<"month" | "week" | "day">("month");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings?limit=100");
      if (res.ok) {
        const data = await res.json();
        const bookings = data.bookings || [];

        // Transform bookings into calendar events
        const calendarEvents: CalendarEvent[] = bookings.map(
          (booking: any) => ({
            id: booking.id,
            title: booking.eventType || "Event",
            client:
              booking.quote?.inquiry?.fromName ||
              booking.clientName ||
              "Client",
            date: new Date(booking.eventDate).toISOString().split("T")[0],
            time: formatTime(booking.eventDate),
            location: booking.eventLocation || "TBD",
            type: booking.eventType || "event",
            color: getEventColor(booking.status),
            status: booking.status,
          })
        );

        setEvents(calendarEvents);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <VendorLayout
      title="Calendar"
      actionButton={{
        label: "View Bookings",
        onClick: () => router.push("/vendor/bookings"),
      }}
    >
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth(-1)}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          <h2
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            } min-w-[180px] text-center`}
          >
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "border-white/10 text-white hover:bg-white/10"
                : "border-gray-200 text-gray-900 hover:bg-gray-50"
            } transition-colors text-sm`}
          >
            Today
          </button>
          <div
            className={`flex rounded-lg overflow-hidden border ${
              darkMode ? "border-white/10" : "border-gray-200"
            }`}
          >
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm capitalize transition-colors ${
                  view === v
                    ? "bg-accent text-white"
                    : `${
                        darkMode
                          ? "text-gray-400 hover:bg-white/10"
                          : "text-gray-600 hover:bg-gray-50"
                      }`
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div
          className={`${
            darkMode
              ? "bg-[#141414] border-white/10"
              : "bg-white border-gray-200"
          } rounded-xl border p-20 flex items-center justify-center`}
        >
          <Loader2
            className={`w-8 h-8 animate-spin ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          />
        </div>
      ) : (
        <div
          className={`${
            darkMode
              ? "bg-[#141414] border-white/10"
              : "bg-white border-gray-200"
          } rounded-xl border overflow-hidden`}
        >
          {/* Days of Week Header */}
          <div
            className={`grid grid-cols-7 ${
              darkMode ? "border-white/10" : "border-gray-200"
            } border-b`}
          >
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-gray-500 text-sm font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDate(day) : [];
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] sm:min-h-[120px] p-2 ${
                    darkMode ? "border-white/10" : "border-gray-200"
                  } border-b border-r ${
                    day
                      ? `${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`
                      : `${darkMode ? "bg-white/2" : "bg-gray-50/50"}`
                  } transition-colors`}
                >
                  {day && (
                    <>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm mb-1 ${
                          isToday
                            ? "bg-accent text-white"
                            : `${darkMode ? "text-gray-400" : "text-gray-600"}`
                        }`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`w-full text-left px-2 py-1 rounded text-xs ${event.color} text-white truncate hover:opacity-80 transition-opacity`}
                          >
                            {event.title}
                          </button>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="text-gray-500 text-xs px-2">
                            +{dayEvents.length - 2} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Events Sidebar */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <h3
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-semibold mb-4`}
            >
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {events.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className={`flex items-start gap-4 p-4 rounded-lg ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-gray-50 hover:bg-gray-100"
                  } transition-colors cursor-pointer`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div
                    className={`w-1 h-full min-h-[60px] rounded-full ${event.color}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {event.title}
                        </h4>
                        <p className="text-gray-500 text-sm">{event.client}</p>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {event.date}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-4 mt-2 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <h3
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-semibold mb-4`}
            >
              Booking Status
            </h3>
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Confirmed
                  </span>
                </div>
                <span
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-medium`}
                >
                  {events.filter((e) => e.status === "CONFIRMED").length}
                </span>
              </div>
              <div
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Pending
                  </span>
                </div>
                <span
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-medium`}
                >
                  {events.filter((e) => e.status === "PENDING").length}
                </span>
              </div>
              <div
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Completed
                  </span>
                </div>
                <span
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-medium`}
                >
                  {events.filter((e) => e.status === "COMPLETED").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-6 w-full max-w-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-12 rounded-full ${selectedEvent.color}`}
                />
                <div>
                  <h3
                    className={`text-xl font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedEvent.title}
                  </h3>
                  <p className="text-gray-500">{selectedEvent.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`flex items-center gap-3 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <User size={18} />
                <span>{selectedEvent.client}</span>
              </div>
              <div
                className={`flex items-center gap-3 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Clock size={18} />
                <span>{selectedEvent.time}</span>
              </div>
              <div
                className={`flex items-center gap-3 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <MapPin size={18} />
                <span>{selectedEvent.location}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  router.push(`/vendor/bookings`);
                }}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "border-white/10 text-white hover:bg-white/10"
                    : "border-gray-200 text-gray-900 hover:bg-gray-50"
                } transition-colors`}
              >
                Manage Booking
              </button>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  router.push(`/vendor/bookings`);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}
