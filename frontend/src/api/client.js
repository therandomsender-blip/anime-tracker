import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
}

// Anime search
export const animeApi = {
  search: (q, page = 1) => api.get('/api/anime/search', { params: { q, page } }),
  getById: (id) => api.get(`/api/anime/${id}`),
  top: (page = 1) => api.get('/api/anime/top', { params: { page } }),
  seasonal: (year, season) => api.get(`/api/anime/seasonal/${year}/${season}`),
}

// Collection
export const collectionApi = {
  getAll: (status) => api.get('/api/collection/', { params: status ? { status } : {} }),
  add: (data) => api.post('/api/collection/', data),
  update: (id, data) => api.put(`/api/collection/${id}`, data),
  remove: (id) => api.delete(`/api/collection/${id}`),
  stats: () => api.get('/api/collection/stats/summary'),
}
