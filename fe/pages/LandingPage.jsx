import { useNavigate } from "react-router-dom";
import { FileText, Shield, Cloud, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="w-16 h-16 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">SecureVault</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your secure cloud storage solution for managing and sharing files
            with confidence. Upload, organize, and control access to your
            documents with ease.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/signin")}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg flex items-center gap-2"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
            >
              Register / Sign Up
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Secure Storage
            </h3>
            <p className="text-gray-600">
              Your files are protected with industry-standard encryption and
              secure authentication.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Easy Access
            </h3>
            <p className="text-gray-600">
              Access your files from anywhere with our intuitive web interface.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Privacy Control
            </h3>
            <p className="text-gray-600">
              Choose between public and private files to control who can access
              your content.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-gray-600">
          <p>Trusted by users worldwide for secure file storage and sharing</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
