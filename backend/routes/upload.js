const express = require("express");
const multer = require("multer");
const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;
const Document = require("../models/Documents.model");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const missingCloudinaryEnv = [];
for (const key of [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
]) {
  if (!process.env[key]) missingCloudinaryEnv.push(key);
}

if (missingCloudinaryEnv.length > 0) {
  throw new Error(
    `Missing Cloudinary environment variables: ${missingCloudinaryEnv.join(", ")}. ` +
      "Set them in backend/.env and restart the server."
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided." });
  }

  try {
    const result = await uploadBufferToCloudinary(req.file.buffer);

    const documentRecord = await Document.create({
      title: req.body.title || req.file.originalname,
      originalName: req.file.originalname,
      description: req.body.description || "",
      caseName: req.body.caseName || "Unassigned",
      documentType: req.body.documentType || "Uploaded Document",
      status: req.body.status || "processed",
      uploadedBy: req.body.uploadedBy || "system",
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      sizeReadable: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      rawResult: result,
    });

    return res.status(201).json({
      message: "File uploaded and stored successfully.",
      document: documentRecord,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return res.status(500).json({ error: "Upload failed.", details: error.message });
  }
});

module.exports = router;
