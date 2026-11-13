import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  Edit3,
  Image as ImageIcon,
  Upload,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Clock,
  FileText,
  Check,
  AlertCircle,
  Hash,
  Globe,
  Lock,
  Unlock,
} from 'lucide-react';
import { postsApi, uploadApi } from '../../services/api';
import RichContentRenderer from '../blog/RichContentRenderer';

export const PostEditor = ({
  initialPost = null,
  categories = [],
  authors = [],
  onSaveSuccess,
  onCancel,
}) => {
  const isEditing = Boolean(initialPost && initialPost._id);

  // Form State
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(
    initialPost?.content ||
      `<h2>1. Introduction to the Paradigm</h2>\n<p class="lead">Briefly summarize the core architectural shift or industry breakthrough discussed in this article.</p>\n<p>Explain the historical context, current bottlenecks, and why existing approaches fail at scale.</p>\n\n<h2>2. Technical Architecture & Implementation</h2>\n<p>Detail the design patterns, frameworks, and low-latency considerations.</p>\n<pre><code>// Production-ready implementation example\nconst initializeCluster = async (config) => {\n  console.log('Cluster orchestrated with zero-trust credentials');\n};</code></pre>\n\n<h2>3. Key Takeaways & Enterprise Strategy</h2>\n<p>Summarize actionable insights and engineering recommendations for your team.</p>`
  );
  const [coverImage, setCoverImage] = useState(
    initialPost?.coverImage ||
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  );
  const [selectedCategories, setSelectedCategories] = useState(
    initialPost?.categories || ['Software Development']
  );
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(initialPost?.tags) ? initialPost.tags.join(', ') : 'Architecture, Enterprise'
  );
  const [status, setStatus] = useState(initialPost?.status || 'published');
  const [publishedAt, setPublishedAt] = useState(
    initialPost?.publishedAt
      ? new Date(initialPost.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [isFeatured, setIsFeatured] = useState(Boolean(initialPost?.isFeatured));
  const [authorId, setAuthorId] = useState(
    initialPost?.author?._id || initialPost?.author || (authors[0]?._id || '')
  );
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription || '');

  // UI state
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-slugify when title changes (if not manual)
  useEffect(() => {
    if (!isSlugManual && title) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(autoSlug);
    }
  }, [title, isSlugManual]);

  // Compute live word count and read time
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.length > 0 ? plainText.split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  // Category toggle
  const toggleCategory = (catName) => {
    if (selectedCategories.includes(catName)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catName));
      }
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  // Image file upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      setErrorMsg('');
      const res = await uploadApi.uploadImage(formData);
      if (res.data?.success) {
        setCoverImage(res.data.url);
      }
    } catch (err) {
      setErrorMsg('Failed to upload image. Please enter an image URL instead.');
    } finally {
      setIsUploading(false);
    }
  };

  // Insert formatting snippet into content
  const insertSnippet = (snippet) => {
    setContent((prev) => prev + '\n' + snippet);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setErrorMsg('Please fill in Title, Excerpt, and Content.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postPayload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      coverImage: coverImage.trim(),
      categories: selectedCategories,
      tags,
      status,
      publishedAt: status === 'scheduled' ? new Date(publishedAt) : new Date(publishedAt),
      isFeatured,
      authorId: authorId || undefined,
      seoTitle: seoTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
    };

    try {
      setIsSaving(true);
      let res;
      if (isEditing) {
        res = await postsApi.update(initialPost._id, postPayload);
      } else {
        res = await postsApi.create(postPayload);
      }

      if (res.data?.success) {
        setSuccessMsg(isEditing ? 'Article updated successfully!' : 'Article published successfully!');
        if (onSaveSuccess) {
          setTimeout(() => onSaveSuccess(res.data.post), 800);
        }
      }
    } catch (err) {
      // Network error or backend down — show helpful message
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;

      if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg(
          '⚠️ Cannot reach the backend server. Make sure the backend is running on port 5000 (run: npm run dev). ' +
          'Your article data is preserved — restart the server and try again.'
        );
      } else if (status === 401) {
        setErrorMsg(
          '🔒 Session expired or not authorized. Please log out and log in again, then retry.'
        );
      } else {
        setErrorMsg(serverMsg || err.message || 'Failed to save article. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {isEditing ? 'Edit Article' : 'Compose New Article'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise content management • Clean typography & SEO preview
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-650 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : isEditing ? 'Update Article' : 'Publish / Save'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center">
          <Check className="w-5 h-5 mr-2 shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: 8 cols Editor, 4 cols Metadata/SEO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Core Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Architecting Resilient Multi-Region Microservices"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg sm:text-xl font-bold px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>

            {/* URL Slug with Lock/Unlock */}
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-mono text-slate-400">/blog/</span>
              <input
                type="text"
                disabled={!isSlugManual}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`font-mono text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none flex-1 ${
                  !isSlugManual ? 'cursor-not-allowed opacity-80' : 'border-slate-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setIsSlugManual(!isSlugManual)}
                className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
                title={isSlugManual ? 'Click to auto-generate from title' : 'Click to manually edit slug'}
              >
                {isSlugManual ? <Unlock className="w-3.5 h-3.5 text-blue-600" /> : <Lock className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Executive Summary / Excerpt *
              </label>
              <textarea
                required
                rows={3}
                placeholder="A compelling 2-3 sentence overview highlighting business impact and technical takeaways..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Editor Top Bar with Tabs and Snippet Helpers */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    activeTab === 'editor'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>

              {/* Formatting Helper Buttons */}
              {activeTab === 'editor' && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertSnippet('<h2>Heading Title</h2>')}
                    className="px-2 py-1 rounded text-2xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    title="Insert H2 (TOC Section)"
                  >
                    + H2 (TOC)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('<h3>Sub-section Title</h3>')}
                    className="px-2 py-1 rounded text-2xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    + H3
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        '<pre><code>// Sample Code Snippet\nconst serviceMesh = new MeshRouter({\n  retries: 3,\n  backoff: 250\n});</code></pre>'
                      )
                    }
                    className="px-2 py-1 rounded text-2xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-mono"
                  >
                    + Code
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet('<blockquote>"Quote or architectural thesis statement."</blockquote>')
                    }
                    className="px-2 py-1 rounded text-2xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    + Quote
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        '<table>\n<thead>\n<tr><th>Feature</th><th>Approach A</th><th>Approach B</th></tr>\n</thead>\n<tbody>\n<tr><td>Latency</td><td>Low</td><td>Medium</td></tr>\n</tbody>\n</table>'
                      )
                    }
                    className="px-2 py-1 rounded text-2xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    + Table
                  </button>
                </div>
              )}

              {/* Word Count & Read Time indicator */}
              <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {wordCount} words
                </span>
                <span>•</span>
                <span className="inline-flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {estimatedReadTime} min read
                </span>
              </div>
            </div>

            {/* Editor Area or Live Preview */}
            <div className="p-4">
              {activeTab === 'editor' ? (
                <textarea
                  required
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Compose article content with rich HTML tags (h2, p, pre/code, blockquote, table, img)..."
                  className="w-full font-mono text-sm leading-relaxed p-4 bg-slate-900 text-slate-100 rounded-lg focus:outline-none border border-slate-800 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-slate-100 min-h-[400px]">
                  <RichContentRenderer content={content} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Metadata, SEO & Publishing Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Controls */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
              Publishing Options
            </h3>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-650 mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="published">Published (Live to public)</option>
                <option value="draft">Draft (Internal review)</option>
                <option value="scheduled">Scheduled (Future release)</option>
              </select>
            </div>

            {/* Scheduled Date Picker */}
            {status === 'scheduled' && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-2">
                <label className="block text-xs font-semibold text-indigo-900 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Scheduled Release Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Featured Article Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-slate-800 block">
                  Featured Story
                </label>
                <span className="text-2xs text-slate-500">
                  Highlight in Homepage Hero banner
                </span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            {/* Author */}
            {authors.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-650 mb-1.5">
                  Author
                </label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {authors.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
              Cover Image
            </h3>

            {coverImage && (
              <div className="aspect-16/9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-600 mb-1">Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <label className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border border-slate-200">
                <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                {isUploading ? 'Uploading...' : 'Upload Local Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Categories & Tags
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-650 mb-2">
                Select Categories (At least one)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const name = typeof cat === 'string' ? cat : cat.name;
                  const isSelected = selectedCategories.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleCategory(name)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-650 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="Cloud, Microservices, Kubernetes"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SEO & SERP Preview */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <Globe className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
              SEO & Google Search Snippet
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-600 font-medium">Custom SEO Title</label>
                <span className="text-2xs text-slate-400">
                  {(seoTitle || title).length}/60 chars
                </span>
              </div>
              <input
                type="text"
                placeholder="Defaults to article title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-600 font-medium">Meta Description</label>
                <span className="text-2xs text-slate-400">
                  {(metaDescription || excerpt).length}/160 chars
                </span>
              </div>
              <textarea
                rows={2}
                placeholder="Defaults to excerpt"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Google SERP Simulated Card */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-2xs font-semibold uppercase text-slate-400 block mb-1">
                Google Search Result Preview
              </span>
              <p className="text-2xs text-slate-500 truncate">
                https://vasanthtech.com/blog/{slug || 'article-slug'}
              </p>
              <h4 className="text-xs font-medium text-blue-700 hover:underline truncate cursor-pointer leading-tight">
                {seoTitle || title || 'Article Title - Vasanth Tech Blog'}
              </h4>
              <p className="text-2xs text-slate-600 line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || 'Enter meta description to preview how your article appears on search engines.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostEditor;
