const mongoose = require("mongoose");
const schema = mongoose.Schema;

const chunkSchema = new schema({
  documentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Document' 
  },
  caseName: String,
  text: String, // The actual chunk of text extracted from the PDF
  embedding: [Number] // The math vector (e.g., 768 dimensions for Gemini)
}, { timestamps: true });

module.exports = mongoose.model("Chunk", chunkSchema);
