import { Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.get(`/user/search?query=${query}`);
      const usersData = response.data.data?.users || response.data.users || [];
      setResults(usersData);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVault = (username) => {
    navigate(`/vault/${username}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for users..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Search Results
          </h3>
          {results.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-800">
                  {user.name || user.username}
                </span>
              </div>
              <button
                onClick={() => handleViewVault(user.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Vault
              </button>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <p className="text-center text-gray-600 py-8">No users found</p>
      )}
    </div>
  );
};

export default SearchUser;
