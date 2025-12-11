import Navbar from "../components/Navbar";
import SearchUser from "../components/Search";

const VaultSearch = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Search User Vaults
          </h1>
          <p className="text-gray-600 mt-2">
            Find and view public files from other users
          </p>
        </div>

        <SearchUser />
      </main>
    </div>
  );
};

export default VaultSearch;
