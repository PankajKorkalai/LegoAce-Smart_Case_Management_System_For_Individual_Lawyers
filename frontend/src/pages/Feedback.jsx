import { useState, useEffect } from "react";
import {
    Star,
    MessageSquare,
    Send,
    Check,
    AlertCircle,
    ThumbsUp,
    Calendar,
    User,
    Briefcase,
    Mail,
    ExternalLink,
    TrendingUp,
    Award,
    Clock,
    Filter,
    Search,
    Eye,
    Reply,
    Download,
} from "lucide-react";

/* -------------------- MAIN COMPONENT -------------------- */

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        averageRating: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
    });

    // Load feedbacks from localStorage
    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = () => {
        const savedFeedbacks = localStorage.getItem("legalflow_feedbacks");
        if (savedFeedbacks) {
            const data = JSON.parse(savedFeedbacks);
            setFeedbacks(data);
            calculateStats(data);
        } else {
            // Demo data
            const demoFeedbacks = [
                {
                    id: "fb_1",
                    caseId: "case_101",
                    caseName: "Smith vs. Johnson Corp",
                    clientName: "John Smith",
                    clientEmail: "john.smith@email.com",
                    rating: 5,
                    title: "Excellent legal representation",
                    feedback: "Mr. Johnson provided exceptional legal counsel throughout my case. His attention to detail and strategic approach led to a favorable outcome. I highly recommend his services.",
                    date: "2026-02-15T10:30:00",
                    status: "published",
                    lawyerResponse: "",
                },
                {
                    id: "fb_2",
                    caseId: "case_102",
                    caseName: "Rodriguez Employment Claim",
                    clientName: "Maria Rodriguez",
                    clientEmail: "maria.rodriguez@email.com",
                    rating: 4,
                    title: "Very professional and responsive",
                    feedback: "Great communication throughout the process. Always kept me updated on case progress. Would definitely work with again.",
                    date: "2026-02-10T14:20:00",
                    status: "published",
                    lawyerResponse: "Thank you Maria! It was a pleasure working with you.",
                },
                {
                    id: "fb_3",
                    caseId: "case_103",
                    caseName: "Davis vs. State Farm",
                    clientName: "Michael Davis",
                    clientEmail: "michael.davis@email.com",
                    rating: 5,
                    title: "Outstanding results",
                    feedback: "Couldn't be happier with the outcome. The team went above and beyond to ensure justice was served.",
                    date: "2026-02-05T09:15:00",
                    status: "published",
                    lawyerResponse: "",
                },
                {
                    id: "fb_4",
                    caseId: "case_104",
                    caseName: "Thompson Property Dispute",
                    clientName: "Sarah Thompson",
                    clientEmail: "sarah.thompson@email.com",
                    rating: 3,
                    title: "Good but room for improvement",
                    feedback: "Overall good experience, but communication could have been better during the initial stages.",
                    date: "2026-01-28T11:00:00",
                    status: "published",
                    lawyerResponse: "Thank you for your honest feedback. We're working on improving our initial response time.",
                },
                {
                    id: "fb_5",
                    caseId: "case_105",
                    caseName: "Wilson vs. City Council",
                    clientName: "Robert Wilson",
                    clientEmail: "robert.wilson@email.com",
                    rating: 5,
                    title: "Best lawyer in town!",
                    feedback: "Absolutely amazing! Won my case against all odds. Forever grateful.",
                    date: "2026-01-20T16:45:00",
                    status: "published",
                    lawyerResponse: "",
                },
            ];
            setFeedbacks(demoFeedbacks);
            calculateStats(demoFeedbacks);
            localStorage.setItem("legalflow_feedbacks", JSON.stringify(demoFeedbacks));
        }
        setLoading(false);
    };

    const calculateStats = (data) => {
        const total = data.length;
        const sum = data.reduce((acc, fb) => acc + fb.rating, 0);
        const averageRating = total > 0 ? (sum / total).toFixed(1) : 0;

        const fiveStar = data.filter(fb => fb.rating === 5).length;
        const fourStar = data.filter(fb => fb.rating === 4).length;
        const threeStar = data.filter(fb => fb.rating === 3).length;
        const twoStar = data.filter(fb => fb.rating === 2).length;
        const oneStar = data.filter(fb => fb.rating === 1).length;

        setStats({ total, averageRating, fiveStar, fourStar, threeStar, twoStar, oneStar });
    };

    const handleRespondToFeedback = (feedbackId, response) => {
        const updatedFeedbacks = feedbacks.map(fb =>
            fb.id === feedbackId ? { ...fb, lawyerResponse: response } : fb
        );
        setFeedbacks(updatedFeedbacks);
        localStorage.setItem("legalflow_feedbacks", JSON.stringify(updatedFeedbacks));
        setSelectedFeedback(null);
    };

    const getStarRating = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return "bg-green-100 text-green-700";
        if (rating >= 3.5) return "bg-blue-100 text-blue-700";
        if (rating >= 2.5) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    const filteredFeedbacks = feedbacks.filter(fb => {
        if (filter === "5star") return fb.rating === 5;
        if (filter === "4star") return fb.rating === 4;
        if (filter === "3star") return fb.rating === 3;
        if (filter === "2star") return fb.rating === 2;
        if (filter === "1star") return fb.rating === 1;

        if (searchTerm) {
            return fb.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fb.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fb.feedback.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const exportToCSV = () => {
        const headers = ["Client Name", "Case Name", "Rating", "Title", "Feedback", "Date", "Response"];
        const rows = filteredFeedbacks.map(fb => [
            fb.clientName,
            fb.caseName,
            fb.rating,
            fb.title,
            fb.feedback,
            new Date(fb.date).toLocaleDateString(),
            fb.lawyerResponse || "No response",
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `feedbacks_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading feedbacks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Client Feedback</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View and manage feedback received from clients after case completion
                    </p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Total Feedbacks</span>
                        <MessageSquare size={18} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Average Rating</span>
                        <Star size={18} className="text-yellow-500" />
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
                        <span className="text-sm text-gray-400">/ 5.0</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">5-Star Ratings</span>
                        <Award size={18} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.fiveStar}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Response Rate</span>
                        <TrendingUp size={18} className="text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {Math.round((feedbacks.filter(fb => fb.lawyerResponse).length / stats.total) * 100)}%
                    </p>
                </div>
            </div>

            {/* RATING DISTRIBUTION */}
            {/*<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = stats[`${rating}Star`];
                        const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-sm text-gray-600">{rating}</span>
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-12">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>*/}

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "all" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("5star")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "5star" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        5 Star
                    </button>
                    <button
                        onClick={() => setFilter("4star")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "4star" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        4 Star
                    </button>
                    <button
                        onClick={() => setFilter("3star")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "3star" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        3 Star
                    </button>
                    <button
                        onClick={() => setFilter("2star")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "2star" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        2 Star
                    </button>
                    <button
                        onClick={() => setFilter("1star")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "1star" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        1 Star
                    </button>
                </div>

                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by client or case..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                    />
                </div>
            </div>

            {/* FEEDBACK LIST */}
            <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                        <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400">No feedbacks found</p>
                    </div>
                ) : (
                    filteredFeedbacks.map((fb) => (
                        <div key={fb.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-5">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStarRating(fb.rating)}
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRatingColor(fb.rating)}`}>
                                                {fb.rating}.0
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-gray-800">{fb.title}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(fb.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Client & Case Info */}
                                <div className="flex flex-wrap gap-4 mb-3 text-sm">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <User size={14} />
                                        <span>{fb.clientName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Briefcase size={14} />
                                        <span>{fb.caseName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Mail size={14} />
                                        <span>{fb.clientEmail}</span>
                                    </div>
                                </div>
                                
                                {/* Extra Ratings Row */}
                                {(fb.assistanceRating || fb.recommendation) && (
                                    <div className="flex flex-wrap gap-6 mb-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {fb.assistanceRating > 0 && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 mb-1">Assistance Rating</span>
                                                <div className="flex items-center gap-1">
                                                    {getStarRating(fb.assistanceRating)}
                                                    <span className="text-xs text-gray-600 ml-1 font-medium">{fb.assistanceRating}.0</span>
                                                </div>
                                            </div>
                                        )}
                                        {fb.recommendation && (
                                            <div className="flex flex-col border-l border-gray-200 pl-6">
                                                <span className="text-xs text-gray-500 mb-1">Would Recommend?</span>
                                                <span className="font-semibold text-gray-700">{fb.recommendation}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Feedback Text */}
                                <p className="text-gray-600 text-sm mb-3 border-l-4 border-green-500 pl-3 italic">
                                    "{fb.feedback}"
                                </p>

                                {/* Lawyer Response */}
                                {fb.lawyerResponse && (
                                    <div className="bg-green-50 rounded-lg p-3 mb-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ThumbsUp size={14} className="text-green-600" />
                                            <span className="text-xs font-medium text-green-700">Your Response:</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{fb.lawyerResponse}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => setSelectedFeedback(fb)}
                                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                                    >
                                        <Reply size={14} />
                                        {fb.lawyerResponse ? "Edit Response" : "Respond"}
                                    </button>
                                    <button
                                        onClick={() => window.open(`/case/${fb.caseId}`, "_blank")}
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        <ExternalLink size={14} />
                                        View Case
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* RESPOND MODAL */}
            {selectedFeedback && (
                <RespondModal
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                    onRespond={handleRespondToFeedback}
                />
            )}
        </div>
    );
}

/* -------------------- RESPOND MODAL -------------------- */

function RespondModal({ feedback, onClose, onRespond }) {
    const [response, setResponse] = useState(feedback.lawyerResponse || "");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!response.trim()) return;
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onRespond(feedback.id, response);
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Respond to Feedback</h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
                        ✕
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-700">{feedback.clientName}</span>
                        </div>
                        <p className="text-sm text-gray-600">"{feedback.feedback}"</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Your Response
                        </label>
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            rows="4"
                            placeholder="Thank you for your feedback..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !response.trim()}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {submitting ? "Sending..." : "Send Response"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------- CLIENT FEEDBACK FORM -------------------- */

// This component is for the client-facing feedback form
// It would be linked from an email sent to the client after case completion

export function ClientFeedbackForm({ caseId, caseName, lawyerName, onSubmitted }) {
    const [formData, setFormData] = useState({
        rating: 0,
        title: "",
        assistanceRating: 0,
        recommendation: "",
        feedback: "",
        clientName: "",
        clientEmail: "",
    });
    const [hoveredAssistanceRating, setHoveredAssistanceRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleRating = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.rating === 0) {
            setError("Please select a rating");
            return;
        }
        if (!formData.feedback.trim()) {
            setError("Please enter your feedback");
            return;
        }

        // Save to localStorage (in real app, this would be an API call)
        const newFeedback = {
            id: `fb_${Date.now()}`,
            caseId: caseId,
            caseName: caseName,
            clientName: formData.clientName || "Anonymous Client",
            clientEmail: formData.clientEmail || "",
            rating: formData.rating,
            assistanceRating: formData.assistanceRating,
            recommendation: formData.recommendation,
            title: formData.title || `Feedback for ${lawyerName}`,
            feedback: formData.feedback,
            date: new Date().toISOString(),
            status: "published",
            lawyerResponse: "",
        };

        const existingFeedbacks = JSON.parse(localStorage.getItem("legalflow_feedbacks") || "[]");
        existingFeedbacks.push(newFeedback);
        localStorage.setItem("legalflow_feedbacks", JSON.stringify(existingFeedbacks));

        setSubmitted(true);
        if (onSubmitted) onSubmitted(newFeedback);
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h2>
                <p className="text-gray-500">
                    Your feedback has been submitted. We greatly appreciate your input!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Share Your Experience</h2>
                <p className="text-green-100 text-sm mt-1">
                    How was your experience with {lawyerName} regarding {caseName}?
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Rating */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                        Rate your overall experience with our service *
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => handleRating(rating)}
                                onMouseEnter={() => setHoveredRating(rating)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`${(hoveredRating || formData.rating) >= rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        } transition`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assistance Rating */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                        How would you rate the lawyer's assistance and responsiveness?
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={`assist-${rating}`}
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, assistanceRating: rating }));
                                    setError("");
                                }}
                                onMouseEnter={() => setHoveredAssistanceRating(rating)}
                                onMouseLeave={() => setHoveredAssistanceRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    size={28}
                                    className={`${(hoveredAssistanceRating || formData.assistanceRating) >= rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        } transition`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recommendation */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        How likely are you to recommend us to others?
                    </label>
                    <select
                        value={formData.recommendation}
                        onChange={(e) => setFormData(prev => ({ ...prev, recommendation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                    >
                        <option value="" disabled>Select an option</option>
                        <option value="Very Likely">Very Likely</option>
                        <option value="Likely">Likely</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Unlikely">Unlikely</option>
                        <option value="Very Unlikely">Very Unlikely</option>
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Short Summary
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Brief description of your experience"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                </div>

                {/* Feedback */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Your Feedback *
                    </label>
                    <textarea
                        value={formData.feedback}
                        onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                        rows="5"
                        placeholder="Please share your experience working with us..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                    />
                </div>

                {/* Optional Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Your Name <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.clientName}
                            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Email <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="email"
                            value={formData.clientEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
}