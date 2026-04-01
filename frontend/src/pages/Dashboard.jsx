import { useQuery } from '@tanstack/react-query'
import { collectionApi } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { Tv2, CheckCircle2, Clock, BookMarked, TrendingUp, Star, Film } from 'lucide-react'
import AnimeCard from '../components/ui/AnimeCard'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-[#f0f0f5]">{value ?? '—'}</p>
      <p className="text-xs text-[#8888aa] font-medium">{label}</p>
    </div>
  </div>
)

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const { data: statsData } = useQuery({ queryKey: ['stats'], queryFn: () => collectionApi.stats() })
  const { data: recentData } = useQuery({ queryKey: ['collection', 'watching'], queryFn: () => collectionApi.getAll('watching') })

  const stats = statsData?.data
  const recent = recentData?.data?.slice(0, 6) || []

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#8888aa] text-sm mb-1">Welcome back,</p>
        <h1 className="font-display text-5xl tracking-widest text-white">
          {user?.username?.toUpperCase()}
          <span className="text-[#ff6b9d]">.</span>
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookMarked} label="Total in Vault" value={stats?.total} color="bg-[#ff6b9d]" />
        <StatCard icon={Tv2} label="Watching" value={stats?.watching} color="bg-blue-500" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats?.completed} color="bg-green-500" />
        <StatCard icon={Film} label="Episodes Watched" value={stats?.total_episodes_watched?.toLocaleString()} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Clock} label="Plan to Watch" value={stats?.plan_to_watch} color="bg-indigo-500" />
        <StatCard icon={TrendingUp} label="On Hold" value={stats?.on_hold} color="bg-yellow-500" />
        <StatCard icon={Star} label="Avg Rating" value={stats?.avg_rating ? `${stats.avg_rating}/10` : null} color="bg-[#c9a227]" />
      </div>

      {/* Currently watching */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-[#ff6b9d] rounded-full" />
            <h2 className="font-display text-2xl tracking-wider text-white">CURRENTLY WATCHING</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {recent.map((entry) => (
              <AnimeCard
                key={entry.id}
                anime={entry}
                inCollection
                collectionStatus={entry.status}
              />
            ))}
          </div>
        </div>
      )}

      {recent.length === 0 && stats?.total === 0 && (
        <div className="card p-12 text-center">
          <Tv2 size={48} className="text-[#ff6b9d] mx-auto mb-4 opacity-50" />
          <h3 className="font-display text-2xl tracking-wider text-white mb-2">YOUR VAULT IS EMPTY</h3>
          <p className="text-[#8888aa] text-sm mb-6">Start by searching for anime to add to your collection.</p>
          <a href="/search" className="btn-primary inline-block">Discover Anime</a>
        </div>
      )}
    </div>
  )
}
