import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { Tv2 } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.access_token)
      navigate('/')
    },
  })

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,107,157,0.08),transparent_60%)]" />

      <div className="card w-full max-w-md p-8 relative z-10 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#ff6b9d] flex items-center justify-center shadow-lg shadow-[rgba(255,107,157,0.4)]">
            <Tv2 size={22} className="text-white" />
          </div>
          <span className="font-display text-3xl tracking-widest text-white">ANIVAULT</span>
        </div>

        <h2 className="text-xl font-semibold text-[#f0f0f5] mb-1">Create your vault</h2>
        <p className="text-sm text-[#8888aa] mb-7">Track your anime journey</p>

        <div className="space-y-4">
          {[
            { key: 'username', label: 'Username', type: 'text', placeholder: 'otaku42' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-1.5 block">{label}</label>
              <input
                type={type}
                className="input"
                placeholder={placeholder}
                value={form[key]}
                onChange={set(key)}
              />
            </div>
          ))}
        </div>

        {mutation.isError && (
          <p className="text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {mutation.error?.response?.data?.detail || 'Registration failed'}
          </p>
        )}

        <button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending || !form.username || !form.email || !form.password}
          className="btn-primary w-full mt-6 h-11 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Creating vault...
            </span>
          ) : 'Create Account'}
        </button>

        <p className="text-center text-sm text-[#8888aa] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ff6b9d] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
