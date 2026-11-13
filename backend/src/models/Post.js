const mongoose = require('mongoose');
const slugify = require('slugify');
const calculateReadTime = require('../utils/calculateReadTime');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an article title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an article excerpt'],
      trim: true,
      maxlength: [400, 'Excerpt cannot exceed 400 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the article content'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify an author'],
      index: true,
    },
    categories: {
      type: [String],
      required: [true, 'Please specify at least one category'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one category is required',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
      index: true,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [120, 'SEO Title cannot exceed 120 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [250, 'Meta description cannot exceed 250 characters'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to calculate readTime, slugify, and fallback SEO meta
postSchema.pre('validate', async function () {
  // Generate slug if not present or title changed
  if (this.title && (!this.slug || this.isModified('title'))) {
    const baseSlug = slugify(this.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    let uniqueSlug = baseSlug;
    
    // Check uniqueness if slug is new or changed
    if (this.isNew || this.isModified('slug') || this.isModified('title')) {
      const existing = await this.constructor.findOne({
        slug: uniqueSlug,
        _id: { $ne: this._id },
      });
      if (existing) {
        uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }
    }
    this.slug = uniqueSlug;
  }

  // Calculate readTime based on content
  if (this.content) {
    this.readTime = calculateReadTime(this.content);
  }

  // Fallback for SEO fields
  if (!this.seoTitle && this.title) {
    this.seoTitle = this.title;
  }
  if (!this.metaDescription && this.excerpt) {
    this.metaDescription = this.excerpt;
  }
});

module.exports = mongoose.model('Post', postSchema);
