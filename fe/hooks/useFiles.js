import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiClient";

export const useFiles = (filter = "all") => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/file/all");
      const filesData = response.data.data?.files || response.data.files || [];
      
      // Filter files based on activeFilter
      let filteredFiles = filesData;
      if (filter !== "all") {
        filteredFiles = filesData.filter(
          (file) => file.visibility?.toLowerCase() === filter.toLowerCase()
        );
      }
      
      setFiles(filteredFiles);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const deleteFile = useCallback(async (id) => {
    try {
      await apiClient.delete(`/file/${id}`);
      setFiles((prev) => prev.filter((file) => file.id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Delete failed",
      };
    }
  }, []);

  const addFile = useCallback((newFile) => {
    setFiles((prev) => [newFile, ...prev]);
  }, []);

  return { files, loading, error, refetch: fetchFiles, deleteFile, addFile };
};
