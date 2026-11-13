const { getDbStatus } = require('./db');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const MemoryStore = require('./memoryStore');

const getPostModel = () => {
  const { isInMemoryFallback } = getDbStatus();
  return isInMemoryFallback ? MemoryStore.posts : Post;
};

const getUserModel = () => {
  const { isInMemoryFallback } = getDbStatus();
  return isInMemoryFallback ? MemoryStore.users : User;
};

const getCategoryModel = () => {
  const { isInMemoryFallback } = getDbStatus();
  return isInMemoryFallback ? MemoryStore.categories : Category;
};

module.exports = {
  getPostModel,
  getUserModel,
  getCategoryModel,
};
