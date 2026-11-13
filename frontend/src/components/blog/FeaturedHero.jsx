import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Flame, Sparkles, ArrowRight, Activity, Zap, CheckCircle } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';

export const FeaturedHero = ({ featuredPosts = [], trendingPosts = [] }) => {
  const mainLead = featuredPosts[0] || null;
  const secondaryStories =
    trendingPosts.length > 0 ? trendingPosts.slice(0, 3) : featuredPosts.slice(1, 4);

  if (!mainLead) return null;

  const leadCategory =
    Array.isArray(mainLead.categories) && mainLead.categories.length > 0
      ? mainLead.categories[0]
      : 'Technology';

  const leadAuthor = mainLead.author?.name || 'Vasanth';
  const leadAvatar =
    mainLead.author?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const leadDate = mainLead.publishedAt
    ? new Date(mainLead.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      {/* Subtle ambient animated glow behind hero */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full filter blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-24 right-1/3 w-80 h-80 bg-purple-400/10 rounded-full filter blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Col: Primary Featured Hero Card (8 cols) */}
        <div className="lg:col-span-8 flex">
          <div className="relative group w-full bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            {/* Lead Image with interactive zoom & overlay */}
            <Link
              to={`/blog/${mainLead.slug}`}
              className="relative aspect-16/9 sm:aspect-21/10 overflow-hidden bg-slate-900 block"
            >
              <img
                src={mainLead.coverImage}
                alt={mainLead.title}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity"></div>

              {/* Floating Featured Badge */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                  <span className="w-2 h-2 mr-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  Featured Story
                </span>
                <CategoryBadge category={leadCategory} className="bg-white/95 text-slate-900 border-white shadow-xs" />
              </div>

              {/* Animated Floating Telemetry Micro-Widget */}
              <div className="absolute bottom-4 right-4 hidden sm:flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-white text-2xs font-mono animate-float shadow-lg">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>P99: 12ms</span>
                <span className="text-slate-500">•</span>
                <span className="text-blue-400">99.999% SLA</span>
              </div>
            </Link>

            {/* Lead Details */}
            <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mb-3">
                  <span className="inline-flex items-center font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {leadDate}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {mainLead.readTime || 6} min read
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight mb-3">
                  <Link to={`/blog/${mainLead.slug}`}>
                    {mainLead.title}
                  </Link>
                </h1>

                <p className="text-slate-650 text-base leading-relaxed line-clamp-2 sm:line-clamp-3 mb-6">
                  {mainLead.excerpt}
                </p>
              </div>

              {/* Author & Action */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={leadAvatar}
                    alt={leadAuthor}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/40 shadow-xs group-hover:ring-2 group-hover:ring-blue-400 transition-all"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {leadAuthor}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Founder & Cloud Architect
                    </span>
                  </div>
                </div>

                <Link
                  to={`/blog/${mainLead.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 hover:text-white hover:bg-blue-600 transition-all border border-blue-200 shadow-2xs hover:shadow"
                >
                  Read Full Story
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Trending / Editor's Pick (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider inline-flex items-center">
              <Flame className="w-4 h-4 text-orange-500 mr-1.5 animate-bounce" />
              Trending Dispatch
            </h2>
            <Link to="/blog" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          <div className="flex flex-col space-y-4 flex-1">
            {secondaryStories.map((post, idx) => {
              const cat =
                Array.isArray(post.categories) && post.categories.length > 0
                  ? post.categories[0]
                  : 'Tech';

              return (
                <article
                  key={post._id || post.slug}
                  className="group p-4 bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 card-hover-fx flex flex-col justify-between flex-1 relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center border border-blue-200">
                          0{idx + 1}
                        </span>
                        <CategoryBadge category={cat} />
                      </div>
                      <span className="text-2xs font-mono text-slate-400">
                        {post.readTime || 4} min read
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                    <span className="font-medium">{post.author?.name || 'Vasanth'}</span>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                      Read <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHero;
