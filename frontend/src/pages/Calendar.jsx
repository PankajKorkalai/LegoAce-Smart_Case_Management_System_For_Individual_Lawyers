import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Briefcase,
  Bell,
  X,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  RefreshCw,
  Filter,
  Calendar as CalendarIcon,
  List,
  Grid,
  AlertCircle,
  ChevronDown,
  Edit,
  Trash2,
  Repeat,
  Users,
  Mail,
  Phone,
  Video,
  Building,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

const formatDateForAPI = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

/* -------------------- API SERVICE -------------------- */

const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const calendarAPI = {
  getEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/calendar/events${queryString ? `?${queryString}` : ""}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_URL}/calendar/events`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error("Failed to create event");
    return response.json();
  },

  updateEvent: async (id, eventData) => {
    const response = await fetch(`${API_URL}/calendar/events/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error("Failed to update event");
    return response.json();
  },

  updateEventStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/calendar/events/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update event status");
    return response.json();
  },

  deleteEvent: async (id) => {
    const response = await fetch(`${API_URL}/calendar/events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete event");
    return response.json();
  },

  getReminders: async () => {
    const response = await fetch(`${API_URL}/calendar/reminders/upcoming`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch reminders");
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/calendar/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },
};

/* -------------------- ADD EVENT MODAL -------------------- */

function AddEventModal({ isOpen, onClose, onAddEvent, selectedDate, editingEvent, onUpdateEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    tag: "Meeting",
    date: selectedDate ? formatDateForAPI(selectedDate) : "",
    startTime: "",
    endTime: "",
    location: "",
    case: "",
    description: "",
    reminder: false,
    reminderTime: "15",
    recurrence: "none",
    recurrenceEndDate: "",
    attendees: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [attendeeInput, setAttendeeInput] = useState({ name: "", email: "" });
  const [showRecurrence, setShowRecurrence] = useState(false);

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

  const reminderTimes = [
    { value: "5", label: "5 minutes before" },
    { value: "15", label: "15 minutes before" },
    { value: "30", label: "30 minutes before" },
    { value: "60", label: "1 hour before" },
    { value: "120", label: "2 hours before" },
    { value: "1440", label: "1 day before" },
    { value: "10080", label: "1 week before" },
  ];

  const recurrenceOptions = [
    { value: "none", label: "No recurrence" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || "",
        tag: editingEvent.tag || "Meeting",
        date: editingEvent.date || "",
        startTime: editingEvent.startTime || "",
        endTime: editingEvent.endTime || "",
        location: editingEvent.location || "",
        case: editingEvent.case || "",
        description: editingEvent.description || "",
        reminder: editingEvent.reminder || false,
        reminderTime: editingEvent.reminderTime || "15",
        recurrence: editingEvent.recurrence || "none",
        recurrenceEndDate: editingEvent.recurrenceEndDate || "",
        attendees: editingEvent.attendees || [],
      });
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addAttendee = () => {
    if (attendeeInput.name && attendeeInput.email) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, { ...attendeeInput, status: "pending" }]
      }));
      setAttendeeInput({ name: "", email: "" });
    }
  };

  const removeAttendee = (index) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (editingEvent) {
        const updatedEvent = await calendarAPI.updateEvent(editingEvent.id, formData);
        onUpdateEvent(updatedEvent);
      } else {
        const newEvent = await calendarAPI.createEvent(formData);
        onAddEvent(newEvent);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Case
              </label>
              <input
                type="text"
                name="case"
                value={formData.case}
                onChange={handleChange}
                placeholder="Case name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
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
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

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
              {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>}
            </div>

            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
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

            {/* Attendees Section */}
            <div className="md:col-span-2 border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={14} className="inline mr-1" /> Attendees
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={attendeeInput.name}
                  onChange={(e) => setAttendeeInput(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={attendeeInput.email}
                  onChange={(e) => setAttendeeInput(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={addAttendee}
                  className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              {formData.attendees.length > 0 && (
                <div className="space-y-1">
                  {formData.attendees.map((attendee, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{attendee.name}</p>
                        <p className="text-xs text-gray-500">{attendee.email}</p>
                      </div>
                      <button type="button" onClick={() => removeAttendee(idx)} className="text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reminder Section */}
            <div className="md:col-span-2 border-t pt-4">
              <div className="flex items-center justify-between">
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
                {formData.reminder && (
                  <select
                    name="reminderTime"
                    value={formData.reminderTime}
                    onChange={handleChange}
                    className="px-2 py-1 border rounded-lg text-sm"
                  >
                    {reminderTimes.map(rt => (
                      <option key={rt.value} value={rt.value}>{rt.label}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Recurrence Section */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setShowRecurrence(!showRecurrence)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Repeat size={14} />
                {formData.recurrence !== "none" ? `Repeats ${formData.recurrence}` : "Set recurrence"}
                <ChevronDown size={14} className={`transform transition ${showRecurrence ? "rotate-180" : ""}`} />
              </button>

              {showRecurrence && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                  <select
                    name="recurrence"
                    value={formData.recurrence}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    {recurrenceOptions.map(ro => (
                      <option key={ro.value} value={ro.value}>{ro.label}</option>
                    ))}
                  </select>
                  {formData.recurrence !== "none" && (
                    <div>
                      <label className="text-xs text-gray-500">End Date (optional)</label>
                      <input
                        type="date"
                        name="recurrenceEndDate"
                        value={formData.recurrenceEndDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : (editingEvent ? "Update Event" : "Add Event")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------- EVENT DETAIL MODAL -------------------- */

function EventDetailModal({ event, onClose, onEdit, onDelete, onStatusChange }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle size={14} />;
      case "cancelled": return <XCircle size={14} />;
      case "in-progress": return <ClockIcon size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getColorClass = (color) => {
    const colors = {
      red: "bg-red-100 text-red-600",
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-700",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return colors[color] || "bg-gray-100 text-gray-600";
  };

  const isPastEvent = event.date < new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${event.color === "red" ? "bg-red-500" : event.color === "blue" ? "bg-blue-500" : event.color === "green" ? "bg-green-500" : "bg-yellow-500"}`} />
            <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)} flex items-center gap-1`}>
              {getStatusIcon(event.status)}
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getColorClass(event.color)}`}>
              {event.tag}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays size={14} />
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={14} />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={14} />
                <span>{event.location}</span>
              </div>
            )}
            {event.case && (
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase size={14} />
                <span>{event.case}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700">{event.description}</p>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-2">Attendees</p>
              <div className="space-y-1">
                {event.attendees.map((attendee, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Users size={12} className="text-gray-400" />
                    <span>{attendee.name}</span>
                    <span className="text-xs text-gray-400">({attendee.email})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            {event.status === "upcoming" && !isPastEvent && (
              <>
                <button
                  onClick={() => onStatusChange(event.id, "in-progress")}
                  className="flex-1 px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Start
                </button>
                <button
                  onClick={() => onStatusChange(event.id, "completed")}
                  className="flex-1 px-3 py-1.5 text-sm border border-green-500 text-green-600 rounded-lg hover:bg-green-50"
                >
                  Complete
                </button>
              </>
            )}
            {event.status === "in-progress" && (
              <button
                onClick={() => onStatusChange(event.id, "completed")}
                className="flex-1 px-3 py-1.5 text-sm border border-green-500 text-green-600 rounded-lg hover:bg-green-50"
              >
                Mark Complete
              </button>
            )}
            {event.status !== "cancelled" && event.status !== "completed" && (
              <button
                onClick={() => onStatusChange(event.id, "cancelled")}
                className="flex-1 px-3 py-1.5 text-sm border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => {
                onEdit(event);
                onClose();
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <Edit size={14} className="inline mr-1" /> Edit
            </button>
            <button
              onClick={() => {
                onDelete(event.id);
                onClose();
              }}
              className="px-3 py-1.5 text-sm border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={14} className="inline mr-1" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- MAIN CALENDAR COMPONENT -------------------- */

export default function CalendarSection() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [events, setEvents] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewType, setViewType] = useState("month");

  const year = current.getFullYear();
  const month = current.getMonth();
  const days = getMonthDays(year, month);

  // Load events from API
  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await calendarAPI.getEvents({ status: statusFilter });
      setEventsList(data);

      // Organize events by date for quick lookup
      const eventsByDate = {};
      data.forEach(event => {
        if (!eventsByDate[event.date]) {
          eventsByDate[event.date] = [];
        }
        eventsByDate[event.date].push(event);
      });
      setEvents(eventsByDate);

      const statsData = await calendarAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const getEventsForDate = (date) => {
    const key = formatKey(year, month, date);
    return events[key] || [];
  };

  const handleAddEvent = async (newEvent) => {
    await loadEvents();
  };

  const handleUpdateEvent = async (updatedEvent) => {
    await loadEvents();
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await calendarAPI.updateEventStatus(eventId, newStatus);
      await loadEvents();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await calendarAPI.deleteEvent(eventId);
        await loadEvents();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const changeMonth = (dir) => {
    setCurrent(new Date(year, month + dir, 1));
  };

  const goToToday = () => {
    setCurrent(today);
    setSelected(today);
  };

  const selectedKey = formatDateForAPI(selected);
  const selectedEventsForDay = eventsList.filter(e => e.date === selectedKey);

  return (
    <div className="flex gap-6">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 flex-wrap gap-3">
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
              onClick={goToToday}
              className="border border-gray-200 px-3 py-1.5 rounded-md text-sm bg-white hover:bg-gray-100"
            >
              Today
            </button>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 px-3 py-1.5 rounded-md text-sm bg-white"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => {
                setEditingEvent(null);
                setShowModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              + Add Event
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        {stats && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex gap-6 text-sm">
            <div>
              <span className="text-gray-500">Total:</span>
              <span className="ml-1 font-semibold">{stats.total}</span>
            </div>
            <div>
              <span className="text-gray-500">Upcoming:</span>
              <span className="ml-1 font-semibold text-blue-600">{stats.upcoming}</span>
            </div>
            <div>
              <span className="text-gray-500">This Week:</span>
              <span className="ml-1 font-semibold text-green-600">{stats.thisWeek}</span>
            </div>
            <div>
              <span className="text-gray-500">Completed:</span>
              <span className="ml-1 font-semibold text-gray-600">{stats.completed}</span>
            </div>
          </div>
        )}

        {/* DAYS HEADER */}
        <div className="grid grid-cols-7 text-sm bg-gray-100 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2 text-center font-medium text-gray-600">
              {d}
            </div>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {days.map((d, i) => (
              <div
                key={i}
                onClick={() => d.current && setSelected(new Date(year, month, d.date))}
                className={`h-32 px-2 py-1 border-r border-b border-gray-200 cursor-pointer transition overflow-y-auto
                  ${(i + 1) % 7 === 0 ? "border-r-0" : ""}
                  ${d.current ? "bg-white" : "bg-gray-50 text-gray-400"}
                  ${d.current && selected.getDate() === d.date
                    ? "bg-green-50 border border-green-600"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div className="text-sm font-medium text-gray-700 sticky top-0 bg-inherit">
                  {d.date}
                </div>

                <div className="space-y-1 mt-1">
                  {d.current &&
                    getEventsForDate(d.date).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(ev);
                        }}
                        className={`text-xs px-2 py-[2px] rounded-md truncate font-medium cursor-pointer hover:opacity-80
                          ${ev.color === "red"
                            ? "bg-red-100 text-red-600"
                            : ev.color === "blue"
                              ? "bg-blue-100 text-blue-600"
                              : ev.color === "green"
                                ? "bg-green-100 text-green-600"
                                : ev.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : ev.color === "purple"
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-gray-100 text-gray-600"
                          }
                          ${ev.status === "completed" ? "line-through opacity-60" : ""}
                          ${ev.status === "cancelled" ? "line-through opacity-50" : ""}
                        `}
                      >
                        {ev.startTime && (
                          <span className="opacity-70 mr-1">{ev.startTime.slice(0, 5)}</span>
                        )}
                        {ev.title}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-96 space-y-4 hidden lg:block">
        {/* SELECTED EVENTS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 font-medium mb-4 text-gray-800">
            <CalendarDays size={16} />
            {selected.toDateString()}
          </div>

          {selectedEventsForDay.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No events for this day
            </div>
          ) : (
            selectedEventsForDay.map((ev) => (
              <div
                key={ev.id}
                onClick={() => handleEventClick(ev)}
                className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-3 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <h4 className={`font-medium text-sm text-gray-800 ${ev.status === "completed" ? "line-through" : ""}`}>
                    {ev.title}
                  </h4>
                  <Bell size={14} className="text-gray-400" />
                </div>

                {ev.tag && (
                  <span className={`text-xs px-2 py-[2px] rounded-md mt-1 inline-block font-medium
                    ${ev.color === "red" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}
                  `}>
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

                {ev.description && (
                  <p className="text-xs text-gray-500 mt-2 border-t pt-2 truncate">
                    {ev.description}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ev.status === "completed" ? "bg-green-100 text-green-700" :
                      ev.status === "cancelled" ? "bg-red-100 text-red-700" :
                        ev.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                    }`}>
                    {ev.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* UPCOMING REMINDERS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 font-medium mb-3 text-gray-800">
            <Bell size={16} />
            Upcoming Reminders
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {eventsList.filter(e => e.reminder && e.status === "upcoming").length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No upcoming reminders
              </div>
            ) : (
              eventsList.filter(e => e.reminder && e.status === "upcoming").slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleEventClick(r)}
                  className="flex gap-3 items-center p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                    ${r.color === "red" ? "bg-red-100 text-red-600" :
                      r.color === "green" ? "bg-green-100 text-green-600" :
                        "bg-blue-100 text-blue-600"}
                  `}>
                    <CalendarDays size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.date).toLocaleDateString()} {r.time ? `• ${r.time}` : ""}
                    </p>
                  </div>
                  <Bell size={12} className="text-gray-300" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddEventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEvent(null);
        }}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        selectedDate={selected}
        editingEvent={editingEvent}
      />

      {showDetailModal && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setShowDetailModal(false)}
          onEdit={handleEditClick}
          onDelete={handleDeleteEvent}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}