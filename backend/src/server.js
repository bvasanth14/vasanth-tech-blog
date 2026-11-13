const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB, getDbStatus } = require('./config/db');
const MemoryStore = require('./config/memoryStore');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded assets
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'ok',
    service: 'Vasanth Tech Blog Enterprise API',
    database: dbStatus.isConnected
      ? 'MongoDB Connected'
      : dbStatus.isInMemoryFallback
      ? 'In-Memory Enterprise Mock Store'
      : 'Initializing',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));

// Serve frontend in production build if present
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      next();
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
const startServer = async () => {
  const conn = await connectDB();

  if (conn) {
    // If real MongoDB is connected, check if seeded
    try {
      const Category = require('./models/Category');
      const User = require('./models/User');
      const Post = require('./models/Post');
      const { initialCategories, initialUsers, initialPosts } = require('./config/initialData');
      const bcrypt = require('bcryptjs');

      const catCount = await Category.countDocuments();
      if (catCount === 0) {
        console.log('[AutoSeed] Populating initial categories into MongoDB...');
        await Category.insertMany(initialCategories);
      }

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[AutoSeed] Populating initial users into MongoDB...');
        const salt = await bcrypt.genSalt(10);
        const usersToInsert = initialUsers.map((u) => ({
          ...u,
          password: bcrypt.hashSync(u.password, salt),
        }));
        await User.insertMany(usersToInsert);
      }

      const postCount = await Post.countDocuments();
      if (postCount === 0) {
        console.log('[AutoSeed] Populating initial technology articles into MongoDB...');
        await Post.insertMany(initialPosts);
      }
    } catch (err) {
      console.warn('[AutoSeed Warning]', err.message);
    }
  } else {
    // Fallback in-memory store
    MemoryStore.init();
  }

  app.listen(PORT, () => {
    console.log(`[Server] Vasanth Tech Blog API running on http://localhost:${PORT}`);
  });
};

startServer();
