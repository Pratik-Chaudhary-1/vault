import { X, Upload, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import apiClient from "../api/apiClient";

const FileUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileSchema = z.object({
    size: z.number().max(20 * 1024 * 1024, "File size must be less than 20MB"),
    type: z.enum(["application/pdf", "video/mp4"], {
      errorMap: () => ({ message: "Only PDF and MP4 files are allowed" }),
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
    formData.append("privacy", privacy);

    try {
      const response = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadSuccess(response.data.fileMeta);
      setFile(null);
      setPrivacy("public");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Upload File
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Select File (PDF or MP4, max 20MB)
            </label>
            <input
              type="file"
              accept=".pdf,.mp4"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Privacy Setting
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="public"
                  checked={privacy === "public"}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-4 h-4"
                />
                <Unlock className="w-4 h-4 text-green-600" />
                <span>Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="private"
                  checked={privacy === "private"}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-4 h-4"
                />
                <Lock className="w-4 h-4 text-red-600" />
                <span>Private</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
