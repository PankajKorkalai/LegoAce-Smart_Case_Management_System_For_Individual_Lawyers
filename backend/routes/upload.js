const express = require("express");
const multer = require("multer");
const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;
const Document = require("../models/Documents.model");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const ChunkModel = require("../models/ChunkModel");

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

    // --- RAG PROCESSING FOR PDFS ---
    let ragProcessStatus = "Starting...";
    const isPDF = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');

    if (!process.env.GEMINI_API_KEY) {
      ragProcessStatus = "Skipped - Missing GEMINI_API_KEY in backend/.env!";
    } else if (!isPDF) {
      ragProcessStatus = `Skipped - Not a PDF (Type was: ${req.file.mimetype}, Name was: ${req.file.originalname})`;
    } else {
      try {
        console.log("\n--- Starting Gemini Native Document Extraction ---");
        const { GoogleGenAI } = require("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        console.log("Passing PDF buffer to Gemini 1.5 Flash natively...");
        // 1. Ask Gemini to read the file with its own multimodal vision/text engine!
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: "application/pdf" // force PDF mimetype
              }
            },
            "Extract and return literally just the raw text transcript of this document. Do not summarize or format."
          ]
        });
        
        const rawText = response.text;
        
        if (!rawText || rawText.trim().length < 5) {
          throw new Error("Gemini returned an empty text string (Document might be unreadable/empty).");
        }
        
        console.log(`Gemini natively extracted ${rawText.length} characters of text! Spliting chunks...`);
        
        // 2. Split into 1000-character chunks
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const chunks = await splitter.createDocuments([rawText]);
        
        console.log(`Generated ${chunks.length} chunks. Creating embeddings...`);
        
        // 3. Create Embeddings in batch
        const embeddingsModel = new GoogleGenerativeAIEmbeddings({
          model: "gemini-embedding-001", // Always 768 dimensions for this model
          apiKey: process.env.GEMINI_API_KEY
        });
        
        const chunkTexts = chunks.map(chunk => chunk.pageContent);
        // This will batch send strings to Google Gemini and return an array of 768-D vectors
        const vectorArrays = await embeddingsModel.embedDocuments(chunkTexts);
        
        // 4. Combine into DB format
        const chunkDocsToSave = chunks.map((chunk, index) => ({
          documentId: documentRecord._id,
          caseName: documentRecord.caseName,
          text: chunk.pageContent,
          embedding: vectorArrays[index]
        }));
        
        // 5. Save securely to MongoDB
        await ChunkModel.insertMany(chunkDocsToSave);
        console.log("RAG processing complete! Embeddings saved.");
        ragProcessStatus = "AI Chunks Successfully Created!";
        
      } catch (ragError) {
        console.error("RAG vectorization failed (but file was saved):", ragError);
        // We log the error but don't crash the api, the file is still securely in Cloudinary
        ragProcessStatus = `Error creating chunks: ${ragError.message}`;
      }
    }

    return res.status(201).json({
      message: "File uploaded and stored successfully.",
      document: documentRecord,
      ragStatus: ragProcessStatus
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return res.status(500).json({ error: "Upload failed.", details: error.message });
  }
});

router.get("/documents", async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId);
    }

    await ChunkModel.deleteMany({ documentId: id });
    await Document.findByIdAndDelete(id);

    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Failed to delete document:", error);
    return res.status(500).json({ error: "Failed to delete document" });
  }
});

module.exports = router;
