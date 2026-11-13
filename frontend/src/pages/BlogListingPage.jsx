import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, BookOpen, X, RefreshCw } from 'lucide-react';
import { postsApi, categoriesApi } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PostCard from '../components/blog/PostCard';
import Pagination from '../components/ui/Pagination';
import SEOHead from '../components/blog/SEOHead';

export const BlogListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'latest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // State
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParam);

  // Fetch categories on mount
  useEffect(() => {
    categoriesApi
      .getAll()
      .then((res) => {
        if (res.data?.success) setCategories(res.data.categories || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch posts whenever query params change
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: pageParam,
          limit: 9,
          sort: sortParam,
          category: categoryParam !== 'All' ? categoryParam : undefined,
          search: searchParam || undefined,
        };

        const res = await postsApi.getAll(params);
        if (res.data?.success) {
          setPosts(res.data.posts || []);
          setTotalPages(res.data.pages || 1);
          setTotalCount(res.data.total || 0);
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [categoryParam, searchParam, sortParam, pageParam]);

  // Keep local search input synced with url param
  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  // Handlers to update URL search params
  const updateQuery = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || (key === 'category' && value === 'All')) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    // Reset to page 1 on filter or search changes
    if (!updates.page && (updates.category !== undefined || updates.search !== undefined || updates.sort !== undefined)) {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery({ search: searchTerm.trim() });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans">
      <SEOHead
        title={
          categoryParam !== 'All'
            ? `${categoryParam} Articles | Vasanth Tech Blog`
            : 'All Technology Articles | Vasanth Tech Blog'
        }
        description="Comprehensive repository of engineering insights, software architecture paradigms, AI research, and cloud infrastructure guides authored by Vasanth."
      />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-1">
            Engineering Archives
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {categoryParam !== 'All' ? categoryParam : 'All Technical Articles'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
            In-depth engineering documentation, architecture benchmarks, and systems analysis authored by technical leaders.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search across articles, topics, or code snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    updateQuery({ search: '' });
                  }}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Sort & Quick Select */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-xs font-semibold text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortParam}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="readTime">Longest Read</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Filter:
            </span>
            <button
              onClick={() => updateQuery({ category: 'All' })}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryParam === 'All'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
              }`}
            >
              All Topics ({totalCount})
            </button>
            {categories.map((cat) => {
              const name = typeof cat === 'string' ? cat : cat.name;
              const isSelected = categoryParam === name;
              return (
                <button
                  key={name}
                  onClick={() => updateQuery({ category: name })}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{posts.length}</strong> of{' '}
            <strong className="text-slate-800">{totalCount}</strong> published articles
            {searchParam && (
              <span>
                {' '}
                for <span className="text-blue-600 font-semibold">"{searchParam}"</span>
              </span>
            )}
          </div>

          {(categoryParam !== 'All' || searchParam) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center text-blue-600 hover:underline font-semibold"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reset all filters
            </button>
          )}
        </div>

        {/* Articles Grid */}
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
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id || post.slug} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={pageParam}
              totalPages={totalPages}
              onPageChange={(page) => updateQuery({ page })}
            />
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 my-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching articles found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your keyword search or category filter.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogListingPage;
