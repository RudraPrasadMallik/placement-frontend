import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { api, clearStoredAuth, setStoredAuth } from "../pages/services/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "student" | "company";
}

export function LoginModal({ isOpen, onClose, type }: LoginModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      clearStoredAuth();
      const response = await api.login({
        email: formData.email,
        password: formData.password,
      });

      if (!response?.success || !response?.token) {
        setError(response?.message || "Login failed. Please try again.");
        return;
      }

      const isAdmin = response.role === "ADMIN";
      const expectedRole = type === "student" ? "STUDENT" : "COMPANY";
      const fallbackRoute = isAdmin
        ? "/admin-dashboard"
        : type === "student"
          ? "/student-dashboard"
          : "/company-dashboard";

      if (!isAdmin && response.role !== expectedRole) {
        setError(
          type === "student"
            ? "Please log in with a student account."
            : "Please log in with a company account."
        );
        return;
      }

      setStoredAuth(response);
      setFormData({ email: "", password: "" });
      setShowPassword(false);
      onClose();
      navigate(response.redirectPath || fallbackRoute);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNavigation = () => {
    onClose();
    navigate(type === "student" ? "/students" : "/recruiters");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {type === "student" ? "Student Login" : "Company Login"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-12 focus:border-transparent focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600">
              <input type="checkbox" className="rounded border-slate-300" />
              Remember me
            </label>
            <a href="#" className="text-primary transition-colors hover:text-accent">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-white shadow-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleRegisterNavigation}
              className="font-semibold text-primary transition-colors hover:text-accent"
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
