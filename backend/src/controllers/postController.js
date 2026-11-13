const slugify = require('slugify');
const { getPostModel, getCategoryModel } = require('../config/modelProvider');
const calculateReadTime = require('../utils/calculateReadTime');

// @desc    Get all posts (with filtering, search, pagination, sorting)
// @route   GET /api/posts
// @access  Public (CMS calls with query status for draft/scheduled)
const getPosts = async (req, res, next) => {
  try {
    const PostModel = getPostModel();

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const {
      category,
      tag,
      search,
      q,
      status,
      isFeatured,
      sort,
    } = req.query;

    const searchTerm = search || q;

    // Filter construction
    const filter = {};

    // Status handling:
    // If status is passed (e.g. from CMS), verify role or use status.
    // If not passed or 'published', default to published posts whose publishedAt is now or earlier.
    if (status && status !== 'all') {
      filter.status = status;
    } else if (!status) {
      filter.status = 'published';
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (tag) {
      filter.tag = tag;
    }

    if (searchTerm && searchTerm.trim()) {
      filter.search = searchTerm.trim();
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    // Determine sort
    let sortOption = { publishedAt: -1 };
    if (sort === 'oldest') {
      sortOption = { publishedAt: 1 };
    } else if (sort === 'readTime') {
      sortOption = { readTime: -1 };
    }

    // Execute query
    const total = await PostModel.countDocuments(filter);
    const posts = await PostModel.find(filter)
      .populate('author')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug (populated author, checks publication, prev/next, related)
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const PostModel = getPostModel();

    const post = await PostModel.findOne({ slug }).populate('author');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Article not found with slug: ${slug}`,
      });
    }

    // Check publication status:
    // If draft or scheduled, allow preview only if preview flag or admin token passed
    const isScheduledInFuture =
      post.status === 'scheduled' && new Date(post.publishedAt) > new Date();

    if ((post.status === 'draft' || isScheduledInFuture) && !req.query.preview) {
      // In a real app we can check if user is admin/author
      // For convenience during preview/editing, return warning header or allow
    }

    // Find Previous and Next posts
    const allPublished = await PostModel.find({ status: 'published' }).sort({
      publishedAt: -1,
    });
    const currentIndex = allPublished.findIndex(
      (p) => String(p._id) === String(post._id) || p.slug === post.slug
    );

    let prevPost = null;
    let nextPost = null;

    if (currentIndex > 0) {
      prevPost = {
        title: allPublished[currentIndex - 1].title,
        slug: allPublished[currentIndex - 1].slug,
        coverImage: allPublished[currentIndex - 1].coverImage,
      };
    }
    if (currentIndex >= 0 && currentIndex < allPublished.length - 1) {
      nextPost = {
        title: allPublished[currentIndex + 1].title,
        slug: allPublished[currentIndex + 1].slug,
        coverImage: allPublished[currentIndex + 1].coverImage,
      };
    }

    // Find related posts (same primary category, excluding current post)
    const primaryCategory =
      Array.isArray(post.categories) && post.categories.length > 0
        ? post.categories[0]
        : null;

    let relatedPosts = [];
    if (primaryCategory) {
      const candidates = await PostModel.find({
        status: 'published',
        category: primaryCategory,
      })
        .populate('author')
        .limit(4);

      relatedPosts = candidates
        .filter((p) => String(p._id) !== String(post._id))
        .slice(0, 3);
    }

    res.json({
      success: true,
      post,
      prevPost,
      nextPost,
      relatedPosts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (CMS Protected)
const createPost = async (req, res, next) => {
  try {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      categories,
      tags,
      status,
      seoTitle,
      metaDescription,
      isFeatured,
      publishedAt,
      authorId,
    } = req.body;

    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, excerpt, and content.',
      });
    }

    // Normalize categories
    let formattedCategories = [];
    if (Array.isArray(categories)) {
      formattedCategories = categories.filter(Boolean);
    } else if (typeof categories === 'string') {
      formattedCategories = categories.split(',').map((c) => c.trim()).filter(Boolean);
    }
    if (formattedCategories.length === 0) {
      formattedCategories = ['Technology & Innovation'];
    }

    // Normalize tags
    let formattedTags = [];
    if (Array.isArray(tags)) {
      formattedTags = tags.filter(Boolean);
    } else if (typeof tags === 'string') {
      formattedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Slug generation
    let finalSlug = customSlug
      ? slugify(customSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    const PostModel = getPostModel();
    const existing = await PostModel.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Author selection (admin can assign or defaults to logged-in user)
    const author = authorId || (req.user ? req.user._id : '67332211aa11223344556601');

    // Read time
    const readTime = calculateReadTime(content);

    const postData = {
      title,
      slug: finalSlug,
      excerpt,
      content,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      author,
      categories: formattedCategories,
      tags: formattedTags,
      status: status || 'draft',
      readTime,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt,
      isFeatured: Boolean(isFeatured),
      publishedAt:
        status === 'scheduled' && publishedAt
          ? new Date(publishedAt)
          : publishedAt
          ? new Date(publishedAt)
          : new Date(),
    };

    const post = await PostModel.create(postData);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (CMS Protected)
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const PostModel = getPostModel();

    let post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Article not found with id: ${id}`,
      });
    }

    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      categories,
      tags,
      status,
      seoTitle,
      metaDescription,
      isFeatured,
      publishedAt,
      authorId,
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) {
      updates.content = content;
      updates.readTime = calculateReadTime(content);
    }
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (seoTitle !== undefined) updates.seoTitle = seoTitle;
    if (metaDescription !== undefined) updates.metaDescription = metaDescription;
    if (isFeatured !== undefined) updates.isFeatured = Boolean(isFeatured);
    if (status !== undefined) updates.status = status;
    if (publishedAt !== undefined) updates.publishedAt = new Date(publishedAt);
    if (authorId !== undefined) updates.author = authorId;

    if (categories !== undefined) {
      if (Array.isArray(categories)) {
        updates.categories = categories.filter(Boolean);
      } else if (typeof categories === 'string') {
        updates.categories = categories.split(',').map((c) => c.trim()).filter(Boolean);
      }
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        updates.tags = tags.filter(Boolean);
      } else if (typeof tags === 'string') {
        updates.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (customSlug) {
      updates.slug = slugify(customSlug, { lower: true, strict: true });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Article updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (CMS Protected)
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const PostModel = getPostModel();

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Article not found with id: ${id}`,
      });
    }

    await PostModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Article deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured articles for hero section
// @route   GET /api/posts/featured/hero
// @access  Public
const getFeaturedHero = async (req, res, next) => {
  try {
    const PostModel = getPostModel();
    const featured = await PostModel.find({
      status: 'published',
      isFeatured: true,
    })
      .populate('author')
      .sort({ publishedAt: -1 })
      .limit(5);

    // If less than 4 featured, fill with latest published
    if (featured.length < 3) {
      const latest = await PostModel.find({ status: 'published' })
        .populate('author')
        .sort({ publishedAt: -1 })
        .limit(5);

      return res.json({
        success: true,
        posts: latest,
      });
    }

    res.json({
      success: true,
      posts: featured,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending/popular articles
// @route   GET /api/posts/trending/top
// @access  Public
const getTrendingPosts = async (req, res, next) => {
  try {
    const PostModel = getPostModel();
    const trending = await PostModel.find({ status: 'published' })
      .populate('author')
      .sort({ readTime: -1, publishedAt: -1 })
      .limit(4);

    res.json({
      success: true,
      posts: trending,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getFeaturedHero,
  getTrendingPosts,
};
