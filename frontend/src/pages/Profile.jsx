import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Camera,
  X,
  Save,
  Edit2,
  Calendar,
  Award,
  FileText,
  Users,
  BookOpen,
} from "lucide-react";
import { FiLinkedin as Linkedin, FiTwitter as Twitter } from "react-icons/fi";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [editMode, setEditMode] = useState({
    personal: false,
    professional: false,
    bio: false,
  });
  
  const [profile, setProfile] = useState({
    _id: "",
    email: "",
    name: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    bio: "",
    title: "",
    specialization: "",
    practiceAreas: [],
    barNumber: "",
    yearsOfExperience: 0,
    education: [],
    languages: [],
    profilePicture: { url: "", publicId: "" },
    socialLinks: { linkedin: "", twitter: "", website: "" },
    role: "user",
    joinDate: "",
    lastLoginDate: null,
  });
  const [stats, setStats] = useState({
    totalCases: 0,
    totalDocuments: 0,
    totalClients: 0,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    title: "",
    specialization: "",
    practiceAreas: "",
    barNumber: "",
    yearsOfExperience: "",
    education: [],
    languages: "",
    linkedin: "",
    twitter: "",
    website: "",
  });

  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", year: "" });
  const [newLanguage, setNewLanguage] = useState("");

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load profile");
      }

      setProfile(data);
      // Initialize form data
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        bio: data.bio || "",
        title: data.title || "",
        specialization: data.specialization || "",
        practiceAreas: data.practiceAreas?.join(", ") || "",
        barNumber: data.barNumber || "",
        yearsOfExperience: data.yearsOfExperience || "",
        education: data.education || [],
        languages: data.languages?.join(", ") || "",
        linkedin: data.socialLinks?.linkedin || "",
        twitter: data.socialLinks?.twitter || "",
        website: data.socialLinks?.website || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Failed to load profile");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity stats
  const fetchStats = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/profile/activity-stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  // Update personal info
  const handleUpdatePersonalInfo = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/profile/personal-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setMessage("Personal information updated successfully");
      setEditMode({ ...editMode, personal: false });
      
      // Notify Navbar to update (image/name)
      window.dispatchEvent(new Event("profileUpdated"));
      
      fetchProfile(); // Refresh profile data
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Update bio
  const handleUpdateBio = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/profile/bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: formData.bio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update bio");
      }

      setMessage("Bio updated successfully");
      setEditMode({ ...editMode, bio: false });
      
      // Notify Navbar to update
      window.dispatchEvent(new Event("profileUpdated"));

      fetchProfile();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Update professional info
  const handleUpdateProfessional = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/profile/professional`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          specialization: formData.specialization,
          practiceAreas: formData.practiceAreas.split(",").map(area => area.trim()),
          barNumber: formData.barNumber,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          education: formData.education,
          languages: formData.languages.split(",").map(lang => lang.trim()),
          socialLinks: {
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            website: formData.website,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update professional info");
      }

      setMessage("Professional information updated successfully");
      setEditMode({ ...editMode, professional: false });
      
      // Notify Navbar to update
      window.dispatchEvent(new Event("profileUpdated"));

      fetchProfile();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Upload profile picture
  const handleUploadPicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setUploadingPicture(true);
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/profile/upload-picture`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload picture");
      }

      setMessage("Profile picture updated successfully");
      
      // Notify Navbar to update
      window.dispatchEvent(new Event("profileUpdated"));

      fetchProfile();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUploadingPicture(false);
    }
  };

  // Add education
  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setFormData({
        ...formData,
        education: [...formData.education, newEducation],
      });
      setNewEducation({ degree: "", institution: "", year: "" });
    }
  };

  // Remove education
  const handleRemoveEducation = (index) => {
    const updated = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updated });
  };

  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`;
    }
    return profile.name?.substring(0, 2).toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-500">Manage your personal information and view your performance</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm shadow-sm ${
          message.includes("successfully") 
            ? "border-green-100 text-green-700 bg-green-50"
            : "border-red-200 text-red-600 bg-red-50"
        }`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-3 px-1 text-sm font-medium transition ${
              activeTab === "personal"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("professional")}
            className={`pb-3 px-1 text-sm font-medium transition ${
              activeTab === "professional"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Professional
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-3 px-1 text-sm font-medium transition ${
              activeTab === "activity"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Activity
          </button>
        </nav>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "personal" && (
            <>
              {/* Personal Information Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Your personal details and contact information</p>
                  </div>
                  {!editMode.personal && (
                    <button
                      onClick={() => setEditMode({ ...editMode, personal: true })}
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                  )}
                </div>
                <div className="p-6">
                  {editMode.personal ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <textarea
                            rows="2"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          onClick={() => setEditMode({ ...editMode, personal: false })}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdatePersonalInfo}
                          disabled={saving}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.firstName || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.lastName || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.phone || "-"}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.address || "-"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Tell clients a bit about yourself</p>
                  </div>
                  {!editMode.bio && (
                    <button
                      onClick={() => setEditMode({ ...editMode, bio: true })}
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                  )}
                </div>
                <div className="p-6">
                  {editMode.bio ? (
                    <div className="space-y-4">
                      <textarea
                        rows="6"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Write something about yourself..."
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditMode({ ...editMode, bio: false })}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateBio}
                          disabled={saving}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Save size={16} /> {saving ? "Saving..." : "Save Bio"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-700 bg-gray-50 px-4 py-4 rounded-lg border border-gray-200 leading-relaxed">
                      {profile.bio || "No bio added yet."}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "professional" && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Your legal career and expertise</p>
                </div>
                {!editMode.professional && (
                  <button
                    onClick={() => setEditMode({ ...editMode, professional: true })}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>
              <div className="p-6">
                {editMode.professional ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Senior Partner"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          placeholder="e.g., Family Law"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Practice Areas</label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.practiceAreas}
                          onChange={(e) => setFormData({ ...formData, practiceAreas: e.target.value })}
                          placeholder="Divorce, Child Custody, etc. (comma separated)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bar Number</label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.barNumber}
                          onChange={(e) => setFormData({ ...formData, barNumber: e.target.value })}
                          placeholder="e.g., CA123456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <input
                          type="number"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.yearsOfExperience}
                          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.languages}
                          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                          placeholder="English, Spanish (comma separated)"
                        />
                      </div>
                    </div>

                    {/* Education Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                      <div className="space-y-3">
                        {formData.education.map((edu, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{edu.degree}</p>
                              <p className="text-xs text-gray-500">{edu.institution} • {edu.year}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveEducation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Degree"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Institution"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={newEducation.institution}
                            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={newEducation.year}
                            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                          />
                          <button
                            onClick={handleAddEducation}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Social Links</h3>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                        <input
                          type="url"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Twitter/X</label>
                        <input
                          type="url"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.twitter}
                          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Website</label>
                        <input
                          type="url"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setEditMode({ ...editMode, professional: false })}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProfessional}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.title || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.specialization || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Practice Areas</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.practiceAreas?.join(", ") || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bar Number</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.barNumber || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.yearsOfExperience || "0"} years
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                          {profile.languages?.join(", ") || "-"}
                        </div>
                      </div>
                    </div>

                    {profile.education?.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                        <div className="space-y-2">
                          {profile.education.map((edu, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm font-medium">{edu.degree}</p>
                              <p className="text-xs text-gray-500">{edu.institution} • {edu.year}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(profile.socialLinks?.linkedin || profile.socialLinks?.twitter || profile.socialLinks?.website) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                        <div className="space-y-2">
                          {profile.socialLinks?.linkedin && (
                            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                              <Linkedin size={16} /> LinkedIn
                            </a>
                          )}
                          {profile.socialLinks?.twitter && (
                            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                              <Twitter size={16} /> Twitter/X
                            </a>
                          )}
                          {profile.socialLinks?.website && (
                            <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                              <Globe size={16} /> Website
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40">
                <h2 className="text-lg font-semibold text-gray-900">Activity Overview</h2>
                <p className="text-sm text-gray-500 mt-0.5">Your platform activity and statistics</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar size={20} className="text-green-600" />
                      <h3 className="font-medium text-gray-900">Account Information</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Joined:</span>
                        <span className="text-gray-900 font-medium">{new Date(profile.joinDate).toLocaleDateString()}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Last Login:</span>
                        <span className="text-gray-900 font-medium">
                          {profile.lastLoginDate ? new Date(profile.lastLoginDate).toLocaleDateString() : "N/A"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Role:</span>
                        <span className="text-gray-900 font-medium capitalize">{profile.role}</span>
                      </p>
                    </div>
                  </div>                   <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Award size={20} className="text-green-600" />
                      <h3 className="font-medium text-gray-900">Professional Stats</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Total Cases:</span>
                        <span className="text-gray-900 font-medium">{stats.totalCases}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Unique Clients:</span>
                        <span className="text-gray-900 font-medium">{stats.totalClients}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Documents Managed:</span>
                        <span className="text-gray-900 font-medium">{stats.totalDocuments}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-6 text-center border-b border-gray-100">
              <div className="relative inline-block">
                {profile.profilePicture?.url ? (
                  <img
                    src={profile.profilePicture.url}
                    alt={profile.firstName || profile.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-semibold mb-4 shadow-md">
                    {getInitials()}
                  </div>
                )}
                <label className="absolute bottom-2 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-50">
                  <Camera size={16} className="text-gray-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadPicture}
                    disabled={uploadingPicture}
                  />
                </label>
              </div>
              {uploadingPicture && (
                <p className="text-xs text-gray-500 mt-2">Uploading...</p>
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {profile.firstName && profile.lastName 
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.name}
              </h3>
              <p className="text-green-600 font-medium text-sm mt-0.5">{profile.title || "Legal Professional"}</p>
              {profile.specialization && (
                <div className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  {profile.specialization}
                </div>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium break-all">{profile.email}</p>
                </div>
              </div>
              {profile.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{profile.phone}</p>
                  </div>
                </div>
              )}
              {profile.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-500">Address</p>
                    <p className="text-gray-900 font-medium">{profile.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 pt-2 border-t border-gray-100 mt-2">
                <Calendar size={18} className="text-gray-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-gray-500">Joined</p>
                  <p className="text-gray-900 font-medium">
                    {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}