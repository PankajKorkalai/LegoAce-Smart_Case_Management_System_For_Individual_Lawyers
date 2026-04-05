const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Document = require("../models/Documents.model");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all documents
router.get("/documents", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });

    const documentsWithUrls = documents.map((doc) => {
      const signedUrl = cloudinary.url(doc.publicId, {
        resource_type: doc.resourceType || "auto",
        secure: true,
        sign_url: true,
      });

      return {
        ...doc.toObject(),
        signedUrl,
      };
    });

    res.json(documentsWithUrls);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    res.status(500).json({ error: "Unable to fetch documents." });
  }
});

// POST upload document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const { caseName, documentType } = req.body;
    const file = req.file;

    // Convert buffer to base64 for Cloudinary upload
    const base64File = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64File}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "legal_documents",
      resource_type: "auto",
      access_mode: "public",
    });

    // Format file size
    const formatBytes = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Create document record
    const document = new Document({
      originalName: file.originalname,
      title: file.originalname.split(".")[0],
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      mimeType: file.mimetype,
      size: file.size,
      sizeReadable: formatBytes(file.size),
      documentType: documentType || "Uploaded Document",
      caseName: caseName || "",
      uploadedBy: req.user?.email || "Anonymous",
      status: "Processed",
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

// GET analyze document
router.get("/documents/:id/analyze", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    const analysis = {
      title: document.title || document.originalName,
      summary: `This document is a ${document.documentType.toLowerCase()} related to "${document.caseName || "an unspecified case"}". It was uploaded on ${new Date(document.createdAt).toLocaleDateString()} and is currently stored securely in Cloudinary. The file size is ${document.sizeReadable} and it is of type ${document.mimeType}.`,
      keyPoints: [
        `Document Type: ${document.documentType}`,
        `Case Association: ${document.caseName || "Not assigned to any case"}`,
        `Original Filename: ${document.originalName}`,
        `File Size: ${document.sizeReadable}`,
        `Storage: Cloudinary (${document.resourceType})`,
        `Upload Date: ${new Date(document.createdAt).toLocaleDateString()}`,
      ],
      recommendations: [
        "Review the document for legal compliance and relevance to the case.",
        "Consider sharing this document with relevant legal team members.",
        "Ensure all metadata is accurate for future reference.",
        "Set up document retention policies if needed.",
      ],
      metadata: {
        mimeType: document.mimeType,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
        documentId: document._id,
      },
    };

    res.json({ analysis });
  } catch (error) {
    console.error("Failed to analyze document:", error);
    res.status(500).json({ error: "Failed to analyze document." });
  }
});

// DELETE document
router.delete("/documents/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(document.publicId, {
      resource_type: document.resourceType,
      invalidate: true,
    });

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: "Document deleted successfully." });
  } catch (error) {
    console.error("Failed to delete document:", error);
    res.status(500).json({ error: "Unable to delete document." });
  }
});

module.exports = router;