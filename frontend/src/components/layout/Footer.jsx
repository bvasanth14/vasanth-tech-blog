import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, GithubIcon } from '../ui/Icons';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const categories = [
    { name: 'Software Development', path: '/blog?category=Software%20Development' },
    { name: 'Artificial Intelligence & Machine Learning', path: '/blog?category=Artificial%20Intelligence%20%26%20Machine%20Learning' },
    { name: 'Cloud Computing', path: '/blog?category=Cloud%20Computing' },
    { name: 'Cybersecurity', path: '/blog?category=Cybersecurity' },
    { name: 'Web & Mobile Development', path: '/blog?category=Web%20and%20Mobile%20App%20Development' },
    { name: 'Technology & Innovation', path: '/blog?category=Technology%20%26%20Innovation' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-20">
      {/* Top Newsletter Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="text-xs uppercase font-bold tracking-widest text-blue-400">
                Weekly Engineering Digest by Vasanth
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                Stay at the forefront of enterprise technology.
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Curated architectural breakdowns, systems design papers, and enterprise engineering practices delivered every Thursday.
              </p>
            </div>

            <div className="mt-6 lg:mt-0 lg:ml-8">
              {subscribed ? (
                <div className="inline-flex items-center px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm font-medium animate-bounce">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" />
                  Thank you! You have been subscribed to Vasanth Tech Blog.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shrink-0 cursor-pointer hover:scale-102"
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6 p-0.5 rounded-sm bg-slate-900 border border-slate-700 group-hover:scale-105 transition-transform">
                <div className="bg-rose-500 rounded-2xs"></div>
                <div className="bg-emerald-500 rounded-2xs"></div>
                <div className="bg-amber-400 rounded-2xs"></div>
                <div className="bg-blue-600 rounded-2xs"></div>
              </div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                VASANTH <span className="text-blue-400 font-medium text-sm ml-1 uppercase">Tech Blog</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 pr-6">
              Engineering, architecting, and operating scalable digital platforms. Inspiring developers, CIOs, and technology teams worldwide with honest, real-world distributed systems insights.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Core Disciplines
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={cat.path}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Resources & Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="hover:text-blue-400 transition-colors">
                  All Articles Index
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-400 transition-colors">
                  Editorial CMS Portal
                </Link>
              </li>
              <li>
                <Link to="/blog?category=Cloud%20Computing" className="hover:text-blue-400 transition-colors">
                  Architecture Blueprints
                </Link>
              </li>
              <li>
                <Link to="/blog?category=Cybersecurity" className="hover:text-blue-400 transition-colors">
                  Security & Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Editorial Desk
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin/login" className="hover:text-blue-400 transition-colors">
                  Author Sign In
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Editor-in-Chief: Vasanth</span>
              </li>
              <li>
                <span className="text-slate-500 text-xs">MERN Distributed Stack</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Vasanth Tech Blog. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Engineered by Vasanth • Enterprise MERN Architecture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
