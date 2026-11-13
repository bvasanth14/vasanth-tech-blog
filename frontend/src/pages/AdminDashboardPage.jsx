import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsApi, categoriesApi, authApi } from '../services/api';
import AdminLayout from '../components/admin/AdminLayout';
import PostEditor from '../components/admin/PostEditor';
import { StatusBadge, CategoryBadge } from '../components/ui/Badge';
import SEOHead from '../components/blog/SEOHead';

export const AdminDashboardPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  // CMS Views: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState('list');
  const [editingPost, setEditingPost] = useState(null);

  // Data
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null); // null=checking, true, false

  // Check backend health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    checkHealth();
  }, []);

  // Check auth
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // Default categories used when backend is unreachable
  const DEFAULT_CATEGORIES = [
    'Software Development',
    'Artificial Intelligence & Machine Learning',
    'Web and Mobile App Development',
    'Technology & Innovation',
    'Cybersecurity',
    'Cloud Computing',
    'Industry Insights',
  ];

  // Load posts, categories, authors — gracefully handle backend being down
  const loadCmsData = async () => {
    try {
      setIsLoading(true);

      const results = await Promise.allSettled([
        postsApi.getAll({ status: 'all', limit: 50 }),
        categoriesApi.getAll(),
        authApi.getAuthors(),
      ]);

      const [postsRes, catRes, authRes] = results;

      if (postsRes.status === 'fulfilled' && postsRes.value.data?.success) {
        setPosts(postsRes.value.data.posts || []);
      } else {
        console.warn('Posts API unavailable, using empty list.');
        setPosts([]);
      }

      if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
        setCategories(catRes.value.data.categories || DEFAULT_CATEGORIES);
      } else {
        // Use default categories so the editor still works offline
        setCategories(DEFAULT_CATEGORIES);
      }

      if (authRes.status === 'fulfilled' && authRes.value.data?.success) {
        setAuthors(authRes.value.data.authors || []);
      } else {
        // Provide fallback author so editor author selector has a value
        setAuthors([{ _id: '67332211aa11223344556601', name: 'Vasanth', role: 'admin' }]);
      }
    } catch (err) {
      console.error('Failed to load CMS data:', err);
      setCategories(DEFAULT_CATEGORIES);
      setAuthors([{ _id: '67332211aa11223344556601', name: 'Vasanth', role: 'admin' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCmsData();
    }
  }, [isAuthenticated]);

  // Compute metrics
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  // Filtered post list
  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' ||
      (Array.isArray(post.categories) && post.categories.includes(categoryFilter));
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Handlers
  const handleStartCreate = () => {
    setEditingPost(null);
    setViewMode('create');
  };

  const handleStartEdit = (post) => {
    setEditingPost(post);
    setViewMode('edit');
  };

  const handleEditorSaved = () => {
    setViewMode('list');
    setEditingPost(null);
    loadCmsData();
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      await postsApi.delete(postToDelete._id);
      setPostToDelete(null);
      loadCmsData();
    } catch (err) {
      alert('Failed to delete article: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading CMS session...
      </div>
    );
  }

  return (
    <AdminLayout activeTab={viewMode === 'list' ? 'posts' : 'new-post'}>
      <SEOHead title="CMS Dashboard | Vasanth Tech Blog" />

      {/* Backend status banner */}
      {backendOnline === false && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Backend server is not running (502 Bad Gateway)</strong>
            <span>Start it with: </span>
            <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">cd tech-blog-mern && npm run dev</code>
            <span className="ml-2">then refresh this page. Posts cannot be published without the backend.</span>
          </div>
        </div>
      )}

      {/* When in Editor Mode */}
      {viewMode === 'create' || viewMode === 'edit' ? (
        <PostEditor
          initialPost={editingPost}
          categories={categories}
          authors={authors}
          onSaveSuccess={handleEditorSaved}
          onCancel={() => {
            setViewMode('list');
            setEditingPost(null);
          }}
        />
      ) : (
        /* When in List / Dashboard Mode */
        <div className="space-y-8">
          {/* Top Title & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Vasanth Editorial Control Room
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage articles, author assignments, and release scheduling for Vasanth Tech Blog
              </p>
            </div>

            <button
              onClick={handleStartCreate}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Compose New Article
            </button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Total Articles
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-slate-900">{totalCount}</span>
                <span className="text-xs text-slate-400">indexed</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Published
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-600">{publishedCount}</span>
                <span className="text-xs text-slate-400">live</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                Drafts
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-amber-600">{draftCount}</span>
                <span className="text-xs text-slate-400">in review</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block mb-1">
                Scheduled
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-indigo-600">{scheduledCount}</span>
                <span className="text-xs text-slate-400">queued</span>
              </div>
            </div>
          </div>

          {/* Table Container with Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Status Tabs */}
              <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: `All (${totalCount})` },
                  { id: 'published', label: `Published (${publishedCount})` },
                  { id: 'draft', label: `Drafts (${draftCount})` },
                  { id: 'scheduled', label: `Scheduled (${scheduledCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      statusFilter === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Category select */}
              <div className="flex items-center space-x-3">
                <div className="relative w-48 sm:w-60">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Topics</option>
                  {categories.map((cat) => {
                    const name = typeof cat === 'string' ? cat : cat.name;
                    return (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-2xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Publish Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        Loading articles...
                      </td>
                    </tr>
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => {
                      const primaryCat =
                        Array.isArray(post.categories) && post.categories.length > 0
                          ? post.categories[0]
                          : 'Technology';
                      const authorName = post.author?.name || 'Vasanth Tech Team';

                      return (
                        <tr
                          key={post._id}
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Article Title & Thumbnail */}
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-center space-x-3">
                              <img
                                src={post.coverImage}
                                alt=""
                                className="w-12 h-9 rounded object-cover border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1 leading-snug">
                                  {post.title}
                                </h4>
                                <span className="font-mono text-2xs text-slate-400 block truncate">
                                  /blog/{post.slug}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <CategoryBadge category={primaryCat} />
                          </td>

                          {/* Author */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                            {authorName}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <StatusBadge status={post.status} />
                          </td>

                          {/* Publish Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Draft'}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 inline-flex transition-colors"
                              title="View Article Live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleStartEdit(post)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 inline-flex transition-colors"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setPostToDelete(post)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 inline-flex transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500">
                        No articles match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Delete Article?
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Are you sure you want to delete{' '}
                <strong className="text-slate-900">"{postToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePost}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
