import mongoose from "mongoose";

const File = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "folder",
    },
    owner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

File.virtual("url").get(function () {
  const url = process.env.URL || "http://localhost:3333";

  return `${url}/t/files/${encodeURIComponent(this.path)}`;
});

export default mongoose.model("File", File);
