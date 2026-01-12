import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/buy", label: "物件を探す" },
    { path: "/sell", label: "物件を売る" },
    { path: "/mypage", label: "マイページ" },
    { path: "/company", label: "会社概要" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="PEAKAS" className="h-14" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Icon */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${isActive(link.path) ? "text-primary bg-primary/5" : "text-gray-600"}`}>
                  {link.label}
                </Link>
              ))}
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-gray-600">ログイン</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
