import { create } from 'zustand'

const stored = localStorage.getItem('user')

export const useAuthStore = create((set) => ({
  user: stored ? JSON.parse(stored) : null,
  token: localStorage.getItem('token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },
}))
