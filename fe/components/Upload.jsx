import { X, Upload, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import apiClient from "../api/apiClient";

const FileUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileSchema = z.object({
    size: z.number().max(20 * 1024 * 1024, "File size must be less than 20MB"),
    type: z.enum([
      "application/pdf",
      "video/mp4",
      "image/jpeg",
      "image/png",
      "text/plain",
    ], {
      errorMap: () => ({ message: "Only PDF, MP4, JPG, PNG, and TXT files are allowed" }),
    }),
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError("");
    try {
      fileSchema.parse({
        size: selectedFile.size,
        type: selectedFile.type,
      });
      setFile(selectedFile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        setFile(null);
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("visibility", visibility);

    try {
      const response = await apiClient.post("/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadSuccess(response.data.data);
      setFile(null);
      setVisibility("PUBLIC");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-dark max-w-md w-full p-6 shadow-dark-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-dark-text-primary flex items-center gap-2">
            <div className="p-2 bg-gradient-accent rounded-lg">
              <Upload className="w-5 h-5 text-white" />
            </div>
            Upload File
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg-hover rounded-lg transition-colors text-dark-text-secondary hover:text-dark-text-primary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dark-text-primary mb-2 font-medium">
              Select File (PDF, MP4, JPG, PNG, TXT - max 20MB)
            </label>
            <input
              type="file"
              accept=".pdf,.mp4,.jpg,.jpeg,.png,.txt"
              onChange={handleFileChange}
              className="input-dark file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-dark-accent-primary file:text-white hover:file:bg-dark-accent-hover file:cursor-pointer"
              required
            />
            {file && (
              <p className="text-sm text-dark-text-secondary mt-2">
                Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-dark-text-primary mb-2 font-medium">
              Privacy Setting
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-dark-border-primary hover:bg-dark-bg-hover transition-colors">
                <input
                  type="radio"
                  value="PUBLIC"
                  checked={visibility === "PUBLIC"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-dark-accent-primary"
                />
                <Unlock className="w-4 h-4 text-green-400" />
                <span className="text-dark-text-primary">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-dark-border-primary hover:bg-dark-bg-hover transition-colors">
                <input
                  type="radio"
                  value="PRIVATE"
                  checked={visibility === "PRIVATE"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-dark-accent-primary"
                />
                <Lock className="w-4 h-4 text-red-400" />
                <span className="text-dark-text-primary">Private</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-dark-border-primary text-dark-text-primary rounded-lg hover:bg-dark-bg-hover transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
