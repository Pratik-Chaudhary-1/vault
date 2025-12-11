import { useState } from "react";
import { z } from "zod";

const AuthForm = ({ type, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const signUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const schema = type === "signup" ? signUpSchema : signInSchema;
      schema.parse(formData);
      onSubmit(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {type === "signup" && (
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.username}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-gray-700 mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 mb-2 font-semibold">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 font-medium">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        {loading ? "Processing..." : type === "signup" ? "Register" : "Sign In"}
      </button>
    </form>
  );
};

export default AuthForm;
