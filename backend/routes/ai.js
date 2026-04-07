const express = require("express");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { GoogleGenAI } = require("@google/genai");
const ChunkModel = require("../models/ChunkModel");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key is not configured." });
  }

  try {
    // 1. Create embedding for the user's question
    const embeddingsModel = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GEMINI_API_KEY,
    });
    const questionVector = await embeddingsModel.embedQuery(message);

    // 2. Load documents and bypass MongoDB Search constraints natively
    const allChunks = await ChunkModel.find({ "embedding.1": { $exists: true } }).lean();

    const cosineSimilarity = (vecA, vecB) => {
        let dotProduct = 0, normA = 0, normB = 0;
        const len = Math.min(vecA.length, vecB.length);
        for (let i = 0; i < len; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    };

    // Mathematically score and rank the best chunks in Javascript memory!
    const scoredChunks = allChunks.map(chunk => ({
        text: chunk.text,
        caseName: chunk.caseName,
        score: chunk.embedding ? cosineSimilarity(questionVector, chunk.embedding) : 0
    })).sort((a, b) => b.score - a.score).slice(0, 3);
    
    // Only accept highly relevant results (score > 0.3)
    const relevantChunks = scoredChunks.filter(c => c.score > 0.3);

    // 3. Prepare the context for the LLM
    let contextText = "No direct document context found.";
    if (relevantChunks && relevantChunks.length > 0) {
      contextText = relevantChunks.map(c => `[Context from document]: ${c.text}`).join("\n\n");
    }

    // 4. Query the LLM
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const megaPrompt = `
You are a highly intelligent and formal legal AI assistant.
Answer the user's question using ONLY the provided document context. Do not invent or hallucinate information outside of this context.
If the answer cannot be found in the context, politely state that you cannot answer based on the current documents.

CONTEXT:
${contextText}

USER QUESTION:
${message}
    `;

    // Note: We use gemini-2.5-flash as the fast and standard text model.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: megaPrompt,
    });

    const aiResponseText = response.text || "An error occurred while generating the response.";

    return res.status(200).json({
      answer: aiResponseText,
      sources: relevantChunks.map(c => c.caseName || "Unknown Document")
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({ error: "Failed to process AI chat.", details: error.message });
  }
});

module.exports = router;
