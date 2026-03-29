import { Link, useLocation } from "react-router";
import { GraduationCap, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "./LoginModal";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState<"student" | "company">("student");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Placement Cell", path: "/about" },
    { name: "Recruiters", path: "/recruiters" },
    { name: "Students", path: "/students" },
    { name: "Statistics", path: "/statistics" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
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