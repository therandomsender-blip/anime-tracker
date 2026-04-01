import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionApi } from '../../api/client'
import { X, Star } from 'lucide-react'

const STATUSES = [
  { value: 'plan_to_watch', label: 'Plan to Watch' },
  { value: 'watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'dropped', label: 'Dropped' },
]

export default function AddToCollectionModal({ anime, onClose }) {
  const qc = useQueryClient()
  const [status, setStatus] = useState('plan_to_watch')
  const [rating, setRating] = useState('')
  const [notes, setNotes] = useState('')
  const [hoverStar, setHoverStar] = useState(0)

  const mutation = useMutation({
    mutationFn: (data) => collectionApi.add(data),
    onSuccess: () => {
      qc.invalidateQueries(['collection'])
      qc.invalidateQueries(['stats'])
      onClose()
    },
  })

  const handleSubmit = () => {
    const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
    const genres = anime.genres?.map((g) => g.name).join(',') || ''
    mutation.mutate({
      mal_id: anime.mal_id,
      title: anime.title,
      image_url: image,
      episodes: anime.episodes,
      episodes_watched: status === 'completed' ? (anime.episodes || 0) : 0,
      status,
      user_rating: rating ? parseFloat(rating) : null,
      notes: notes || null,
      genres,
      year: anime.aired?.prop?.from?.year,
      mal_score: anime.score,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-fade-up">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl tracking-wide text-white">ADD TO VAULT</h2>
            <p className="text-sm text-[#8888aa] mt-0.5 line-clamp-1">{anime.title}</p>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2 block">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  status === s.value
                    ? 'bg-[rgba(255,107,157,0.15)] border-[#ff6b9d] text-[#ff6b9d]'
                    : 'border-[rgba(255,255,255,0.08)] text-[#8888aa] hover:border-[rgba(255,107,157,0.3)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating stars */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2 block">Your Rating</label>
          <div className="flex gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHoverStar(n)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setRating(rating == n ? '' : String(n))}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  className={`transition-colors ${
                    n <= (hoverStar || rating)
                      ? 'text-[#ffd700] fill-[#ffd700]'
                      : 'text-[#333355]'
                  }`}
                />
              </button>
            ))}
            {rating && <span className="ml-2 text-sm text-[#ffd700] font-semibold self-center">{rating}/10</span>}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2 block">Notes</label>
          <textarea
            className="input resize-none h-20 text-sm"
            placeholder="Your thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="btn-primary flex-1"
          >
            {mutation.isPending ? 'Adding...' : 'Add to Vault'}
          </button>
        </div>
        {mutation.isError && (
          <p className="text-red-400 text-sm mt-3 text-center">
            {mutation.error?.response?.data?.detail || 'Something went wrong'}
          </p>
        )}
      </div>
    </div>
  )
}
