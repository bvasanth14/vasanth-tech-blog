import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ChevronRight,
  User,
  BookOpen,
  ArrowLeft,
  Share2,
  Sparkles,
} from 'lucide-react';
import { postsApi } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TableOfContents from '../components/blog/TableOfContents';
import RichContentRenderer from '../components/blog/RichContentRenderer';
import ShareButtons from '../components/blog/ShareButtons';
import PrevNextPost from '../components/blog/PrevNextPost';
import RelatedPosts from '../components/blog/RelatedPosts';
import SEOHead from '../components/blog/SEOHead';
import { CategoryBadge } from '../components/ui/Badge';

export const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await postsApi.getBySlug(slug);
        if (res.data?.success) {
          setPost(res.data.post);
          setPrevPost(res.data.prevPost || null);
          setNextPost(res.data.nextPost || null);
          setRelatedPosts(res.data.relatedPosts || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Article could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded w-3/4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
          <p className="text-slate-500 mt-2 mb-6">
            The article you are looking for may have been retired or moved.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Articles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const primaryCategory =
    Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories[0]
      : 'Technology';

  const authorName = post.author?.name || 'Vasanth';
  const authorAvatar =
    post.author?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const authorBio =
    post.author?.bio ||
    'Founder, Principal Cloud Architect & Editorial Director at Vasanth Tech. 14+ years designing fault-tolerant distributed platforms and developer ecosystems.';

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans">
      {/* Dynamic SEO Meta + JSON-LD Schema */}
      <SEOHead
        title={`${post.seoTitle || post.title} | Vasanth Tech Blog`}
        description={post.metaDescription || post.excerpt}
        ogImage={post.coverImage}
        article={post}
      />

      <Navbar />

      <main className="flex-1">
        {/* Article Header Container */}
        <header className="bg-white border-b border-slate-200/90 pt-8 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Link to="/blog" className="hover:text-blue-600">Blog</Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Link
                to={`/blog?category=${encodeURIComponent(primaryCategory)}`}
                className="hover:text-blue-600 font-medium text-slate-700"
              >
                {primaryCategory}
              </Link>
            </nav>

            {/* Category Badge & Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <CategoryBadge category={primaryCategory} />
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="inline-flex items-center font-medium">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="inline-flex items-center font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {post.readTime || 5} min read
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
              {post.title}
            </h1>

            {/* Excerpt Subtitle */}
            <p className="text-lg sm:text-xl text-slate-650 leading-relaxed max-w-4xl font-normal">
              {post.excerpt}
            </p>

            {/* Author Profile Ribbon */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 ring-2 ring-blue-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {authorName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {post.author?.role === 'admin' ? 'Founder & Principal Cloud Architect' : 'Contributing Tech Author'}
                  </p>
                </div>
              </div>

              {/* Share buttons top */}
              <ShareButtons title={post.title} />
            </div>
          </div>
        </header>

        {/* Hero Cover Image with subtle animated lift on hover */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-16/9 sm:aspect-21/10 bg-slate-900 group">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

        {/* Two-Column Reading Layout */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Main Article Content Container (8 cols) */}
            <article className="lg:col-span-8 min-w-0">
              {/* Rich Content Renderer */}
              <RichContentRenderer content={post.content} />

              {/* Tag Pills */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="pt-8 mt-10 border-t border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                    Indexed Topics
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?search=${encodeURIComponent(tag)}`}
                        className="text-xs px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons Bottom */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  Found this article insightful? Share with your team:
                </span>
                <ShareButtons title={post.title} />
              </div>

              {/* Author Bio Box */}
              <div className="my-10 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30 shrink-0 ring-2 ring-blue-500/20"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-slate-900">{authorName}</h4>
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Author
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {authorBio}
                  </p>
                </div>
              </div>

              {/* Previous and Next Navigation */}
              <PrevNextPost prevPost={prevPost} nextPost={nextPost} />
            </article>

            {/* Right Sticky Column: Table of Contents & Quick CTA (4 cols) */}
            <aside className="lg:col-span-4 space-y-6 lg:pl-4">
              {/* Dynamic Table of Contents */}
              <TableOfContents contentHtml={post.content} />

              {/* Newsletter Callout */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold tracking-tight">
                  Vasanth Tech Letter
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join 45,000+ engineers receiving weekly deep-dives into distributed systems, AI architectures, and infrastructure benchmarks.
                </p>
                <Link
                  to="/#newsletter"
                  className="inline-flex items-center text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline pt-1"
                >
                  Join the newsletter →
                </Link>
              </div>
            </aside>
          </div>

          {/* Related Articles Grid */}
          <RelatedPosts posts={relatedPosts} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
