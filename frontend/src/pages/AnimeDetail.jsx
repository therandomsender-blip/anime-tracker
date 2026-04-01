import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { animeApi, collectionApi } from '../api/client'
import AddToCollectionModal from '../components/ui/AddToCollectionModal'
import { ArrowLeft, Star, Play, Clock, CalendarDays, Layers, Plus, Check } from 'lucide-react'

export default function AnimeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showAdd, setShowAdd] = useState(false)

  const { data: animeData, isLoading } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => animeApi.getById(id),
  })

  const { data: collectionData } = useQuery({
    queryKey: ['collection'],
    queryFn: () => collectionApi.getAll(),
  })

  const anime = animeData?.data?.data
  const inCollection = (collectionData?.data || []).some((e) => e.mal_id === anime?.mal_id)

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-32 shimmer rounded mb-8" />
        <div className="flex gap-8">
          <div className="w-56 aspect-[2/3] shimmer rounded-xl" />
          <div className="flex-1 space-y-4">
            <div className="h-12 w-3/4 shimmer rounded" />
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-full shimmer rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!anime) return <div className="p-8 text-[#8888aa]">Anime not found.</div>

  const image = anime.images?.jpg?.large_image_url
  const genres = anime.genres?.map((g) => g.name) || []
  const studios = anime.studios?.map((s) => s.name).join(', ')
  const synopsis = anime.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '').trim()

  return (
    <div className="p-8 max-w-5xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#8888aa] hover:text-[#ff6b9d] transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="flex gap-8 flex-col sm:flex-row">
        {/* Poster */}
        <div className="shrink-0">
          <div className="w-48 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-[rgba(255,107,157,0.2)]">
            {image ? (
              <img src={image} alt={anime.title} className="w-full" />
            ) : (
              <div className="aspect-[2/3] bg-[#1a1a2e] flex items-center justify-center text-[#8888aa] text-xs">No Image</div>
            )}
          </div>

          {/* Score */}
          {anime.score && (
            <div className="mt-4 card p-3 flex items-center justify-center gap-2">
              <Star size={16} className="text-[#ffd700] fill-[#ffd700]" />
              <span className="text-xl font-bold text-[#ffd700]">{anime.score}</span>
              <span className="text-xs text-[#8888aa]">/ 10</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="font-display text-4xl sm:text-5xl tracking-widest text-white mb-1 leading-tight">
            {anime.title?.toUpperCase()}
          </h1>
          {anime.title_english && anime.title_english !== anime.title && (
            <p className="text-[#8888aa] text-sm mb-4">{anime.title_english}</p>
          )}

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {anime.type && <MetaPill icon={Play} label={anime.type} />}
            {anime.episodes && <MetaPill icon={Layers} label={`${anime.episodes} episodes`} />}
            {anime.duration && <MetaPill icon={Clock} label={anime.duration.replace(' per ep', '')} />}
            {anime.year && <MetaPill icon={CalendarDays} label={String(anime.year)} />}
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {genres.map((g) => (
                <span key={g} className="badge bg-[rgba(255,107,157,0.1)] border border-[rgba(255,107,157,0.25)] text-[#ff6b9d]">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Studios */}
          {studios && (
            <p className="text-xs text-[#8888aa] mb-5">
              <span className="font-semibold uppercase tracking-wider text-[#6666aa]">Studio </span>
              {studios}
            </p>
          )}

          {/* Synopsis */}
          {synopsis && (
            <p className="text-sm text-[#c0c0d8] leading-relaxed mb-6 max-w-2xl">{synopsis}</p>
          )}

          {/* Add button */}
          <button
            onClick={() => !inCollection && setShowAdd(true)}
            disabled={inCollection}
            className={inCollection
              ? 'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-green-500/10 border border-green-500/30 text-green-400 cursor-default'
              : 'btn-primary flex items-center gap-2'
            }
          >
            {inCollection ? <><Check size={16} /> In Your Vault</> : <><Plus size={16} /> Add to Vault</>}
          </button>
        </div>
      </div>

      {showAdd && (
        <AddToCollectionModal anime={anime} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}

function MetaPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-[#c0c0d8]">
      <Icon size={12} className="text-[#ff6b9d]" />
      {label}
    </div>
  )
}
