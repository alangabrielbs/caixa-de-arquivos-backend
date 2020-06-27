import mongoose from "mongoose";

const Folder = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    owner: {
      type: String,
      require: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    lastVisit: {
      type: Date,
      default: Date.now,
    },
    root: {
      type: Boolean,
      default: false,
    },
    parentFolder: { type: mongoose.ObjectId, ref: "Folder" },
    sharedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Folder", Folder);
