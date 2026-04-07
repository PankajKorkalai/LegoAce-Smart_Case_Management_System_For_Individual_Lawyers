const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Document = require("../models/Documents.model");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Standardized SDK

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── GET all documents ────────────────────────────────────────────────────────
router.get("/documents", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    res.status(500).json({ error: "Unable to fetch documents." });
  }
});

// ─── GET /documents/:id/view  →  always returns JSON { viewUrl, type } ────────
router.get("/documents/:id/view", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    const fileUrl = cloudinary.url(document.publicId, {
      resource_type: document.resourceType || "auto",
      secure: true,
    });

    const { mimeType } = document;

    if (mimeType === "application/pdf") {
      return res.json({ viewUrl: fileUrl, type: "pdf" });
    }

    if (mimeType && mimeType.startsWith("image/")) {
      return res.json({ viewUrl: fileUrl, type: "image" });
    }

    const officeTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    
    if (officeTypes.includes(mimeType)) {
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        fileUrl
      )}&embedded=true`;
      return res.json({ viewUrl: googleViewerUrl, type: "office" });
    }

    return res.json({ viewUrl: fileUrl, type: "other" });
  } catch (error) {
    console.error("Failed to get document view URL:", error);
    res.status(500).json({ error: "Unable to get document view URL." });
  }
});

// ─── GET /documents/:id/download  →  streams file to browser ─────────────────
router.get("/documents/:id/download", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    // Clean URL without flags ensures Axios can fetch the stream properly
    const fileUrl = cloudinary.url(document.publicId, {
      resource_type: document.resourceType || "auto",
      secure: true,
    });

    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
    });

    res.setHeader("Content-Type", document.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(document.originalName)}"`
    );

    if (document.sizeBytes) {
      res.setHeader("Content-Length", document.sizeBytes);
    }

    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Unable to download document." });
  }
});

// ─── GET /documents/:id/analyze  →  real AI analysis via Gemini ───────────────
router.get("/documents/:id/analyze", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    // Initialize standard Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { mimeType, publicId, resourceType } = document;
    let aiResponseText;

    const supportedInlineMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const prompt = `You are a professional legal AI assistant.
Analyze this legal document thoroughly and respond ONLY with a valid JSON object (no markdown, no backticks) in exactly this format:
{
  "title": "short document title",
  "summary": "2–3 sentence overview of what this document is about",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

    if (supportedInlineMimeTypes.includes(mimeType)) {
      try {
        const fileUrl = cloudinary.url(publicId, {
          resource_type: resourceType || "auto",
          secure: true,
        });

        const fileResponse = await axios({
          method: "GET",
          url: fileUrl,
          responseType: "arraybuffer",
        });

        const base64Data = Buffer.from(fileResponse.data).toString("base64");

        const response = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ]);
        aiResponseText = response.response.text();
      } catch (fetchError) {
        console.error("Could not fetch file for inline analysis:", fetchError.message);
        aiResponseText = null; // Trigger fallback
      }
    }

    // Fallback to metadata analysis if inline failed or type is unsupported (e.g. Word Docs)
    if (!aiResponseText) {
      const metaPrompt = `You are a professional legal AI assistant.
Based on the following document metadata, provide a meaningful analysis.
Respond ONLY with a valid JSON object (no markdown, no backticks) in exactly this format:
{
  "title": "short document title",
  "summary": "2–3 sentence overview based on the metadata",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Document Metadata:
- Title: ${document.title || document.originalName}
- Type: ${document.documentType}
- Case: ${document.caseName || "Not assigned"}
- File name: ${document.originalName}
- MIME type: ${mimeType}
- Size: ${document.sizeReadable}
- Uploaded: ${document.createdAt}`;

      const response = await model.generateContent(metaPrompt);
      aiResponseText = response.response.text();
    }

    let analysis;
    try {
      const cleaned = aiResponseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        title: document.title || document.originalName,
        summary: aiResponseText,
        keyPoints: [],
        recommendations: [],
      };
    }

    res.json({ analysis });
  } catch (error) {
    console.error("Failed to analyze document:", error);
    res.status(500).json({ error: "Failed to analyze document.", details: error.message });
  }
});

// ─── DELETE /documents/:id  →  removes from Cloudinary + MongoDB ──────────────
router.delete("/documents/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    try {
      // Must use exact resource type for successful deletion
      await cloudinary.uploader.destroy(document.publicId, {
        resource_type: document.resourceType, 
        invalidate: true,
      });
    } catch (cloudErr) {
      console.error("Cloudinary delete warning:", cloudErr.message);
    }

    await Document.findByIdAndDelete(req.params.id);

    try {
      const ChunkModel = require("../models/ChunkModel");
      await ChunkModel.deleteMany({ documentId: req.params.id });
    } catch {}

    res.json({ message: "Document deleted successfully." });
  } catch (error) {
    console.error("Failed to delete document:", error);
    res.status(500).json({ error: "Unable to delete document." });
  }
});

// ─── POST /upload ─────────────────────────────────────────────────────────────
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const { caseName, documentType } = req.body;
    const file = req.file;

    const base64File = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64File}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "legal_documents",
      resource_type: "auto",
      access_mode: "public",
      use_filename: true,    // Added: Ensures the extension (.pdf, .docx) is kept for viewers
      unique_filename: true, // Added: Prevents overwriting files with the same name
    });

    const formatBytes = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const document = new Document({
      title: file.originalname.replace(/\.[^/.]+$/, ""),
      originalName: file.originalname,
      description: "",
      caseName: caseName || "Unassigned",
      documentType: documentType || "Uploaded Document",
      status: "processed",
      uploadedBy: "Anonymous",
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      sizeReadable: formatBytes(file.size),
      rawResult: uploadResult,
    });

    await document.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document: document,
    });
  } catch (error) {
    console.error("Failed to upload document:", error);
    res.status(500).json({ error: "Unable to upload document." });
  }
});

module.exports = router;