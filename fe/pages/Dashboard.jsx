import { useState } from "react";
import { Plus, Loader } from "lucide-react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import FileCard from "../components/Card";
import FileUploadModal from "../components/Upload";
import { useFiles } from "../hooks/useFiles";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { files, loading, error, deleteFile, addFile } = useFiles(activeFilter);

  const handleDeleteFile = async (fileId) => {
    const result = await deleteFile(fileId);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleUploadSuccess = (newFile) => {
    addFile(newFile);
    alert("File uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="flex">
        <HamburgerMenu
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent capitalize">
                  {activeFilter === "all"
                    ? "All Files"
                    : `${activeFilter} Files`}
                </h1>
                <p className="text-gray-600 mt-2 font-medium">
                  Manage and organize your files
                </p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Content
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-200 max-w-md mx-auto">
                  <p className="text-gray-600 text-lg mb-4 font-medium">No files found</p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                  >
                    Upload your first file
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={handleDeleteFile}
                    showDelete={true}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;
