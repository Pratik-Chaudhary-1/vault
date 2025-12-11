import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../api/apiClient";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data.data || response.data;
      const username = user?.username || user?.name || "";

      login(token, username);
      if (username) {
        localStorage.setItem("username", username);
      }

      setShowWelcome(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border border-white/20">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 font-medium">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-gray-600 mt-2 font-medium">
            Sign in to your SecureVault account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 font-medium">
            {error}
          </div>
        )}

        <AuthForm type="signin" onSubmit={handleSignIn} loading={loading} />

        <p className="text-center mt-6 text-gray-600 font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-indigo-600 font-semibold hover:underline transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
