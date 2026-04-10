import { Link, useLocation, useNavigate } from "react-router";
import { GraduationCap, Menu, X, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { LoginModal } from "./LoginModal";
import { api, clearStoredAuth, getStoredAuth } from "../pages/services/api";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState<"student" | "company">("student");
  const [authUser, setAuthUser] = useState<any>(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Recruiters", path: "/recruiters" },
    { name: "Students", path: "/students" },
    { name: "Statistics", path: "/statistics" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    setAuthUser(getStoredAuth());
  }, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthUser(getStoredAuth());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const dashboardPath = authUser?.role === "ADMIN"
    ? "/admin-dashboard"
    : authUser?.role === "COMPANY"
      ? "/company-dashboard"
      : authUser?.role === "STUDENT"
        ? "/student-dashboard"
        : null;

  const dashboardLabel = authUser?.role === "ADMIN"
    ? "Admin Dashboard"
    : authUser?.role === "COMPANY"
      ? "Company Dashboard"
      : "Student Dashboard";

  const handleLogout = () => {
    api.logout().catch(() => {});
    clearStoredAuth();
    setAuthUser(null);
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
              <GraduationCap className="w-7 h-7 text-white group-hover:text-accent-foreground" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">EATM</div>
              <div className="text-xs text-slate-600">Placement Cell</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="ml-2 flex gap-2">
              {dashboardPath ? (
                <>
                  <Link
                    to={dashboardPath}
                    className={`px-4 py-2 rounded-md transition-colors inline-flex items-center gap-2 ${
                      isActive(dashboardPath)
                        ? "bg-primary text-white"
                        : "text-primary border border-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setLoginModalOpen(true);
                      setLoginType("student");
                    }}
                    className="px-4 py-2 rounded-md text-primary border border-primary hover:bg-primary hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Student
                  </button>
                  <button
                    onClick={() => {
                      setLoginModalOpen(true);
                      setLoginType("company");
                    }}
                    className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Company
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {dashboardPath && (
              <Link
                to={dashboardPath}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md transition-colors ${
                  isActive(dashboardPath)
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-slate-100"
                }`}
              >
                {dashboardLabel}
              </Link>
            )}
            {dashboardPath ? (
              <button
                onClick={handleLogout}
                className="mt-2 block w-full rounded-md bg-slate-100 px-4 py-3 text-left text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="mt-2 grid gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                    setLoginType("student");
                  }}
                  className="rounded-md border border-primary px-4 py-3 text-primary hover:bg-primary hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Student Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                    setLoginType("company");
                  }}
                  className="rounded-md bg-accent px-4 py-3 text-accent-foreground hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Company Login
                </button>
              </div>
            )}
          </nav>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        type={loginType}
      />
    </header>
  );
}
