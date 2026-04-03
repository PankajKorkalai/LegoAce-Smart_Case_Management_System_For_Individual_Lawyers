import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Briefcase,
  Bell,
} from "lucide-react";
import { useState } from "react";

/* -------------------- DATE UTILS -------------------- */

const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevLast = new Date(year, month, 0).getDate();

  const days = [];

  // prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: prevLast - i, current: false });
  }

  // current month
  for (let i = 1; i <= lastDate; i++) {
    days.push({ date: i, current: true });
  }

  // next padding
  while (days.length % 7 !== 0) {
    days.push({ date: days.length, current: false });
  }

  return days;
};

const formatKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/* -------------------- MAIN -------------------- */

export default function CalendarSection() {
  const today = new Date();

  const [current, setCurrent] = useState(today);
  const [selected, setSelected] = useState(today);

  const year = current.getFullYear();
  const month = current.getMonth();

  const days = getMonthDays(year, month);

  /* -------------------- EVENTS -------------------- */

  const [events] = useState({
    "2026-02-05": [
      {
        id: 1,
        title: "Court Hearing - Smith vs. Johnson",
        tag: "Court Hearing",
        color: "red",
        time: "09:00 - 11:00",
        location: "Court Room 4, Superior Court",
        case: "Smith vs. Johnson Corp",
        desc: "Motion hearing for preliminary injunction",
      },
      {
        id: 2,
        title: "Client Meeting - Maria Rodriguez",
        tag: "Meeting",
        color: "blue",
        time: "14:00 - 15:00",
        location: "Video Call",
        case: "Rodriguez Employment Claim",
        desc: "Case strategy discussion",
      },
    ],
    "2026-02-10": [
      {
        id: 3,
        title: "Team Meeting",
        tag: "Meeting",
        color: "blue",
        time: "09:00 - 10:00",
        location: "Main Conference Room",
        case: "",
        desc: "Weekly case review meeting",
      },
    ],
  });

  const getEvents = (d) =>
    events[formatKey(year, month, d)] || [];

  const selectedKey = formatKey(
    selected.getFullYear(),
    selected.getMonth(),
    selected.getDate()
  );

  const selectedEvents = events[selectedKey] || [];

  /* -------------------- REMINDERS -------------------- */

  const reminders = Object.entries(events)
    .flatMap(([date, evs]) =>
      evs.map((e) => ({ ...e, date }))
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  /* -------------------- NAV -------------------- */

  const changeMonth = (dir) => {
    setCurrent(new Date(year, month + dir, 1));
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="flex gap-6">
      {/* LEFT */}
      <div className="flex-1 bg-white rounded-xl shadow border">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 border rounded hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>

            <h2 className="text-lg font-semibold">
              {current.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              onClick={() => changeMonth(1)}
              className="p-2 border rounded hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setCurrent(new Date())}
            className="border px-3 py-1 rounded text-sm"
          >
            Today
          </button>
        </div>

        {/* DAYS */}
        <div className="grid grid-cols-7 text-sm bg-gray-50 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (d) => (
              <div key={d} className="p-2 text-center">
                {d}
              </div>
            )
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-7">
          {days.map((d, i) => (
            <div
              key={i}
              onClick={() =>
                d.current &&
                setSelected(new Date(year, month, d.date))
              }
              className={`h-28 p-2 border cursor-pointer
              ${d.current ? "bg-white" : "bg-gray-50 text-gray-400"}
              ${d.current &&
                  selected.getDate() === d.date
                  ? "bg-green-50 border-green-600"
                  : ""
                }`}
            >
              <div className="text-sm font-medium">
                {d.date}
              </div>

              <div className="space-y-1 mt-1">
                {d.current &&
                  getEvents(d.date).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-xs px-2 py-1 rounded truncate
                      ${ev.color === "red"
                          ? "bg-red-100 text-red-600"
                          : ev.color === "blue"
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                    >
                      {ev.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-96 space-y-4 hidden lg:block">
        {/* SELECTED DAY */}
        <div className="bg-white rounded-xl shadow border p-4">
          <div className="flex items-center gap-2 font-medium mb-4">
            <CalendarDays size={16} />
            {selected.toDateString()}
          </div>

          {selectedEvents.length === 0 && (
            <p className="text-sm text-gray-500">
              No events
            </p>
          )}

          {selectedEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-gray-50 p-4 rounded-lg mb-3"
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">
                  {ev.title}
                </h4>
                <Bell size={14} />
              </div>

              <span
                className={`text-xs px-2 py-1 rounded mt-1 inline-block
                ${ev.color === "red"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                  }`}
              >
                {ev.tag}
              </span>

              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p className="flex gap-2 items-center">
                  <Clock size={14} /> {ev.time}
                </p>
                <p className="flex gap-2 items-center">
                  <MapPin size={14} /> {ev.location}
                </p>
                {ev.case && (
                  <p className="flex gap-2 items-center">
                    <Briefcase size={14} /> {ev.case}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2 border-t pt-2">
                {ev.desc}
              </p>
            </div>
          ))}
        </div>

        {/* REMINDERS */}
        <div className="bg-white rounded-xl shadow border p-4">
          <div className="flex items-center gap-2 font-medium mb-3">
            <Bell size={16} />
            Upcoming Reminders
          </div>

          <div className="space-y-3">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="flex gap-3 items-center"
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center
                  ${r.color === "red"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                    }`}
                >
                  <CalendarDays size={14} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {r.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.date} • {r.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}