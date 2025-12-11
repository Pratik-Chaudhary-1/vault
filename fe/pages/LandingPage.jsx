import { useNavigate } from "react-router-dom";
import { FileText, Shield, Cloud, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl">
              <FileText className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white drop-shadow-lg">SecureVault</h1>
          </div>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
            Your secure cloud storage solution for managing and sharing files
            with confidence. Upload, organize, and control access to your
            documents with ease.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/signin")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-2xl hover:shadow-3xl flex items-center gap-2 transform hover:scale-105"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Register / Sign Up
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border border-white/20">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Secure Storage
            </h3>
            <p className="text-gray-600 font-medium">
              Your files are protected with industry-standard encryption and
              secure authentication.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border border-white/20">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Cloud className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Easy Access
            </h3>
            <p className="text-gray-600 font-medium">
              Access your files from anywhere with our intuitive web interface.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border border-white/20">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Privacy Control
            </h3>
            <p className="text-gray-600 font-medium">
              Choose between public and private files to control who can access
              your content.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-white/80 font-medium">
          <p>Trusted by users worldwide for secure file storage and sharing</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
