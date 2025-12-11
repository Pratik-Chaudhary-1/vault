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

      if (response.status === 200 && response.data) {
        const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.filename);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Download error:", error);
      let errorMessage = "Unknown error";
      
      if (error.response) {
        if (error.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const text = reader.result;
              const json = JSON.parse(text);
              errorMessage = json.message || json.error || "Download failed";
              alert(`Download failed: ${errorMessage}`);
            } catch (e) {
              errorMessage = "Download failed";
              alert(`Download failed: ${errorMessage}`);
            }
          };
          reader.readAsText(error.response.data);
          return;
        } else {
          errorMessage = error.response.data?.message || error.response.data?.error || "Download failed";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Download failed: ${errorMessage}`);
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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-5 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <FileText className="w-4 h-4 text-white flex-shrink-0" />
          </div>
          <h3 className="font-semibold text-gray-800 truncate">
            {file.filename}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {file.visibility === "PRIVATE" ? (
            <div className="p-1.5 bg-red-100 rounded-lg">
              <Lock className="w-4 h-4 text-red-600" />
            </div>
          ) : (
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Unlock className="w-4 h-4 text-green-600" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5 mb-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <p className="font-medium">Size: <span className="text-gray-800">{formatSize(file.size)}</span></p>
        <p className="font-medium">Uploaded: <span className="text-gray-800">{formatDate(file.createdAt || file.uploadedAt)}</span></p>
        {file.user?.username && <p className="font-medium">By: <span className="text-gray-800">{file.user.username}</span></p>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl font-semibold"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? "Downloading..." : "Download"}</span>
        </button>

        {showDelete && (
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileCard;
