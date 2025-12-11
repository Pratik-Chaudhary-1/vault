import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Loader } from "lucide-react";
import Navbar from "../components/Navbar";
import FileCard from "../components/Card";
import apiClient from "../api/apiClient";

const Vault = () => {
  const { username } = useParams();
  const [vaultData, setVaultData] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      setError("");
      try {
        const userResponse = await apiClient.get(`/user/${username}`);
        const userId = userResponse.data.data?.user?.id || username;
        
        const filesResponse = await apiClient.get(`/file/public/${userId}`);
        const filesData = filesResponse.data.data?.files || filesResponse.data.files || [];
        setFiles(filesData);
        setVaultData(userResponse.data.data?.user || { name: username });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load vault");
      } finally {
        setLoading(false);
      }
    };

    fetchVault();
  }, [username]);

  return (
    <div className="min-h-screen bg-dark-bg-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card-dark p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center shadow-dark-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-text-primary">
                {vaultData?.name || username}'s Vault
              </h1>
              <p className="text-dark-text-secondary mt-1">Public files only</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-dark-accent-primary animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-text-secondary text-lg">No public files available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                showDelete={false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Vault;
