const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const Category = require('./models/Category');
const { initialCategories, initialUsers, initialPosts } = require('./config/initialData');

const seedData = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.log('[Seeder] Real MongoDB not active. In-memory data store is preloaded automatically on server start.');
      process.exit(0);
    }

    console.log('[Seeder] Cleaning existing database collections...');
    await User.deleteMany();
    await Post.deleteMany();
    await Category.deleteMany();

    console.log('[Seeder] Seeding categories...');
    await Category.insertMany(initialCategories);

    console.log('[Seeder] Seeding users with hashed passwords...');
    const salt = await bcrypt.genSalt(10);
    const usersToInsert = initialUsers.map((u) => ({
      ...u,
      password: bcrypt.hashSync(u.password, salt),
    }));
    await User.insertMany(usersToInsert);

    console.log('[Seeder] Seeding technology articles...');
    await Post.insertMany(initialPosts);

    console.log('[Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Post.deleteMany();
    await Category.deleteMany();
    console.log('[Seeder] All database collections wiped.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
