import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication APIs
export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data);
  if (res.data.token) {
    localStorage.setItem('nexus_token', res.data.token);
    localStorage.setItem('nexus_user', JSON.stringify(res.data));
  }
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data);
  if (res.data.token) {
    localStorage.setItem('nexus_token', res.data.token);
    localStorage.setItem('nexus_user', JSON.stringify(res.data));
  }
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('nexus_token');
  localStorage.removeItem('nexus_user');
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// AI Tools APIs
export const fetchTools = async (params = {}) => {
  const res = await api.get('/tools', { params });
  return res.data;
};

export const fetchToolById = async (id) => {
  const res = await api.get(`/tools/${id}`);
  return res.data;
};

export const fetchToolsStats = async () => {
  const res = await api.get('/tools/stats');
  return res.data;
};

export const fetchRecentlyVerified = async () => {
  const res = await api.get('/tools/recently-verified');
  return res.data;
};

export const reportTool = async (id, data) => {
  const res = await api.post(`/tools/${id}/report`, data);
  return res.data;
};

export const bookmarkTool = async (id) => {
  const res = await api.post(`/tools/${id}/bookmark`);
  return res.data;
};

// Categories APIs
export const fetchCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const fetchCategoryTools = async (id) => {
  const res = await api.get(`/categories/${id}/tools`);
  return res.data;
};

// Search API
export const searchAI = async (query) => {
  const res = await api.get('/search', { params: { q: query } });
  return res.data;
};

export const searchWithGemini = async (query) => {
  const res = await api.post('/search/gemini', { query });
  return res.data;
};

export const checkGeminiStatus = async () => {
  const res = await api.get('/search/gemini/status');
  return res.data;
};

// Learning APIs
export const fetchLearning = async (params = {}) => {
  const res = await api.get('/learning', { params });
  return res.data;
};

export const fetchLearningById = async (id) => {
  const res = await api.get(`/learning/${id}`);
  return res.data;
};

export const fetchCourseProgress = async (id) => {
  const res = await api.get(`/learning/${id}/progress`);
  return res.data;
};

export const toggleCourseModule = async (courseId, moduleIndex) => {
  const res = await api.post(`/learning/${courseId}/toggle-module`, { moduleIndex });
  return res.data;
};

// Projects APIs
export const fetchProjects = async (params = {}) => {
  const res = await api.get('/projects', { params });
  return res.data;
};

export const fetchProjectById = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

// Roadmaps APIs
export const fetchRoadmaps = async (params = {}) => {
  const res = await api.get('/roadmaps', { params });
  return res.data;
};

export const fetchRoadmapById = async (id) => {
  const res = await api.get(`/roadmaps/${id}`);
  return res.data;
};

// Community APIs
export const fetchCommunity = async (params = {}) => {
  const res = await api.get('/community', { params });
  return res.data;
};

export const createCommunityPost = async (postData) => {
  const res = await api.post('/community', postData);
  return res.data;
};

export const replyCommunityPost = async (id, content) => {
  const res = await api.post(`/community/${id}/reply`, { content });
  return res.data;
};

// Open-Source Learning Hub APIs
export const fetchOpenSourceRepos = async (params = {}) => {
  const res = await api.get('/open-source', { params });
  return res.data;
};

export const fetchOpenSourceRepoById = async (id) => {
  const res = await api.get(`/open-source/${id}`);
  return res.data;
};

export const fetchOpenSourceStats = async () => {
  const res = await api.get('/open-source/stats');
  return res.data;
};

export default api;
