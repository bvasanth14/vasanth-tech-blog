const { getCategoryModel, getPostModel } = require('../config/modelProvider');
const slugify = require('slugify');

// @desc    Get all categories with article counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const CategoryModel = getCategoryModel();
    const PostModel = getPostModel();

    const categories = await CategoryModel.find();
    const allPosts = await PostModel.find({ status: 'published' });

    // Calculate article counts per category
    const categoriesWithCount = categories.map((cat) => {
      const catObj = cat.toObject ? cat.toObject() : { ...cat };
      const count = allPosts.filter(
        (p) =>
          Array.isArray(p.categories) &&
          p.categories.some(
            (c) =>
              c.toLowerCase() === cat.name.toLowerCase() ||
              slugify(c, { lower: true }) === cat.slug
          )
      ).length;
      return {
        ...catObj,
        count,
      };
    });

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, accentColor } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const CategoryModel = getCategoryModel();
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await CategoryModel.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await CategoryModel.create({
      name,
      slug,
      description: description || '',
      accentColor: accentColor || '#2563eb',
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
};
