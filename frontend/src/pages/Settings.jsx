import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Users,
  Save,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Key,
  UserPlus,
} from "lucide-react";

/* -------------------- MAIN COMPONENT -------------------- */

export default function SettingsPage() {
  const tabs = ["General", "Notifications", "Security", "Billing", "Team"];
  const [activeTab, setActiveTab] = useState("General");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Team state
  const [team, setTeam] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
  });
  const [inviteErrors, setInviteErrors] = useState({});

  // Form state
  const [form, setForm] = useState({
    firmName: "LegalFlow Law Firm",
    email: "contact@legalflow.com",
    phone: "+1 (555) 000-0000",
    website: "https://legalflow.com",
    address: "123 Legal Street, Suite 100, New York, NY 10001",
    timezone: "Eastern Time (ET)",
    dateFormat: "MM/DD/YYYY",
    emailNotif: true,
    pushNotif: true,
    caseUpdates: true,
    reminders: true,
    messages: true,
    documentAlerts: false,
    newsletter: false,
    twoFactor: false,
    sessionTimeout: "30 minutes",
    loginAlerts: true,
    plan: "Professional",
    nextBillingDate: "2026-03-15",
  });

  // Load data from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("legalflow_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setForm(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }

    const savedTeam = localStorage.getItem("legalflow_team");
    if (savedTeam) {
      try {
        setTeam(JSON.parse(savedTeam));
      } catch (e) {
        console.error("Failed to load team:", e);
      }
    } else {
      setTeam([
        { id: "1", name: "Sarah Johnson", email: "sarah@legalflow.com", status: "Active" },
        { id: "2", name: "Michael Chen", email: "michael@legalflow.com", status: "Active" },
        { id: "3", name: "Emily Davis", email: "emily@legalflow.com", status: "Active" },
        { id: "4", name: "James Wilson", email: "james@legalflow.com", status: "Pending" },
      ]);
    }
  }, []);

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      localStorage.setItem("legalflow_settings", JSON.stringify(form));
      setSaveStatus({ type: "success", message: "Settings saved successfully!" });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      setSaveStatus({ type: "error", message: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggle = (key) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus({ type: "error", message: "New passwords do not match" });
      return;
    }
    if (passwordData.newPassword && passwordData.newPassword.length < 8) {
      setSaveStatus({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus({ type: "success", message: "Password updated successfully!" });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handle plan change
  const handlePlanChange = (plan) => {
    setForm(prev => ({ ...prev, plan }));
  };

  // Team functions
  const handleInvite = async () => {
    const errors = {};
    if (!inviteData.name.trim()) errors.name = "Name is required";
    if (!inviteData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(inviteData.email)) errors.email = "Invalid email format";

    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors);
      return;
    }

    const newMember = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      status: "Pending",
    };

    const updatedTeam = [...team, newMember];
    setTeam(updatedTeam);
    localStorage.setItem("legalflow_team", JSON.stringify(updatedTeam));

    setShowInviteModal(false);
    setInviteData({ name: "", email: "" });
    setInviteErrors({});

    setSaveStatus({ type: "success", message: `Invitation sent to ${inviteData.email}` });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleRemoveMember = (id) => {
    const updatedTeam = team.filter(m => m.id !== id);
    setTeam(updatedTeam);
    localStorage.setItem("legalflow_team", JSON.stringify(updatedTeam));
  };

  const getPlanPrice = (plan) => {
    const prices = { Basic: 49, Professional: 99, Enterprise: 299 };
    return prices[plan];
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* SAVE STATUS */}
      {saveStatus && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${saveStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
          {saveStatus.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span className="text-sm">{saveStatus.message}</span>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-1 border-b border-gray-200 bg-white rounded-t-xl px-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition relative ${activeTab === t ? "text-green-600" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {t}
            {activeTab === t && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-b-xl rounded-tr-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* GENERAL TAB */}
        {activeTab === "General" && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-4">
                <Settings size={18} className="text-gray-500" />
                Firm Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Firm Name</label>
                  <input
                    name="firmName"
                    value={form.firmName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Website</label>
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Timezone</label>
                  <select
                    name="timezone"
                    value={form.timezone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Date Format</label>
                  <select
                    name="dateFormat"
                    value={form.dateFormat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "Notifications" && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-4">
                <Bell size={18} className="text-gray-500" />
                Notification Preferences
              </h3>
              <div className="space-y-1 bg-gray-50 rounded-xl p-1">
                <ToggleRow
                  title="Email Notifications"
                  description="Receive notifications via email"
                  value={form.emailNotif}
                  onClick={() => toggle("emailNotif")}
                />
                <ToggleRow
                  title="Push Notifications"
                  description="Receive push notifications in browser"
                  value={form.pushNotif}
                  onClick={() => toggle("pushNotif")}
                />
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3">Notification Types</h3>
              <div className="space-y-1 bg-gray-50 rounded-xl p-1">
                <ToggleRow
                  title="Case Updates"
                  description="Get notified when case status changes"
                  value={form.caseUpdates}
                  onClick={() => toggle("caseUpdates")}
                />
                <ToggleRow
                  title="Calendar Reminders"
                  description="Reminders for hearings, meetings, and deadlines"
                  value={form.reminders}
                  onClick={() => toggle("reminders")}
                />
                <ToggleRow
                  title="Client Messages"
                  description="New messages from clients"
                  value={form.messages}
                  onClick={() => toggle("messages")}
                />
                <ToggleRow
                  title="Document Alerts"
                  description="When documents are uploaded or shared"
                  value={form.documentAlerts}
                  onClick={() => toggle("documentAlerts")}
                />
                <ToggleRow
                  title="Newsletter & Updates"
                  description="Product updates and legal news"
                  value={form.newsletter}
                  onClick={() => toggle("newsletter")}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "Security" && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-4">
                <Shield size={18} className="text-gray-500" />
                Security Settings
              </h3>
              <div className="space-y-1 bg-gray-50 rounded-xl p-1">
                <ToggleRow
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  value={form.twoFactor}
                  onClick={() => toggle("twoFactor")}
                />
                <ToggleRow
                  title="Login Alerts"
                  description="Get notified when someone logs into your account"
                  value={form.loginAlerts}
                  onClick={() => toggle("loginAlerts")}
                />
                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white transition">
                  <label className="font-medium text-sm text-gray-800">Session Timeout</label>
                  <select
                    name="sessionTimeout"
                    value={form.sessionTimeout}
                    onChange={handleChange}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 flex items-center gap-2 mb-3">
                <Key size={16} className="text-gray-500" />
                Change Password
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  onClick={handlePasswordChange}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === "Billing" && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-gray-500" />
                Current Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {["Basic", "Professional", "Enterprise"].map((plan) => (
                  <button
                    key={plan}
                    onClick={() => handlePlanChange(plan)}
                    className={`p-4 rounded-xl border-2 text-left transition ${form.plan === plan ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-800">{plan}</span>
                      {form.plan === plan && <Check size={16} className="text-green-600" />}
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      ${getPlanPrice(plan)}<span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Next Billing Date</p>
                  <p className="font-medium text-gray-800">{form.nextBillingDate}</p>
                </div>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Manage Subscription
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3">Payment Methods</h3>
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded"></div>
                  <div>
                    <p className="font-medium text-gray-800">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/2028</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700 text-sm">Edit</button>
              </div>
              <button className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                <Plus size={14} /> Add Payment Method
              </button>
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === "Team" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-gray-500" />
                Team Members
              </h3>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                <UserPlus size={14} />
                Invite Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm font-medium text-gray-800">{member.name}</td>
                      <td className="py-3 text-sm text-gray-500">{member.email}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${member.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {team.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No team members yet. Invite someone to get started.
              </div>
            )}
          </div>
        )}
      </div>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-1 rounded-md hover:bg-gray-100">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input
                  value={inviteData.name}
                  onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                {inviteErrors.name && <p className="text-xs text-red-500 mt-1">{inviteErrors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                {inviteErrors.email && <p className="text-xs text-red-500 mt-1">{inviteErrors.email}</p>}
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-200">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- TOGGLE ROW COMPONENT -------------------- */

function ToggleRow({ title, description, value, onClick }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white transition">
      <div>
        <p className="font-medium text-sm text-gray-800">{title}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={onClick}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-green-600" : "bg-gray-300"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}