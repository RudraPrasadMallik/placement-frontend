import { Link } from "react-router";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">About Placement Cell</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Dedicated to connecting our talented students with leading companies and organizations worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-accent transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-accent transition-colors text-sm">
                  About Placement Cell
                </Link>
              </li>
              <li>
                <Link to="/students" className="text-slate-300 hover:text-accent transition-colors text-sm">
                  For Students
                </Link>
              </li>
              <li>
                <Link to="/recruiters" className="text-slate-300 hover:text-accent transition-colors text-sm">
                  For Recruiters
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-accent" />
                <span className="text-slate-300">
                  EATM Campus, Khordha.
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-accent" />
                <span className="text-slate-300">+91 1234567890</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-accent" />
                <span className="text-slate-300">placements@eatm.edu</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-accent flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-accent flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-accent flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-accent flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} eatm placement cell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
