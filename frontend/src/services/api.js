import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('techblog_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected routes, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('techblog_token');
        localStorage.removeItem('techblog_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const postsApi = {
  getAll: (params) => api.get('/posts', { params }),
  getBySlug: (slug, preview = false) => api.get(`/posts/${slug}`, { params: { preview } }),
  getFeaturedHero: () => api.get('/posts/featured/hero'),
  getTrending: () => api.get('/posts/trending/top'),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  getAuthors: () => api.get('/auth/authors'),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

export const uploadApi = {
  uploadImage: (formData) =>
    api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
