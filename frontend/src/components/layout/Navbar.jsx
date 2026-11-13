import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, BookOpen, Lock, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Articles', path: '/blog' },
    { label: 'Cloud Architecture', path: '/blog?category=Cloud%20Computing' },
    { label: 'AI & ML', path: '/blog?category=Artificial%20Intelligence%20%26%20Machine%20Learning' },
    { label: 'Cybersecurity', path: '/blog?category=Cybersecurity' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro utility ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-blue-400 font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" />
              Vasanth Tech Blog
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">
              Architectural breakthroughs, systems design & cloud telemetry by Vasanth
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-slate-300 hidden md:inline">
                  Welcome back, <strong className="text-white">{user?.name}</strong>
                </span>
                <Link
                  to="/admin"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center"
                >
                  CMS Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-slate-300 hover:text-white inline-flex items-center space-x-1"
              >
                <Lock className="w-3 h-3 mr-1" />
                <span>Editorial Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Brand quad logo */}
              <div className="grid grid-cols-2 gap-0.5 w-8 h-8 p-0.5 rounded-md bg-slate-900 border border-slate-700 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                <div className="bg-rose-500 rounded-2xs"></div>
                <div className="bg-emerald-500 rounded-2xs"></div>
                <div className="bg-amber-400 rounded-2xs"></div>
                <div className="bg-blue-600 rounded-2xs"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-sans group-hover:text-blue-600 transition-colors">
                    VASANTH
                  </span>
                  <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Tech Blog
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' && location.search.includes(encodeURIComponent(link.label)));
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50/80 font-semibold'
                        : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Search + CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative w-60">
              <input
                type="text"
                placeholder="Search articles, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-slate-800 text-sm pl-9 pr-3 py-2 rounded-full border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            <Link
              to="/blog"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Compass className="w-4 h-4 mr-1.5 text-slate-500" />
              Explore Topics
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow hover:scale-102"
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              {isAuthenticated ? 'Admin CMS' : 'Editor Login'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative mt-1">
            <input
              type="text"
              placeholder="Search tech blog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 text-sm pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          </form>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700"
            >
              {isAuthenticated ? 'Go to Admin CMS' : 'Editor CMS Login'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
