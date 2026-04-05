const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    caseName: {
      type: String,
      default: "Unassigned",
      trim: true,
    },
    documentType: {
      type: String,
      default: "Uploaded Document",
      trim: true,
    },
    status: {
      type: String,
      default: "processed",
      trim: true,
    },
    uploadedBy: {
      type: String,
      default: "system",
      trim: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
    sizeReadable: {
      type: String,
      required: true,
      trim: true,
    },
    rawResult: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", DocumentSchema);