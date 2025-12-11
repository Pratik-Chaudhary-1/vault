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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Upload className="w-5 h-5 text-white" />
            </div>
            Upload File
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Select File (PDF, MP4, JPG, PNG, TXT - max 20MB)
            </label>
            <input
              type="file"
              accept=".pdf,.mp4,.jpg,.jpeg,.png,.txt"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600 file:text-white hover:file:from-blue-600 hover:file:to-indigo-700 file:cursor-pointer"
              required
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2 font-medium">
                Selected: <span className="text-blue-600">{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-3 font-semibold">
              Privacy Setting
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all flex-1">
                <input
                  type="radio"
                  value="PUBLIC"
                  checked={visibility === "PUBLIC"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-green-500 focus:ring-green-500"
                />
                <Unlock className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-medium">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all flex-1">
                <input
                  type="radio"
                  value="PRIVATE"
                  checked={visibility === "PRIVATE"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-500"
                />
                <Lock className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 font-medium">Private</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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
