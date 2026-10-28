import { useEffect, useMemo, useState } from 'react';
import { Search, Star, Clock, Film } from 'lucide-react';
import { fetchMovies } from '@/api/movies';
import { fallbackMovies } from '@/api/fallback';
import MoviePoster from '@/components/MoviePoster';
import type { Movie, View } from '@/types';

interface HomeProps {
  onNavigate: (view: View) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchMovies()
      .then((m) => {
        if (cancelled) return;
        setMovies(m);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // API unreachable — show local fallback so the page is never empty.
        setMovies(fallbackMovies);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q)
    );
  }, [movies, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-12 mb-10">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
            <Film size={16} /> Now Showing
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Book your next cinema experience in minutes.
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl">
            Browse what's playing, pick your seats, and grab your tickets — all in one place.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or genre..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-slate-400">
          <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p>Loading movies...</p>
        </div>
      )}

      {/* Empty search result */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p>No movies match "{query}".</p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((movie) => (
            <button
              key={movie._id}
              onClick={() => onNavigate({ name: 'details', movieId: movie._id })}
              className="group text-left bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="aspect-[2/3] relative">
                <MoviePoster
                  movie={movie}
                  className="w-full h-full"
                  imgClassName="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Star size={13} className="text-emerald-400" /> {movie.genre}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} /> {movie.duration}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
