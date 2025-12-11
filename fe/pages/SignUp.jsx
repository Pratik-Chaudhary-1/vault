import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, CheckCircle } from "lucide-react";
import AuthForm from "../components/AuthForm";
import apiClient from "../api/apiClient";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (formData) => {
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/auth/register", formData);
      setSuccess(true);

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border border-white/20">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Success!</h2>
          <p className="text-gray-700 text-lg font-medium">
            Thanks — welcome for using this app!
          </p>
          <p className="text-gray-500 text-sm mt-4 font-medium">
            Redirecting to sign in...
          </p>
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create Account</h2>
          <p className="text-gray-600 mt-2 font-medium">Join SecureVault today</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 font-medium">
            {error}
          </div>
        )}

        <AuthForm type="signup" onSubmit={handleSignUp} loading={loading} />

        <p className="text-center mt-6 text-gray-600 font-medium">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:text-indigo-600 font-semibold hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
