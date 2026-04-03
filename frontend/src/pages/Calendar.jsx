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

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: prevLast - i, current: false });
  }

  for (let i = 1; i <= lastDate; i++) {
    days.push({ date: i, current: true });
  }

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

  const [current, setCurrent] = useState(new Date(2026, 1));
  const [selected, setSelected] = useState(new Date(2026, 1, 5));

  const year = current.getFullYear();
  const month = current.getMonth();

  const days = getMonthDays(year, month);

  /* -------------------- EVENTS -------------------- */

  const [events] = useState({
    "2026-02-03": [
      { id: 11, title: "Contract Review", color: "green" },
      { id: 12, title: "Client Check-in", color: "blue" },
    ],
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
    "2026-02-06": [
      { id: 13, title: "Deposition - Davis Case", color: "green" },
    ],
    "2026-02-07": [
      { id: 14, title: "Discovery Response", color: "yellow" },
    ],
    "2026-02-10": [
      {
        id: 3,
        title: "Team Meeting",
        tag: "Meeting",
        color: "blue",
        time: "09:00 - 10:00",
        location: "Main Conference Room",
        desc: "Weekly case review meeting",
      },
    ],
    "2026-02-12": [
      { id: 15, title: "Document Filing", color: "yellow" },
      { id: 16, title: "Court Hearing", color: "red" },
    ],
    "2026-02-15": [
      { id: 17, title: "Mediation Session", color: "blue" },
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
      {/* LEFT PANEL */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              {current.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              onClick={() => changeMonth(1)}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setCurrent(today)}
            className="border border-gray-200 px-3 py-1.5 rounded-md text-sm bg-white hover:bg-gray-100"
          >
            Today
          </button>
        </div>

        {/* DAYS HEADER */}
        <div className="grid grid-cols-7 text-sm bg-gray-100 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (d) => (
              <div
                key={d}
                className="py-2 text-center font-medium text-gray-600"
              >
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
              className={`h-28 px-2 py-1 border-r border-b border-gray-200 cursor-pointer transition
              ${(i + 1) % 7 === 0 ? "border-r-0" : ""}
              ${d.current ? "bg-white" : "bg-gray-50 text-gray-400"}
              ${d.current &&
                  selected.getDate() === d.date
                  ? "bg-green-50 border border-green-600"
                  : "hover:bg-gray-50"
                }`}
            >
              <div className="text-sm font-medium text-gray-700">
                {d.date}
              </div>

              <div className="space-y-1 mt-1">
                {d.current &&
                  getEvents(d.date).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-xs px-2 py-[2px] rounded-md truncate font-medium
                      ${ev.color === "red"
                          ? "bg-red-100 text-red-600"
                          : ev.color === "blue"
                            ? "bg-blue-100 text-blue-600"
                            : ev.color === "green"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-700"
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
        {/* SELECTED EVENTS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 font-medium mb-4 text-gray-800">
            <CalendarDays size={16} />
            {selected.toDateString()}
          </div>

          {selectedEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-3"
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm text-gray-800">
                  {ev.title}
                </h4>
                <Bell size={14} />
              </div>

              {ev.tag && (
                <span className="text-xs px-2 py-[2px] rounded-md mt-1 inline-block font-medium bg-blue-100 text-blue-600">
                  {ev.tag}
                </span>
              )}

              <div className="text-sm text-gray-600 mt-2 space-y-1">
                {ev.time && (
                  <p className="flex gap-2 items-center">
                    <Clock size={14} /> {ev.time}
                  </p>
                )}
                {ev.location && (
                  <p className="flex gap-2 items-center">
                    <MapPin size={14} /> {ev.location}
                  </p>
                )}
                {ev.case && (
                  <p className="flex gap-2 items-center">
                    <Briefcase size={14} /> {ev.case}
                  </p>
                )}
              </div>

              {ev.desc && (
                <p className="text-xs text-gray-500 mt-2 border-t pt-2">
                  {ev.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* REMINDERS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 font-medium mb-3 text-gray-800">
            <Bell size={16} />
            Upcoming Reminders
          </div>

          <div className="space-y-3">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="flex gap-3 items-center p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center
                  ${r.color === "red"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                    }`}
                >
                  <CalendarDays size={14} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {r.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.date} • {r.time || ""}
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