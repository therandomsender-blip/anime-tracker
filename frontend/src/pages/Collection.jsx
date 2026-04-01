import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionApi } from '../api/client'
import AnimeCard from '../components/ui/AnimeCard'
import { Trash2, Star, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Watching', value: 'watching' },
  { label: 'Completed', value: 'completed' },
  { label: 'Plan to Watch', value: 'plan_to_watch' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Dropped', value: 'dropped' },
]

const STATUSES = ['watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped']

export default function Collection() {
  const [filter, setFilter] = useState(undefined)
  const [editEntry, setEditEntry] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['collection', filter],
    queryFn: () => collectionApi.getAll(filter),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => collectionApi.remove(id),
    onSuccess: () => { qc.invalidateQueries(['collection']); qc.invalidateQueries(['stats']) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => collectionApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['collection']); setEditEntry(null) },
  })

  const entries = data?.data || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="w-1 h-6 bg-[#ff6b9d] rounded-full inline-block mr-3 align-middle" />
        <h1 className="font-display text-5xl tracking-widest text-white inline">MY VAULT</h1>
        <span className="ml-3 text-[#8888aa] text-sm">{entries.length} entries</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={String(f.value)}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
              filter === f.value
                ? 'bg-[rgba(255,107,157,0.15)] border-[#ff6b9d] text-[#ff6b9d]'
                : 'border-[rgba(255,255,255,0.08)] text-[#8888aa] hover:border-[rgba(255,107,157,0.3)]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="rounded-xl aspect-[2/3] shimmer" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-12 text-center text-[#8888aa]">
          Nothing here yet. Start adding anime!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="relative group/card">
              <AnimeCard anime={entry} inCollection collectionStatus={entry.status} />
              {/* Hover actions */}
              <div className="absolute bottom-12 left-0 right-0 px-3 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1.5">
                <button
                  onClick={() => setEditEntry(entry)}
                  className="flex-1 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-xs text-[#f0f0f5] hover:bg-[#ff6b9d] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(entry.id)}
                  className="px-2 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editEntry && (
        <EditModal
          entry={editEntry}
          onClose={() => setEditEntry(null)}
          onSave={(data) => updateMutation.mutate({ id: editEntry.id, data })}
          isSaving={updateMutation.isPending}
        />
      )}
    </div>
  )
}

function EditModal({ entry, onClose, onSave, isSaving }) {
  const [status, setStatus] = useState(entry.status)
  const [rating, setRating] = useState(entry.user_rating || '')
  const [notes, setNotes] = useState(entry.notes || '')
  const [epWatched, setEpWatched] = useState(entry.episodes_watched || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 animate-fade-up">
        <h2 className="font-display text-2xl tracking-wide mb-1">EDIT ENTRY</h2>
        <p className="text-sm text-[#8888aa] mb-5 line-clamp-1">{entry.title}</p>

        <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2 block">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input mb-4 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </select>

        <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2 block">Episodes Watched</label>
        <input
          type="number"
          min={0}
          max={entry.episodes || 9999}
          value={epWatched}
          onChange={(e) => setEpWatched(Number(e.target.value))}
          className="input mb-4 text-sm"
        />

        <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2 block">Rating (1-10)</label>
        <input
          type="number"
          min={1}
          max={10}
          step={0.5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="input mb-4 text-sm"
          placeholder="—"
        />

        <label className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2 block">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input resize-none h-20 text-sm mb-6"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={() => onSave({ status, user_rating: rating ? parseFloat(rating) : null, notes, episodes_watched: epWatched })}
            disabled={isSaving}
            className="btn-primary flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
