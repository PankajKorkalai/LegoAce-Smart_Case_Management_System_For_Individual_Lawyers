import { useRef, useState, useEffect } from "react";
import {
  Search,
  Upload,
  Download,
  MoreVertical,
  Sparkles,
  List,
  Grid,
  X,
} from "lucide-react";

const typeColor = {
  "Legal Filing": "bg-green-100 text-green-700",
  Evidence: "bg-blue-100 text-blue-700",
  "Uploaded Document": "bg-gray-100 text-gray-700",
};

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    caseName: "",
    docType: "Legal Filing",
  });

  const fileInputRef = useRef(null);

  // Fetch Live Documents from Database on Page Load
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/documents`);
        if (response.ok) {
          const data = await response.json();
          const mappedDocs = data.map((doc) => ({
            _rawId: doc._id,
            name: doc.title || doc.originalName || "Unknown Document",
            id: `DOC-${doc._id ? doc._id.toString().slice(-6).toUpperCase() : Date.now().toString().slice(-6)}`,
            type: doc.documentType || "Uploaded Document",
            case: doc.caseName || "Unassigned",
            size: doc.sizeReadable || "Unknown",
            status: "processed",
            uploaded: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) : "Unknown Date",
            author: doc.uploadedBy || "You",
            url: doc.cloudinaryUrl,
          }));
          setDocuments(mappedDocs);
        }
      } catch (error) {
        console.error("Error fetching live documents:", error);
      }
    };
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/documents/${id}`, { method: "DELETE" });
      if (response.ok) {
        setDocuments(prev => prev.filter(d => d._rawId !== id));
        setOpenDropdownId(null);
      } else {
        alert("Failed to delete document. Ensure the backend is running.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting document.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Step 1: File selected, open modal to ask for details
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setIsModalOpen(true); // Open the details modal
  };

  // Step 2: Final Upload with Tags
  const confirmUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setIsModalOpen(false);
    setUploadMessage("Uploading & Training AI Model (This may take 30-45 seconds)...");

    const dataPayload = new FormData();
    dataPayload.append("file", selectedFile);
    // You can send these to your backend to save in DB
    dataPayload.append("caseName", formData.caseName);
    dataPayload.append("docType", formData.docType);

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: dataPayload,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Upload failed");

      const newDocument = {
        name: selectedFile.name,
        id: `DOC-${Date.now()}`,
        type: formData.docType,
        case: formData.caseName || "Unassigned",
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        status: "processed",
        uploaded: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        author: "You",
        url: data.document?.cloudinaryUrl,
      };

      setDocuments((prev) => [newDocument, ...prev]);
      setUploadMessage(`Upload Success! AI Status: ${data.ragStatus}`);
    } catch (error) {
      setUploadMessage(error.message);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setFormData({ caseName: "", docType: "Legal Filing" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* --- UPLOAD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-bold text-lg">Document Details</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Selected File:</p>
                <p className="text-sm font-medium truncate bg-gray-50 p-2 rounded border">{selectedFile?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Case Name / Parties</label>
                <input
                  type="text"
                  placeholder="e.g. Smith vs. Johnson"
                  className="w-full border rounded-lg px-3 py-2 outline-green-600"
                  value={formData.caseName}
                  onChange={(e) => setFormData({ ...formData, caseName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Document Type</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 outline-green-600"
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                >
                  <option value="Legal Filing">Legal Filing</option>
                  <option value="Evidence">Evidence</option>
                  <option value="Contract">Contract</option>
                  <option value="Uploaded Document">Other</option>
                </select>
              </div>

              <button
                onClick={confirmUpload}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Start Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-gray-500 text-sm">
            Manage, organize, and analyze your legal documents with AI
          </p>
        </div>

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50 shadow-md"
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      {uploadMessage && (
        <div className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm shadow-sm bg-white ${uploadMessage.includes('ailed') || uploadMessage.includes('Error') ? 'border-red-200 text-red-600 bg-red-50' : 'border-green-100 text-green-800'}`}>
          <div className="flex items-center gap-3">
             {uploadMessage.includes("Training AI") && <Sparkles size={16} className="animate-pulse text-green-500" />}
             {uploadMessage}
          </div>
          {(uploadMessage.includes('Success') || uploadMessage.includes('Error')) && (
            <button onClick={() => setUploadMessage("")} className="text-gray-400 hover:text-gray-700">
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* --- FILTERS --- */}
      <div className="flex gap-3 mb-6 items-center">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search documents by name or case..."
            className="outline-none w-full text-sm bg-transparent"
          />
        </div>
        <select className="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm outline-none">
          <option>All Types</option>
        </select>
        <select className="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm outline-none">
          <option>All Cases</option>
        </select>
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button className="p-2 bg-gray-100"><List size={16} /></button>
          <button className="p-2 text-gray-400"><Grid size={16} /></button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-gray-50/50 border-b">
              <th className="px-6 py-4 font-medium">Document</th>
              <th className="px-4 py-4 font-medium">Type</th>
              <th className="px-4 py-4 font-medium">Case</th>
              <th className="px-4 py-4 font-medium">Size</th>
              <th className="px-4 py-4 font-medium">AI Status</th>
              <th className="px-4 py-4 font-medium">Uploaded</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-white border transition">📄</div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate max-w-[180px]">{doc.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono uppercase">{doc.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${typeColor[doc.type] || "bg-gray-100 text-gray-700"}`}>
                    {doc.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 italic">
                  {doc.case}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{doc.size}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {doc.status}
                  </span>
                </td>
                <td className="px-4 py-4 leading-tight">
                  <p className="text-sm font-medium text-gray-700">{doc.uploaded}</p>
                  <p className="text-xs text-gray-400">{doc.author}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-4 text-gray-400">
                    <Sparkles size={18} className="text-green-600 hover:scale-110 transition cursor-pointer" title="AI Analyze" />
                    {doc.url ? (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Download size={18} className="text-gray-400 hover:text-green-600 cursor-pointer transition" title="Download Document" />
                      </a>
                    ) : (
                      <Download size={18} className="text-gray-200 cursor-not-allowed" title="No Document Attached" />
                    )}
                    <div className="relative">
                      <MoreVertical 
                        size={18} 
                        className="hover:text-gray-800 cursor-pointer transition" 
                        onClick={() => setOpenDropdownId(openDropdownId === doc._rawId ? null : doc._rawId)} 
                      />
                      {openDropdownId === doc._rawId && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-xl z-50 py-1 overflow-hidden" style={{ minWidth: '140px' }}>
                          {doc.url && (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b">Open Document</a>
                          )}
                          <button 
                            onClick={() => handleDelete(doc._rawId)} 
                            className="w-full text-left block px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            Delete Document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}