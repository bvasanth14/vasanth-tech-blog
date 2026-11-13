import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  LogOut,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = ({ children, activeTab = 'posts' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'posts', label: 'All Articles', icon: FileText, path: '/admin' },
    { id: 'new-post', label: 'Create New Article', icon: PlusCircle, path: '/admin/posts/new' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6 p-0.5 rounded-sm bg-slate-800 border border-slate-700 group-hover:scale-105 transition-transform">
              <div className="bg-rose-500 rounded-2xs"></div>
              <div className="bg-emerald-500 rounded-2xs"></div>
              <div className="bg-amber-400 rounded-2xs"></div>
              <div className="bg-blue-600 rounded-2xs"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white font-sans">
                VASANTH
              </span>
              <span className="text-2xs font-semibold text-blue-400 tracking-wider uppercase -mt-1">
                Editorial CMS
              </span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center space-x-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name || 'Vasanth'}
            className="w-10 h-10 rounded-full object-cover border border-slate-600 ring-2 ring-blue-500/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Vasanth'}</p>
            <span className="inline-flex items-center text-2xs font-medium text-emerald-400 capitalize">
              <Shield className="w-2.5 h-2.5 mr-1" />
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 mr-3 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              to="/"
              target="_blank"
              className="flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-3 shrink-0 text-slate-500" />
              <span>View Live Blog</span>
            </Link>
          </div>
        </nav>

        {/* Bottom logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vasanth Tech Editorial Suite
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-blue-600"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Open Site
            </Link>
          </div>
        </div>

        {/* Body Container */}
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
