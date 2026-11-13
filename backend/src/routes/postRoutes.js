const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getFeaturedHero,
  getTrendingPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Specialized public feeds (must precede parameter routes)
router.get('/featured/hero', getFeaturedHero);
router.get('/trending/top', getTrendingPosts);

// Root collection endpoints
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

// CMS management by ID
router.route('/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Single post retrieval by slug or ID
router.get('/:slug', getPostBySlug);

module.exports = router;
