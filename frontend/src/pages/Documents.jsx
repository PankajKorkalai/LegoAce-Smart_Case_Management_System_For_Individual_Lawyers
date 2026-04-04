import { useRef, useState } from "react";
import {
  Search,
  Upload,
  Download,
  MoreVertical,
  Sparkles,
  List,
  Grid,
} from "lucide-react";

const initialDocuments = [
  {
    name: "Initial Complaint - Smith vs Johnson.pdf",
    id: "DOC-001",
    type: "Legal Filing",
    case: "Smith vs. Johnson Corp",
    size: "2.4 MB",
    status: "processed",
    uploaded: "Jan 15, 2024",
    author: "Sarah Mitchell",
  },
  {
    name: "Contract Agreement - Tech Corp.pdf",
    id: "DOC-002",
    type: "Evidence",
    case: "Tech Corp Patent Infringement",
    size: "1.8 MB",
    status: "processed",
    uploaded: "Jan 18, 2024",
    author: "Michael Chen",
  },
  {
    name: "Email Correspondence.pdf",
    id: "DOC-003",
    type: "Evidence",
    case: "Smith vs. Johnson Corp",
    size: "3.2 MB",
    status: "processed",
    uploaded: "Jan 20, 2024",
    author: "Sarah Mitchell",
  },
];

const typeColor = {
  "Legal Filing": "bg-green-100 text-green-700",
  Evidence: "bg-blue-100 text-blue-700",
  "Uploaded Document": "bg-gray-100 text-gray-700",
};

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Documents() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Upload failed");
      }

      const newDocument = {
        name: file.name,
        id: `DOC-${Date.now()}`,
        type: "Uploaded Document",
        case: "Unassigned",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: "processed",
        uploaded: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        author: "You",
        url: data.secure_url,
      };

      setDocuments((prev) => [newDocument, ...prev]);
      setUploadMessage("Upload successful.");
    } catch (error) {
      setUploadMessage(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-gray-500">
            Manage, organize, and analyze your legal documents with AI
          </p>
        </div>

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      {uploadMessage && (
        <div className="mb-4 rounded-lg border px-4 py-3 text-sm text-gray-700 bg-white shadow-sm">
          {uploadMessage}
        </div>
      )}

      <div className="flex gap-3 mb-6 items-center">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search documents by name or case..."
            className="outline-none w-full text-sm"
          />
        </div>

        <select className="px-3 py-2 rounded-lg bg-white shadow-sm text-sm">
          <option>All Types</option>
        </select>

        <select className="px-3 py-2 rounded-lg bg-white shadow-sm text-sm">
          <option>All Cases</option>
        </select>

        <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
          <button className="p-2 bg-gray-100">
            <List size={16} />
          </button>
          <button className="p-2">
            <Grid size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_1.5fr_1fr] px-6 py-4 text-sm text-gray-500 bg-gray-50">
          <div>Document</div>
          <div>Type</div>
          <div>Case</div>
          <div>Size</div>
          <div>AI Status</div>
          <div>Uploaded</div>
          <div className="text-center">Actions</div>
        </div>

        {documents.map((doc, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr_1.5fr_1fr] items-center px-6 py-4 border-t border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                📄
              </div>

              <div className="min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.id}</p>
              </div>
            </div>

            <div>
              <span
                className={`text-xs px-2 py-1 rounded ${typeColor[doc.type] || "bg-gray-100 text-gray-700"}`}
              >
                {doc.type}
              </span>
            </div>

            <div className="text-gray-600 truncate">{doc.case}</div>
            <div className="text-gray-600 whitespace-nowrap">{doc.size}</div>
            <div>
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                {doc.status}
              </span>
            </div>
            <div className="leading-tight">
              <p className="whitespace-nowrap">{doc.uploaded}</p>
              <p className="text-xs text-gray-400 truncate">{doc.author}</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <Sparkles size={16} className="text-green-600 cursor-pointer" />
              <Download size={16} className="cursor-pointer" />
              <MoreVertical size={16} className="cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
