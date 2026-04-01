import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { animeApi, collectionApi } from '../api/client'
import AnimeCard from '../components/ui/AnimeCard'
import AddToCollectionModal from '../components/ui/AddToCollectionModal'
import { Search as SearchIcon, TrendingUp } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useState(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [addAnime, setAddAnime] = useState(null)
  const qc = useQueryClient()

  const { data: collectionData } = useQuery({
    queryKey: ['collection'],
    queryFn: () => collectionApi.getAll(),
  })

  const collectionIds = new Set((collectionData?.data || []).map((e) => e.mal_id))
  const collectionMap = Object.fromEntries((collectionData?.data || []).map((e) => [e.mal_id, e.status]))

  const { data: topData, isLoading: topLoading } = useQuery({
    queryKey: ['top-anime'],
    queryFn: () => animeApi.top(),
    enabled: !query,
  })

  const { data: searchData, isLoading: searchLoading, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => animeApi.search(query),
    enabled: query.length >= 2,
  })

  const isLoading = query.length >= 2 ? (searchLoading || isFetching) : topLoading
  const results = query.length >= 2
    ? (searchData?.data?.data || [])
    : (topData?.data?.data || [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="w-1 h-6 bg-[#ff6b9d] rounded-full inline-block mr-3 align-middle" />
        <h1 className="font-display text-5xl tracking-widest text-white inline">DISCOVER</h1>
      </div>

      {/* Search bar */}
      <div className="relative max-w-xl mb-8">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8888aa]" />
        <input
          type="text"
          placeholder="Search anime titles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-11 text-base h-12"
          autoFocus
        />
        {isFetching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#ff6b9d] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-[#ff6b9d]" />
        <span className="text-sm font-semibold text-[#8888aa] uppercase tracking-wider">
          {query.length >= 2 ? `Results for "${query}"` : 'Top Anime'}
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="rounded-xl aspect-[2/3] shimmer" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="card p-12 text-center text-[#8888aa]">
          {query.length >= 2 ? 'No results found.' : 'Nothing to show.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              inCollection={collectionIds.has(anime.mal_id)}
              collectionStatus={collectionMap[anime.mal_id]}
              onAdd={() => setAddAnime(anime)}
            />
          ))}
        </div>
      )}

      {addAnime && (
        <AddToCollectionModal
          anime={addAnime}
          onClose={() => { setAddAnime(null); qc.invalidateQueries(['collection']) }}
        />
      )}
    </div>
  )
}
