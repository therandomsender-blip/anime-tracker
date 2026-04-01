import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { Tv2, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.access_token)
      navigate('/')
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,107,157,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(0,212,255,0.05),transparent_60%)]" />

      <div className="card w-full max-w-md p-8 relative z-10 shadow-2xl shadow-black/50">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#ff6b9d] flex items-center justify-center shadow-lg shadow-[rgba(255,107,157,0.4)]">
            <Tv2 size={22} className="text-white" />
          </div>
          <span className="font-display text-3xl tracking-widest text-white">ANIVAULT</span>
        </div>

        <h2 className="text-xl font-semibold text-[#f0f0f5] mb-1">Welcome back</h2>
        <p className="text-sm text-[#8888aa] mb-7">Sign in to your vault</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-1.5 block">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && mutation.mutate({ email, password })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                className="input pr-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && mutation.mutate({ email, password })}
              />
              <button
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8888aa] hover:text-white"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {mutation.isError && (
          <p className="text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {mutation.error?.response?.data?.detail || 'Login failed'}
          </p>
        )}

        <button
          onClick={() => mutation.mutate({ email, password })}
          disabled={mutation.isPending || !email || !password}
          className="btn-primary w-full mt-6 h-11 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>

        <p className="text-center text-sm text-[#8888aa] mt-6">
          No account?{' '}
          <Link to="/register" className="text-[#ff6b9d] hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
