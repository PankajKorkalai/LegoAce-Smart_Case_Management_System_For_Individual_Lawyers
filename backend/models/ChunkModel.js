const mongoose = require("mongoose");

const ChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    caseName: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number], // Gemini embedding dimensions (768)
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Add a vector index if using Atlas Search, or just a standard index for queries
ChunkSchema.index({ documentId: 1 });
ChunkSchema.index({ caseName: 1 });

module.exports = mongoose.model("Chunk", ChunkSchema);
