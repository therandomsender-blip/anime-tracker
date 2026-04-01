import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LayoutDashboard, Library, Search, LogOut, Tv2 } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/collection', icon: Library, label: 'Collection' },
  { to: '/search', icon: Search, label: 'Discover' },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col border-r border-[rgba(255,107,157,0.12)] bg-[#0d0d14]">
        {/* Logo */}
        <div className="px-6 py-7 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ff6b9d] flex items-center justify-center shadow-lg shadow-[rgba(255,107,157,0.4)]">
            <Tv2 size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl tracking-widest text-white">ANIVAULT</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 mt-2">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group',
                  isActive
                    ? 'bg-[rgba(255,107,157,0.12)] text-[#ff6b9d] border border-[rgba(255,107,157,0.25)]'
                    : 'text-[#8888aa] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.04)]'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[rgba(255,107,157,0.12)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#cc4477] flex items-center justify-center text-white text-sm font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f0f0f5] truncate">{user?.username}</p>
              <p className="text-xs text-[#8888aa] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#8888aa] hover:text-[#ff6b9d] transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[#0d0d14]">
        <Outlet />
      </main>
    </div>
  )
}
