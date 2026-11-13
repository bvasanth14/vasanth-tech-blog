import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/blog/SEOHead';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillVasanthAdmin = () => {
    setEmail('vasanth@vasanthtech.com');
    setPassword('password123');
    setInfoMsg('Filled Vasanth credentials! Click "Sign In" below.');
    setErrorMsg('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@vasanthtech.com');
    setPassword('password123');
    setInfoMsg('Filled Admin credentials! Click "Sign In" below.');
    setErrorMsg('');
  };

  const fillDemoAuthor = () => {
    setEmail('alex.rivera@vasanthtech.com');
    setPassword('password123');
    setInfoMsg('Filled Author credentials! Click "Sign In" below.');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <SEOHead title="Editorial CMS Login | Vasanth Tech Blog" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-4 group">
          <div className="grid grid-cols-2 gap-0.5 w-8 h-8 p-0.5 rounded-sm bg-slate-800 border border-slate-700 group-hover:scale-105 transition-transform">
            <div className="bg-rose-500 rounded-2xs"></div>
            <div className="bg-emerald-500 rounded-2xs"></div>
            <div className="bg-amber-400 rounded-2xs"></div>
            <div className="bg-blue-600 rounded-2xs"></div>
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-sans">
            VASANTH <span className="text-blue-400 text-sm font-semibold uppercase ml-1">Editorial CMS</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Sign In to Vasanth Tech Suite
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Authorized editorial access for Vasanth and contributing authors
        </p>
      </div>

      {/* Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-200">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-blue-500" />
              <span>{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="vasanth@vasanthtech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
            >
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Editorial Suite'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons for reviewers */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5 text-center">
              1-Click Demo Login Fill
            </span>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={fillVasanthAdmin}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-center transition-colors border border-blue-200 flex items-center justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Fill Vasanth (Founder & Admin)
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-colors border border-slate-200"
                >
                  Admin Alias
                </button>
                <button
                  type="button"
                  onClick={fillDemoAuthor}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-colors border border-slate-200"
                >
                  Author (Alex)
                </button>
              </div>
            </div>
            <p className="text-2xs text-slate-400 text-center mt-2.5">
              Password: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">password123</code>
            </p>
          </div>
        </div>

        {/* Return to website */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
            ← Return to Vasanth Tech Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
