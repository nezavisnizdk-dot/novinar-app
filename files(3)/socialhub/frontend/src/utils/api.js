import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  getMe: () => api.get('/auth/me'),
  connectFacebook: (accessToken, pageId) => api.post('/auth/facebook/connect', { accessToken, pageId }),
  disconnectFacebook: () => api.post('/auth/facebook/disconnect'),
  connectWordPress: (siteUrl, username, password) => api.post('/auth/wordpress/connect', { siteUrl, username, password }),
  disconnectWordPress: () => api.post('/auth/wordpress/disconnect')
};

// RSS
export const rssAPI = {
  getFeeds: () => api.get('/rss/feeds'),
  addFeed: (name, url, fetchInterval) => api.post('/rss/feeds', { name, url, fetchInterval }),
  deleteFeed: (id) => api.delete(`/rss/feeds/${id}`),
  fetchFeed: (id) => api.post(`/rss/feeds/${id}/fetch`),
  fetchAll: () => api.post('/rss/fetch-all')
};

// Articles
export const articlesAPI = {
  getArticles: (status = 'all') => api.get('/articles', { params: { status } }),
  getArticle: (id) => api.get(`/articles/${id}`),
  updateStatus: (id, status) => api.patch(`/articles/${id}/status`, { status }),
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  markAsRead: (id) => api.patch(`/articles/${id}/mark-read`)
};

// Schedule
export const scheduleAPI = {
  scheduleArticle: (id, data) => api.post(`/schedule/${id}`, data),
  publishToFacebook: (id) => api.post(`/schedule/${id}/facebook`),
  publishToWordPress: (id) => api.post(`/schedule/${id}/wordpress`),
  getScheduled: () => api.get('/schedule/scheduled')
};

export default api;
