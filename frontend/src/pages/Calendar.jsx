import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Briefcase,
  Bell,
  X,
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

/* -------------------- MODAL COMPONENT -------------------- */

function AddEventModal({ isOpen, onClose, onAddEvent, selectedDate }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "Meeting",
    relatedCase: "",
    date: selectedDate ? formatKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    reminder: false,
  });

  const [errors, setErrors] = useState({});

  const eventTypes = [
    "Court Hearing",
    "Meeting",
    "Deadline",
    "Reminder",
    "Mediation",
    "Deposition",
    "Filing",
    "Other",
  ];

  const caseOptions = [
    "Smith vs. Johnson Corp",
    "Rodriguez Employment Claim",
    "Davis Case",
    "None",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.startTime && !formData.endTime) {
      newErrors.endTime = "End time is required if start time is set";
    }
    if (formData.endTime && !formData.startTime) {
      newErrors.startTime = "Start time is required if end time is set";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const timeString = formData.startTime && formData.endTime
      ? `${formData.startTime} - ${formData.endTime}`
      : "";

    // Determine color based on event type
    let color = "blue";
    if (formData.type === "Court Hearing") color = "red";
    else if (formData.type === "Deadline" || formData.type === "Filing") color = "yellow";
    else if (formData.type === "Meeting") color = "blue";
    else if (formData.type === "Mediation") color = "green";
    else color = "blue";

    const newEvent = {
      id: Date.now(),
      title: formData.title,
      tag: formData.type,
      color: color,
      time: timeString,
      location: formData.location || "",
      case: formData.relatedCase === "None" ? "" : formData.relatedCase,
      desc: formData.description || "",
    };

    onAddEvent(formData.date, newEvent);
    onClose();
    // Reset form
    setFormData({
      title: "",
      type: "Meeting",
      relatedCase: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      reminder: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Event</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.title ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Case
            </label>
            <select
              name="relatedCase"
              value={formData.relatedCase}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {caseOptions.map((caseName) => (
                <option key={caseName} value={caseName}>
                  {caseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.date ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.startTime ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.startTime && (
                <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.endTime ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.endTime && (
                <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location or meeting link"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event details and notes"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="reminder"
              checked={formData.reminder}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <label className="text-sm text-gray-700">Set Reminder</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------- MAIN -------------------- */

export default function CalendarSection() {
  const today = new Date();

  const [current, setCurrent] = useState(new Date(2026, 1));
  const [selected, setSelected] = useState(new Date(2026, 1, 5));
  const [showModal, setShowModal] = useState(false);

  const year = current.getFullYear();
  const month = current.getMonth();

  const days = getMonthDays(year, month);

  /* -------------------- EVENTS STATE -------------------- */
  const [events, setEvents] = useState({
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

  // Function to add a new event
  const handleAddEvent = (dateKey, newEvent) => {
    setEvents((prevEvents) => {
      const existingEvents = prevEvents[dateKey] || [];
      return {
        ...prevEvents,
        [dateKey]: [...existingEvents, newEvent],
      };
    });
  };

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

          <div className="flex gap-2">
            <button
              onClick={() => setCurrent(today)}
              className="border border-gray-200 px-3 py-1.5 rounded-md text-sm bg-white hover:bg-gray-100"
            >
              Today
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              + Add Event
            </button>
          </div>
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

          {selectedEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No events for this day
            </div>
          ) : (
            selectedEvents.map((ev) => (
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
            ))
          )}
        </div>

        {/* REMINDERS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 font-medium mb-3 text-gray-800">
            <Bell size={16} />
            Upcoming Reminders
          </div>

          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No upcoming reminders
              </div>
            ) : (
              reminders.map((r) => (
                <div
                  key={r.id}
                  className="flex gap-3 items-center p-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center
                    ${r.color === "red"
                        ? "bg-red-100 text-red-600"
                        : r.color === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    <CalendarDays size={14} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.date} {r.time ? `• ${r.time}` : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AddEventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddEvent={handleAddEvent}
        selectedDate={selected}
      />
    </div>
  );
}