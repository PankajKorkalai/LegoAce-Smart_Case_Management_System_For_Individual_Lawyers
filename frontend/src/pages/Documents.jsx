import { useEffect, useRef, useState } from "react";
import {
  Search,
  Upload,
  Download,
  MoreVertical,
  Sparkles,
  List,
  Grid,
  X,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";

const typeColor = {
  "Legal Filing": "bg-green-100 text-green-700",
  Evidence: "bg-blue-100 text-blue-700",
  Contract: "bg-indigo-100 text-indigo-700",
  "Uploaded Document": "bg-gray-100 text-gray-700",
};

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Document Viewer Component ────────────────────────────────────────────────
function DocumentViewer({ document: doc, onClose, onDownload }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewData, setViewData] = useState(null); // { viewUrl, type }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchViewUrl = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/documents/${doc._id}/view`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to get document URL.");
        }
        const data = await response.json();
        setViewData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchViewUrl();
  }, [doc._id]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      globalThis.document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!globalThis.document.fullscreenElement);
    };
    globalThis.document.addEventListener("fullscreenchange", handleFSChange);
    return () =>
      globalThis.document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  const renderContent = () => {
    if (!viewData) return null;
    const { viewUrl, type } = viewData;

    if (type === "pdf") {
      return (
        <iframe
          src={`${viewUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
          className="w-full h-full border-0"
          title={doc.title || doc.originalName}
        />
      );
    }

    if (type === "image") {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={viewUrl}
            alt={doc.title || doc.originalName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (type === "office") {
      return (
        <iframe
          src={viewUrl}
          className="w-full h-full border-0"
          title={doc.title || doc.originalName}
        />
      );
    }

    // type === "other" — unsupported format
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Preview not available for this file type</p>
          <p className="text-sm text-gray-400 mb-4">{doc.mimeType}</p>
          <button
            onClick={() => onDownload(doc)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Download File
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            title="Close"
          >
            <X size={20} />
          </button>
          <div>
            <h3 className="font-medium text-sm">{doc.title || doc.originalName}</h3>
            <p className="text-xs text-gray-400">
              {doc.sizeReadable} · {doc.documentType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownload(doc)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            title="Download"
          >
            <Download size={18} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div ref={containerRef} className="flex-1 bg-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
              <p className="text-white">Loading document...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-400">
              <p className="text-lg mb-2">Failed to load document</p>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => onDownload(doc)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download Instead
              </button>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}

// ─── Main Documents Component ─────────────────────────────────────────────────
export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [viewerDoc, setViewerDoc] = useState(null);

  // Upload modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    caseName: "",
    docType: "Legal Filing",
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterCase, setFilterCase] = useState("All Cases");
  const [viewMode, setViewMode] = useState("list");

  // Analysis modal
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisDoc, setAnalysisDoc] = useState(null);

  // Context menu
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ── Fetch documents ──────────────────────────────────────────────────────────
  const fetchDocuments = async () => {
    setLoading(true);
    setUploadMessage("");
    try {
      const userId = localStorage.getItem("userId") || localStorage.getItem("id");
      console.log("Frontend is sending userId:", userId);

      if (!userId) {
        setUploadMessage("Error: You are not logged in properly.");
        setDocuments([]);
        return;
      }

      const response = await fetch(`${apiUrl}/api/documents?userId=${userId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load documents.");
      setDocuments(data);
    } catch (error) {
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ── Upload ───────────────────────────────────────────────────────────────────
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setIsModalOpen(false);
    setUploadMessage("Uploading...");

    const userId = localStorage.getItem("userId") || localStorage.getItem("id");
    const payload = new FormData();
    payload.append("file", selectedFile);
    payload.append("caseName", formData.caseName);
    payload.append("documentType", formData.docType);
    if (userId) payload.append("userId", userId);

    try {
      // Use the RAG-enabled upload route if you have one, or regular upload
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      setDocuments((prev) => [data.document, ...prev]);
      setUploadMessage(
        `Upload successful! AI Status: ${data.ragStatus || "Processed"}`
      );
      setTimeout(() => setUploadMessage(""), 5000);
    } catch (error) {
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(""), 3000);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setFormData({ caseName: "", docType: "Legal Filing" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Analyze ──────────────────────────────────────────────────────────────────
  const handleAnalyze = async (documentId) => {
    const doc = documents.find((d) => d._id === documentId);
    setAnalysisDoc(doc || null);
    setAnalysisOpen(true);
    setAnalysisLoading(true);
    setAnalysisResult(null);
    setActiveMenuId(null);

    try {
      const response = await fetch(`${apiUrl}/api/documents/${documentId}/analyze`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Document analysis failed.");
      setAnalysisResult(data.analysis);
    } catch (error) {
      setAnalysisResult({ error: error.message });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleCloseAnalysis = () => {
    setAnalysisOpen(false);
    setAnalysisDoc(null);
    setAnalysisResult(null);
  };

  // ── Download ─────────────────────────────────────────────────────────────────
  const handleDownload = (documentItem) => {
    // Create an anchor that points to our streaming download endpoint
    const link = globalThis.document.createElement("a");
    link.href = `${apiUrl}/api/documents/${documentItem._id}/download`;
    link.download = documentItem.originalName;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
  };

  // ── Open/View ────────────────────────────────────────────────────────────────
  const handleOpenDocument = (documentItem) => {
    setViewerDoc(documentItem);
    setActiveMenuId(null);
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = (docId) => {
    setDeleteConfirmId(docId);
    setActiveMenuId(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      const response = await fetch(`${apiUrl}/api/documents/${deleteConfirmId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      setDocuments((prev) => prev.filter((d) => d._id !== deleteConfirmId));
      setUploadMessage("Document deleted successfully.");
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (error) {
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(""), 3000);
    } finally {
      setDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  // ── Context menu ─────────────────────────────────────────────────────────────
  const handleToggleMenu = (docId, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      right: window.innerWidth - rect.right + 10,
    });
    setActiveMenuId((prev) => (prev === docId ? null : docId));
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuId !== null) setActiveMenuId(null);
    };
    globalThis.document.addEventListener("click", handleClickOutside);
    return () =>
      globalThis.document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  // ── Filters ──────────────────────────────────────────────────────────────────
  const filterOptions = (items, field) => {
    const values = items.map((item) => item[field] || "Unassigned");
    return [
      `All ${field === "documentType" ? "Types" : "Cases"}`,
      ...new Set(values),
    ];
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = [doc.title, doc.originalName, doc.caseName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "All Types" || doc.documentType === filterType;
    const matchesCase =
      filterCase === "All Cases" || doc.caseName === filterCase;
    return matchesSearch && matchesType && matchesCase;
  });

  const typeOptions = filterOptions(documents, "documentType");
  const caseOptions = filterOptions(documents, "caseName");

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Document Viewer Overlay */}
      {viewerDoc && (
        <DocumentViewer
          document={viewerDoc}
          onClose={() => setViewerDoc(null)}
          onDownload={handleDownload}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Document?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently remove the document from storage and the
              database. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 rounded-lg py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-bold text-lg">Document Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-gray-100 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Selected File:</p>
                <p className="text-sm font-medium truncate bg-gray-50 p-2 rounded border">
                  {selectedFile?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Case Name / Parties
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smith vs. Johnson"
                  className="w-full border rounded-lg px-3 py-2 outline-green-600"
                  value={formData.caseName}
                  onChange={(e) =>
                    setFormData({ ...formData, caseName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Document Type
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 outline-green-600"
                  value={formData.docType}
                  onChange={(e) =>
                    setFormData({ ...formData, docType: e.target.value })
                  }
                >
                  <option value="Legal Filing">Legal Filing</option>
                  <option value="Evidence">Evidence</option>
                  <option value="Contract">Contract</option>
                  <option value="Uploaded Document">Other</option>
                </select>
              </div>
              <button
                onClick={confirmUpload}
                disabled={uploading}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Start Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {analysisOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={handleCloseAnalysis}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">AI Document Analysis</h2>
                <p className="text-sm text-gray-500">
                  {analysisDoc?.title || analysisDoc?.originalName}
                </p>
              </div>
              <button
                onClick={handleCloseAnalysis}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {analysisLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mb-4" />
                  <p className="text-gray-500">
                    Analyzing document with AI, please wait...
                  </p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-5 text-sm text-gray-700">
                  {analysisResult.error ? (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
                      {analysisResult.error}
                    </div>
                  ) : (
                    <>
                      {analysisResult.summary && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-base">
                            Summary
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {analysisResult.summary}
                          </p>
                        </div>
                      )}
                      {analysisResult.keyPoints?.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-base">
                            Key Points
                          </h3>
                          <ul className="list-disc list-inside space-y-1">
                            {analysisResult.keyPoints.map((point, idx) => (
                              <li key={idx} className="text-gray-700">
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysisResult.recommendations?.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-base">
                            Recommendations
                          </h3>
                          <ul className="list-disc list-inside space-y-1">
                            {analysisResult.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-gray-700">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No analysis data available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
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
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm shadow-sm ${uploadMessage.toLowerCase().includes("fail") ||
            uploadMessage.toLowerCase().includes("error") ||
            uploadMessage.toLowerCase().includes("unable")
            ? "border-red-200 text-red-600 bg-red-50"
            : "border-green-100 text-green-700 bg-green-50"
            }`}
        >
          {uploadMessage}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search documents by name or case..."
            className="outline-none w-full text-sm bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm outline-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm outline-none"
          value={filterCase}
          onChange={(e) => setFilterCase(e.target.value)}
        >
          {caseOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              Loading documents...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              No documents found.
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      {doc.documentType}
                    </p>
                    <h3 className="mt-3 text-base font-semibold text-gray-900 truncate">
                      {doc.title || doc.originalName}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 truncate">
                      {doc.caseName || "No case assigned"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleToggleMenu(doc._id, e)}
                    className="text-gray-400 hover:text-gray-700 shrink-0"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  {doc.sizeReadable} · {formatDate(doc.createdAt)}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAnalyze(doc._id)}
                    className="rounded-full border border-green-100 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 transition"
                  >
                    <Sparkles size={14} className="inline mr-1" />
                    Analyze
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Download size={14} className="inline mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => handleOpenDocument(doc)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                  >
                    <FileText size={14} className="inline mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
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
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No documents found.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr
                    key={doc._id}
                    className="hover:bg-gray-50/50 transition group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-white border transition">
                          📄
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">
                            {doc.title || doc.originalName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono uppercase">
                            {doc._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${typeColor[doc.documentType] ||
                          "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 italic">
                      {doc.caseName || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {doc.sizeReadable}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {doc.status || "Processed"}
                      </span>
                    </td>
                    <td className="px-4 py-4 leading-tight">
                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(doc.createdAt)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {doc.uploadedBy || "User"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3 text-gray-400">
                        <button
                          onClick={() => handleAnalyze(doc._id)}
                          className="hover:text-green-600 transition"
                          title="Analyze document"
                        >
                          <Sparkles size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="hover:text-blue-600 transition"
                          title="Download document"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDocument(doc)}
                          className="hover:text-gray-700 transition"
                          title="View document"
                        >
                          <FileText size={18} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => handleToggleMenu(doc._id, e)}
                            className="hover:text-gray-700 transition"
                            title="More actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Global Context Menu */}
      {activeMenuId && (
        <div
          className="fixed z-50 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
          style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const doc = documents.find((d) => d._id === activeMenuId);
            if (!doc) return null;
            return (
              <>
                <button
                  onClick={() => handleOpenDocument(doc)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  View document
                </button>
                <button
                  onClick={() => handleAnalyze(doc._id)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Analyze document
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Download
                </button>
                <div className="border-t border-gray-100" />
                <button
                  onClick={() => handleDeleteConfirm(doc._id)}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Delete document
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}