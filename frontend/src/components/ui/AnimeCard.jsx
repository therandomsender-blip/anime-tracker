import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Plus, Check } from 'lucide-react'
import clsx from 'clsx'

const STATUS_COLORS = {
  watching: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  plan_to_watch: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
  on_hold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

const STATUS_LABELS = {
  watching: 'Watching',
  completed: 'Completed',
  plan_to_watch: 'Plan to Watch',
  dropped: 'Dropped',
  on_hold: 'On Hold',
}

export default function AnimeCard({ anime, inCollection, collectionStatus, onAdd }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  // Support both Jikan API format and collection format
  const id = anime.mal_id
  const title = anime.title
  const image = anime.image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
  const score = anime.mal_score || anime.score
  const episodes = anime.episodes
  const year = anime.year || anime.aired?.prop?.from?.year

  return (
    <div
      className="card group cursor-pointer overflow-hidden hover:border-[rgba(255,107,157,0.4)] hover:-translate-y-1 transition-all duration-300"
      onClick={() => navigate(`/anime/${id}`)}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#12121e]">
        {!imgError && image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8888aa] text-xs text-center px-4">
            No Image
          </div>
        )}

        {/* Score badge */}
        {score && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star size={11} className="text-[#ffd700] fill-[#ffd700]" />
            <span className="text-xs font-semibold text-white">{Number(score).toFixed(1)}</span>
          </div>
        )}

        {/* Add button */}
        <div className="absolute top-2 right-2">
          {inCollection ? (
            <div className="w-7 h-7 rounded-full bg-[#ff6b9d] flex items-center justify-center">
              <Check size={13} className="text-white" />
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd?.(anime) }}
              className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm hover:bg-[#ff6b9d] flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            >
              <Plus size={13} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#f0f0f5] line-clamp-2 leading-tight mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8888aa]">{year || '—'} · {episodes ? `${episodes} ep` : 'N/A'}</span>
          {collectionStatus && (
            <span className={clsx('badge border text-[10px]', STATUS_COLORS[collectionStatus])}>
              {STATUS_LABELS[collectionStatus]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
