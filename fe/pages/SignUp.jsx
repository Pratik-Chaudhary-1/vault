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

      // Show success message then redirect
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 text-lg">
            Thanks — welcome for using this app!
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join SecureVault today</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <AuthForm type="signup" onSubmit={handleSignUp} loading={loading} />

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
