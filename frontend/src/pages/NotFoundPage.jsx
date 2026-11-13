import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEOHead from '../components/blog/SEOHead';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <SEOHead title="404 - Page Not Found | Vasanth Tech Blog" />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full py-16">
          <span className="text-6xl font-black text-blue-600 tracking-tight">404</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-2">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            The technical resource, article, or documentation page you were looking for doesn't exist or has moved to a new route.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
            <Link
              to="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
              Explore Articles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
