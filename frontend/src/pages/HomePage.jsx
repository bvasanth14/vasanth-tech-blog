import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Flame,
  Search,
  BookOpen,
  Filter,
  Cpu,
  ShieldCheck,
  Cloud,
  Code2,
  Terminal,
} from 'lucide-react';
import { postsApi, categoriesApi } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FeaturedHero from '../components/blog/FeaturedHero';
import CategoryNav from '../components/blog/CategoryNav';
import PostCard from '../components/blog/PostCard';
import SEOHead from '../components/blog/SEOHead';

export const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [heroRes, trendingRes, latestRes, catRes] = await Promise.all([
          postsApi.getFeaturedHero(),
          postsApi.getTrending(),
          postsApi.getAll({ limit: 6, sort: 'latest' }),
          categoriesApi.getAll(),
        ]);

        if (heroRes.data?.success) setFeaturedPosts(heroRes.data.posts || []);
        if (trendingRes.data?.success) setTrendingPosts(trendingRes.data.posts || []);
        if (latestRes.data?.success) setLatestPosts(latestRes.data.posts || []);
        if (catRes.data?.success) setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Failed to load homepage feeds:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter latest posts if category clicked
  const handleSelectCategory = async (cat) => {
    setActiveCategory(cat);
    try {
      const res = await postsApi.getAll({
        category: cat === 'All' ? undefined : cat,
        limit: 6,
      });
      if (res.data?.success) {
        setLatestPosts(res.data.posts || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans">
      <SEOHead
        title="Vasanth Tech Blog | Enterprise Engineering, Cloud & Software Architecture"
        description="Explore enterprise software engineering, cloud architecture, generative AI, cybersecurity, and distributed systems authored by Vasanth."
      />

      <Navbar />

      <main className="flex-1">
        {/* Featured Hero Section */}
        {featuredPosts.length > 0 && (
          <FeaturedHero
            featuredPosts={featuredPosts}
            trendingPosts={trendingPosts}
          />
        )}

        {/* Category Sticky Nav */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Latest Articles Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-1">
                Latest Dispatches
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeCategory === 'All' ? 'Recent Engineering Insights' : `${activeCategory}`}
              </h2>
            </div>

            <Link
              to={`/blog${activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : ''}`}
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 group"
            >
              Browse all {activeCategory !== 'All' ? activeCategory : ''} articles
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl h-80 border border-slate-200 animate-pulse p-4 space-y-4"
                >
                  <div className="h-44 bg-slate-200 rounded-lg"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-200 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <PostCard key={post._id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">
                No articles found in this category
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Check back shortly or explore other categories.
              </p>
              <button
                onClick={() => handleSelectCategory('All')}
                className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* Enterprise Highlights / Core Pillars Banner with Animated Visual Elements */}
        <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
          {/* Animated decorative grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs uppercase font-bold tracking-widest text-blue-400 inline-flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-400 animate-spin" />
                Vasanth Tech Architecture Blueprints
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
                How We Engineer For Millions of Workloads
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
                From self-healing container meshes to privacy-first AI runtimes, discover the foundations of modern cloud platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group bg-slate-800/80 rounded-2xl p-7 border border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 card-hover-fx relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  Zero Trust Attestation
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Eliminating perimeter assumptions with SPIFFE/SPIRE workload identity and hardware-backed cryptographic verification.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Architecture Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-slate-800/80 rounded-2xl p-7 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 card-hover-fx relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Cloud className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  Cell-Based Geographic Topology
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Partitioning global state into isolated cellular zones to constrain blast radiuses and achieve sub-10ms localized latency.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Cell Mesh Patterns</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-slate-800/80 rounded-2xl p-7 border border-slate-700/80 hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300 card-hover-fx relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Sovereign Air-Gapped AI
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Hosting quantized open-weight LLMs with high-throughput vLLM engines to preserve enterprise data privacy without API egress.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Inference Blueprints</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
