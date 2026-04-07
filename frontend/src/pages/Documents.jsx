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

// Document Viewer Component (inline)
function DocumentViewer({ document, onClose, onDownload }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewUrl, setViewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViewUrl = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/documents/${document._id}/view`);
        const data = await response.json();
        setViewUrl(data.viewUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchViewUrl();
  }, [document._id]);

  const toggleFullscreen = () => {
    const elem = document.getElementById('document-viewer-container');
    if (!isFullscreen) {
      elem?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getEmbedCode = () => {
    const { mimeType } = document;
    
    // For PDF
    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={`${viewUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
          className="w-full h-full"
          title={document.title}
        />
      );
    }
    
    // For Images
    if (mimeType?.startsWith('image/')) {
      return (
        <img 
          src={viewUrl} 
          alt={document.title}
          className="max-w-full max-h-full object-contain mx-auto"
        />
      );
    }
    
    // For Word, Excel, PPT using Google Docs Viewer
    return (
      <iframe
        src={viewUrl}
        className="w-full h-full"
        title={document.title}
        allow="autoplay"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X size={20} />
          </button>
          <div>
            <h3 className="font-medium text-sm">{document.title || document.originalName}</h3>
            <p className="text-xs text-gray-400">{document.sizeReadable} • {document.documentType}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownload(document)}
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
      <div id="document-viewer-container" className="flex-1 bg-gray-800 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-white">Loading document...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-400">
              <p className="text-lg mb-2">Failed to load document</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => window.open(document.cloudinaryUrl, '_blank')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        ) : (
          getEmbedCode()
        )}
      </div>
    </div>
  );
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [viewerDoc, setViewerDoc] = useState(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    caseName: "",
    docType: "Legal Filing",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterCase, setFilterCase] = useState("All Cases");
  const [viewMode, setViewMode] = useState("list");
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisDoc, setAnalysisDoc] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const fileInputRef = useRef(null);

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const fetchDocuments = async () => {
    setLoading(true);
    setUploadMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/documents`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load documents.");
      }
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

    const dataPayload = new FormData();
    dataPayload.append("file", selectedFile);
    dataPayload.append("caseName", formData.caseName);
    dataPayload.append("documentType", formData.docType);

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: dataPayload,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Upload failed");

      setDocuments((prev) => [data.document, ...prev]);
      setUploadMessage(`Upload Success! AI Status: ${data.ragStatus || "Upload successful."}`);
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

  const handleAnalyze = async (documentId) => {
    setAnalysisOpen(true);
    setAnalysisLoading(true);
    setAnalysisResult(null);
    const doc = documents.find((doc) => doc._id === documentId);
    setAnalysisDoc(doc || null);

    try {
      const response = await fetch(`${apiUrl}/api/documents/${documentId}/analyze`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Document analysis failed.");
      }

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

  const getDocumentUrl = (documentItem) => {
    return documentItem.signedUrl || documentItem.cloudinaryUrl;
  };

  const handleDownload = async (documentItem) => {
  try {
    const link = document.createElement('a');
    link.href = `${apiUrl}/api/documents/${documentItem._id}/download`;
    link.download = documentItem.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    alert("Download failed. Please try again.");
  }
};

  const handleOpenDocument = async (documentItem) => {
    // For PDFs and images - open in new tab
    if (documentItem.mimeType === 'application/pdf' || documentItem.mimeType?.startsWith('image/')) {
      // Open the view endpoint which streams the file
      window.open(`${apiUrl}/api/documents/${documentItem._id}/view`, '_blank');
    }
    // For Office documents - use Google Docs Viewer
    else if (
      documentItem.mimeType === 'application/msword' ||
      documentItem.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      documentItem.mimeType === 'application/vnd.ms-excel' ||
      documentItem.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      documentItem.mimeType === 'application/vnd.ms-powerpoint' ||
      documentItem.mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      try {
        const response = await fetch(`${apiUrl}/api/documents/${documentItem._id}/view`);
        const data = await response.json();
        if (data.redirect && data.viewUrl) {
          window.open(data.viewUrl, '_blank');
        }
      } catch (error) {
        console.error("Failed to open document:", error);
        alert("Unable to open document. Please try downloading it instead.");
      }
    }
    else {
      // For other file types, download instead
      handleDownload(documentItem);
    }
  };

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm("Delete this document permanently?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${apiUrl}/api/documents/${documentId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
      setUploadMessage("Document deleted.");
      setActiveMenuId(null);
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (error) {
      setUploadMessage(error.message);
      setTimeout(() => setUploadMessage(""), 3000);
    }
  };

  const handleToggleMenu = (docId, event) => {
    if (event) {
      event.stopPropagation();
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 5,
        right: window.innerWidth - rect.right + 10,
      });
    }
    setActiveMenuId((prev) => (prev === docId ? null : docId));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenuId !== null) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  const filterOptions = (items, field) => {
    const values = items.map((item) => item[field] || "Unassigned");
    return [`All ${field === "documentType" ? "Types" : "Cases"}`, ...new Set(values)];
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = [doc.title, doc.originalName, doc.caseName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType = filterType === "All Types" || doc.documentType === filterType;
    const matchesCase = filterCase === "All Cases" || doc.caseName === filterCase;

    return matchesSearch && matchesType && matchesCase;
  });

  const typeOptions = filterOptions(documents, "documentType");
  const caseOptions = filterOptions(documents, "caseName");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Document Viewer Modal */}
      {viewerDoc && (
        <DocumentViewer
          document={viewerDoc}
          onClose={() => setViewerDoc(null)}
          onDownload={handleDownload}
        />
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-bold text-lg">Document Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-100 p-1 rounded"><X size={20} /></button>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleCloseAnalysis}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">AI Document Analysis</h2>
                <p className="text-sm text-gray-500">{analysisDoc?.title || analysisDoc?.originalName}</p>
              </div>
              <button onClick={handleCloseAnalysis} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {analysisLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mb-4"></div>
                  <p className="text-gray-500">Analyzing document, please wait...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4 text-sm text-gray-700">
                  {analysisResult.error ? (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
                      {analysisResult.error}
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-base">Summary</h3>
                        <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-base">Key Points</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {analysisResult.keyPoints?.map((point, idx) => (
                            <li key={idx} className="text-gray-700">{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-base">Recommendations</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {analysisResult.recommendations?.map((rec, idx) => (
                            <li key={idx} className="text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No analysis data available.</div>
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
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm shadow-sm ${
          uploadMessage.includes('failed') || uploadMessage.includes('Unable') 
            ? 'border-red-200 text-red-600 bg-red-50' 
            : 'border-green-100 text-green-700 bg-green-50'
        }`}>
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
          {typeOptions.map((typeOption) => (
            <option key={typeOption} value={typeOption}>{typeOption}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm outline-none"
          value={filterCase}
          onChange={(e) => setFilterCase(e.target.value)}
        >
          {caseOptions.map((caseOption) => (
            <option key={caseOption} value={caseOption}>{caseOption}</option>
          ))}
        </select>
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center text-gray-500">Loading documents...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">No documents found.</div>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc._id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{doc.documentType}</p>
                    <h3 className="mt-3 text-base font-semibold text-gray-900 truncate">{doc.title || doc.originalName}</h3>
                    <p className="mt-2 text-sm text-gray-500 truncate">{doc.caseName || "No case assigned"}</p>
                  </div>
                  <button 
                    onClick={(e) => handleToggleMenu(doc._id, e)} 
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                <p className="mt-4 text-sm text-gray-500">{doc.sizeReadable} · {formatDate(doc.createdAt)}</p>

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

                {activeMenuId === doc._id && (
                  <div 
                    className="fixed z-50 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
                    style={{
                      top: `${menuPosition.top}px`,
                      right: `${menuPosition.right}px`,
                    }}
                  >
                    <button
                      onClick={() => { handleOpenDocument(doc); setActiveMenuId(null); }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      View document
                    </button>
                    <button
                      onClick={() => { handleDelete(doc._id); }}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 transition"
                    >
                      Delete document
                    </button>
                  </div>
                )}
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
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading documents...</td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No documents found.</td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-white border transition">📄</div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">{doc.title || doc.originalName}</p>
                          <p className="text-[10px] text-gray-400 font-mono uppercase">{doc._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${typeColor[doc.documentType] || "bg-gray-100 text-gray-700"}`}>
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 italic">{doc.caseName || "-"}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{doc.sizeReadable}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {doc.status || "Processed"}
                      </span>
                    </td>
                    <td className="px-4 py-4 leading-tight">
                      <p className="text-sm font-medium text-gray-700">{formatDate(doc.createdAt)}</p>
                      <p className="text-xs text-gray-400">{doc.uploadedBy || "User"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3 text-gray-400">
                        <button onClick={() => handleAnalyze(doc._id)} className="hover:text-gray-700 transition" title="Analyze document">
                          <Sparkles size={18} />
                        </button>
                        <button onClick={() => handleDownload(doc)} className="hover:text-gray-700 transition" title="Download document">
                          <Download size={18} />
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

      {/* Global Menu Dropdown */}
      {activeMenuId && (
        <div 
          className="fixed z-50 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
          }}
        >
          {(() => {
            const doc = documents.find(d => d._id === activeMenuId);
            if (!doc) return null;
            return (
              <>
                <button
                  onClick={() => { handleOpenDocument(doc); setActiveMenuId(null); }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  View document
                </button>
                <button
                  onClick={() => { handleDelete(doc._id); }}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 transition"
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