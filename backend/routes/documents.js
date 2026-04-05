const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Document = require("../models/Documents.model");
const axios = require("axios");

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
    res.json(documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    res.status(500).json({ error: "Unable to fetch documents." });
  }
});

// GET document for viewing (inline viewer)
router.get("/documents/:id/view", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    let viewUrl;
    const { mimeType, publicId, resourceType, cloudinaryUrl } = document;

    // For PDFs - direct view
    if (mimeType === 'application/pdf') {
      viewUrl = cloudinary.url(publicId, {
        resource_type: resourceType || "auto",
        secure: true,
      });
    }
    // For images - direct view
    else if (mimeType?.startsWith('image/')) {
      viewUrl = cloudinary.url(publicId, {
        resource_type: resourceType || "image",
        secure: true,
      });
    }
    // For Word, Excel, PPT - Google Docs Viewer
    else if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      const fileUrl = cloudinary.url(publicId, {
        resource_type: resourceType || "raw",
        secure: true,
      });
      viewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    } else {
      viewUrl = cloudinaryUrl;
    }

    res.json({ viewUrl, mimeType: document.mimeType });
  } catch (error) {
    console.error("Failed to get document view:", error);
    res.status(500).json({ error: "Unable to get document view." });
  }
});

// 🔥 DOWNLOAD document - WORKING SOLUTION 🔥
router.get("/documents/:id/download", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    // Get file from Cloudinary
    const fileUrl = cloudinary.url(document.publicId, {
      resource_type: document.resourceType || "auto",
      secure: true,
    });

    // Fetch file from Cloudinary
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream'
    });

    // Set proper headers for download
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document.originalName)}"`);
    res.setHeader('Content-Length', document.sizeBytes);

    // Stream the file to response
    response.data.pipe(res);
    
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Unable to download document." });
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
      title: file.originalname.split(".")[0],
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

// GET analyze document
router.get("/documents/:id/analyze", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    const analysis = {
      title: document.title || document.originalName,
      summary: `This document is a ${document.documentType.toLowerCase()} related to "${document.caseName || "an unspecified case"}". File size: ${document.sizeReadable}`,
      keyPoints: [
        `Document Type: ${document.documentType}`,
        `Case: ${document.caseName || "Not assigned"}`,
        `File: ${document.originalName}`,
        `Size: ${document.sizeReadable}`,
      ],
      recommendations: [
        "Review document for legal compliance",
        "Share with relevant team members",
      ],
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