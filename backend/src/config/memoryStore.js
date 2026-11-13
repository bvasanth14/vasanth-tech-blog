const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const calculateReadTime = require('../utils/calculateReadTime');
const { initialCategories, initialUsers, initialPosts } = require('./initialData');

// Local database file path
const dataDir = path.join(__dirname, '../../data');
const dbFilePath = path.join(dataDir, 'local-db.json');

// In-memory collections
let categories = [];
let users = [];
let posts = [];

function saveToDisk() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const payload = {
      categories,
      users,
      posts,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[MemoryStore Persistence Warning]', err.message);
  }
}

function initMemoryStore() {
  if (fs.existsSync(dbFilePath)) {
    try {
      const raw = fs.readFileSync(dbFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.categories) && Array.isArray(parsed.users) && Array.isArray(parsed.posts)) {
        categories = parsed.categories;
        users = parsed.users;
        posts = parsed.posts;
        console.log(`[MemoryStore] Successfully restored from local JSON storage: ${categories.length} categories, ${users.length} users, and ${posts.length} articles.`);
        return;
      }
    } catch (e) {
      console.warn('[MemoryStore] Notice: initialising fresh persistent storage.');
    }
  }

  // Initialize categories
  categories = JSON.parse(JSON.stringify(initialCategories));

  // Initialize users with pre-hashed passwords
  const salt = bcrypt.genSaltSync(10);
  users = initialUsers.map((u) => ({
    ...u,
    password: bcrypt.hashSync(u.password, salt),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Initialize posts
  posts = initialPosts.map((p) => ({
    ...p,
    publishedAt: new Date(p.publishedAt),
    createdAt: new Date(p.publishedAt),
    updatedAt: new Date(),
  }));

  saveToDisk();
  console.log(`[MemoryStore] Initialized with ${categories.length} categories, ${users.length} users, and ${posts.length} published articles.`);
}

// Memory Store API matching Mongoose patterns
const MemoryStore = {
  init: initMemoryStore,

  // Categories
  categories: {
    find: async () => [...categories],
    findOne: async (query) => {
      if (query.slug) return categories.find((c) => c.slug === query.slug);
      if (query.name) return categories.find((c) => c.name.toLowerCase() === query.name.toLowerCase());
      return null;
    },
    countDocuments: async () => categories.length,
    create: async (data) => {
      const item = {
        _id: 'cat_' + Date.now(),
        ...data,
        slug: data.slug || slugify(data.name, { lower: true, strict: true }),
        createdAt: new Date(),
      };
      categories.push(item);
      saveToDisk();
      return item;
    },
  },

  // Users
  users: {
    find: async () => users.map((u) => ({ ...u, password: undefined })),
    findOne: async (query) => {
      let user = null;
      if (query.email && typeof query.email === 'string') {
        const term = query.email.toLowerCase();
        user = users.find((u) => u.email.toLowerCase() === term);
      } else if (query._id) {
        user = users.find((u) => String(u._id) === String(query._id));
      } else if (query.$or && Array.isArray(query.$or)) {
        for (const condition of query.$or) {
          if (condition.email && typeof condition.email === 'string') {
            user = users.find((u) => u.email.toLowerCase() === condition.email.toLowerCase());
            if (user) break;
          }
        }
      }
      if (!user) return null;
      return {
        ...user,
        matchPassword: async function (entered) {
          return await bcrypt.compare(entered, user.password);
        },
      };
    },
    findById: async (id) => {
      const user = users.find((u) => String(u._id) === String(id));
      if (!user) return null;
      return {
        ...user,
        password: undefined,
        matchPassword: async function (entered) {
          return await bcrypt.compare(entered, user.password);
        },
      };
    },
    create: async (data) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const newUser = {
        _id: 'usr_' + Date.now(),
        ...data,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      saveToDisk();
      return { ...newUser, password: undefined };
    },
  },

  // Posts
  posts: {
    find: (filter = {}) => {
      let filtered = [...posts];

      // Public status check: published only, and publishedAt <= now
      if (filter.status === 'published') {
        const now = new Date();
        filtered = filtered.filter(
          (p) => p.status === 'published' && new Date(p.publishedAt) <= now
        );
      } else if (filter.status && filter.status !== 'all') {
        filtered = filtered.filter((p) => p.status === filter.status);
      }

      // Featured filter
      if (typeof filter.isFeatured === 'boolean') {
        filtered = filtered.filter((p) => p.isFeatured === filter.isFeatured);
      }

      // Category filter (array or string)
      if (filter.category) {
        const catTerm = filter.category.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            Array.isArray(p.categories) &&
            p.categories.some((c) => c.toLowerCase() === catTerm || slugify(c, { lower: true }) === catTerm)
        );
      }

      // Tag filter
      if (filter.tag) {
        const tagTerm = filter.tag.toLowerCase();
        filtered = filtered.filter(
          (p) => Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase() === tagTerm)
        );
      }

      // Keyword search
      if (filter.search) {
        const term = filter.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.title && p.title.toLowerCase().includes(term)) ||
            (p.excerpt && p.excerpt.toLowerCase().includes(term)) ||
            (p.content && p.content.toLowerCase().includes(term)) ||
            (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase() === term))
        );
      }

      // Chainable helper simulation
      const chain = {
        data: filtered,
        sort(sortRule) {
          if (sortRule) {
            if (sortRule.publishedAt === -1 || sortRule === '-publishedAt') {
              this.data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            } else if (sortRule.publishedAt === 1 || sortRule === 'publishedAt') {
              this.data.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
            } else if (sortRule === '-readTime') {
              this.data.sort((a, b) => b.readTime - a.readTime);
            }
          }
          return this;
        },
        skip(n) {
          this.data = this.data.slice(n);
          return this;
        },
        limit(n) {
          this.data = this.data.slice(0, n);
          return this;
        },
        populate(field) {
          if (field === 'author' || (typeof field === 'string' && field.includes('author'))) {
            this.data = this.data.map((p) => {
              const authorObj = users.find((u) => String(u._id) === String(p.author));
              return {
                ...p,
                author: authorObj
                  ? {
                      _id: authorObj._id,
                      name: authorObj.name,
                      email: authorObj.email,
                      avatar: authorObj.avatar,
                      bio: authorObj.bio,
                    }
                  : { name: 'Vasanth', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
              };
            });
          }
          return this;
        },
        then(resolve) {
          resolve(this.data);
        },
      };

      return chain;
    },

    countDocuments: async (filter = {}) => {
      let filtered = [...posts];
      if (filter.status === 'published') {
        const now = new Date();
        filtered = filtered.filter(
          (p) => p.status === 'published' && new Date(p.publishedAt) <= now
        );
      } else if (filter.status && filter.status !== 'all') {
        filtered = filtered.filter((p) => p.status === filter.status);
      }
      if (filter.category) {
        const catTerm = filter.category.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            Array.isArray(p.categories) &&
            p.categories.some((c) => c.toLowerCase() === catTerm || slugify(c, { lower: true }) === catTerm)
        );
      }
      if (filter.search) {
        const term = filter.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.title && p.title.toLowerCase().includes(term)) ||
            (p.excerpt && p.excerpt.toLowerCase().includes(term))
        );
      }
      return filtered.length;
    },

    findOne: (query) => {
      let post = null;
      if (query.slug) {
        post = posts.find((p) => p.slug === query.slug);
      } else if (query._id) {
        post = posts.find((p) => String(p._id) === String(query._id));
      }

      const chain = {
        data: post ? { ...post } : null,
        populate(field) {
          if (this.data && (field === 'author' || (typeof field === 'string' && field.includes('author')))) {
            const authorObj = users.find((u) => String(u._id) === String(this.data.author));
            this.data.author = authorObj
              ? {
                  _id: authorObj._id,
                  name: authorObj.name,
                  email: authorObj.email,
                  avatar: authorObj.avatar,
                  bio: authorObj.bio,
                }
              : { name: 'Vasanth', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' };
          }
          return this;
        },
        then(resolve) {
          resolve(this.data);
        },
      };
      return chain;
    },

    findById: (id) => {
      const post = posts.find((p) => String(p._id) === String(id));
      const chain = {
        data: post ? { ...post } : null,
        populate(field) {
          if (this.data && field === 'author') {
            const authorObj = users.find((u) => String(u._id) === String(this.data.author));
            this.data.author = authorObj || { name: 'Vasanth' };
          }
          return this;
        },
        then(resolve) {
          resolve(this.data);
        },
      };
      return chain;
    },

    create: async (data) => {
      const title = data.title;
      let slug = data.slug || slugify(title, { lower: true, strict: true });
      if (posts.some((p) => p.slug === slug)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const readTime = calculateReadTime(data.content);
      const newPost = {
        _id: 'post_' + Date.now(),
        ...data,
        slug,
        readTime,
        seoTitle: data.seoTitle || title,
        metaDescription: data.metaDescription || data.excerpt,
        isFeatured: Boolean(data.isFeatured),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      posts.unshift(newPost);
      saveToDisk();
      return newPost;
    },

    findByIdAndUpdate: async (id, data) => {
      const index = posts.findIndex((p) => String(p._id) === String(id));
      if (index === -1) return null;

      const current = posts[index];
      let slug = data.slug || current.slug;
      if (data.title && !data.slug && data.title !== current.title) {
        slug = slugify(data.title, { lower: true, strict: true });
      }

      const updated = {
        ...current,
        ...data,
        slug,
        readTime: data.content ? calculateReadTime(data.content) : current.readTime,
        updatedAt: new Date(),
      };
      posts[index] = updated;
      saveToDisk();
      return updated;
    },

    findByIdAndDelete: async (id) => {
      const index = posts.findIndex((p) => String(p._id) === String(id));
      if (index === -1) return null;
      const removed = posts.splice(index, 1);
      saveToDisk();
      return removed[0];
    },
  },
};

module.exports = MemoryStore;
