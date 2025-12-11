import { Download, Trash2, Lock, Unlock, FileText } from "lucide-react";
import { useState } from "react";
import apiClient from "../api/apiClient";

const FileCard = ({ file, onDelete, showDelete = true }) => {
  const [downloading, setDownloading] = useState(false);

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await apiClient.get(`/file/download/${file.id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(
        "Download failed: " + (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      onDelete(file.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <h3 className="font-semibold text-gray-800 truncate">
            {file.filename}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {file.visibility === "PRIVATE" ? (
            <Lock className="w-4 h-4 text-red-600" />
          ) : (
            <Unlock className="w-4 h-4 text-green-600" />
          )}
        </div>
      </div>

      <div className="space-y-1 mb-4 text-sm text-gray-600">
        <p>Size: {formatSize(file.size)}</p>
        <p>Uploaded: {formatDate(file.createdAt || file.uploadedAt)}</p>
        {file.user?.username && <p>By: {file.user.username}</p>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? "Downloading..." : "Download"}</span>
        </button>

        {showDelete && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileCard;
