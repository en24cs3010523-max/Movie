import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Film, MapPin, Star } from 'lucide-react';
import { fetchMovie } from '@/api/movies';
import { findFallbackMovie } from '@/api/fallback';
import MoviePoster from '@/components/MoviePoster';
import type { Movie, View } from '@/types';

interface MovieDetailsProps {
  movieId: string;
  onNavigate: (view: View) => void;
}

const THEATERS = [
  { name: 'Cineplex Downtown', location: 'Main Street Plaza' },
  { name: 'StarGazer IMAX', location: 'Riverside Mall' },
  { name: 'Royal Cinema', location: 'Hill Avenue' },
];

const SHOWTIMES = ['10:00 AM', '1:15 PM', '7:45 PM'];

export default function MovieDetails({ movieId, onNavigate }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchMovie(movieId)
      .then((m) => {
        setMovie(m);
        setLoading(false);
      })
      .catch(() => {
        const fallback = findFallbackMovie(movieId);
        if (fallback) {
          setMovie(fallback);
          setLoading(false);
        } else {
          setError('Movie not found.');
          setLoading(false);
        }
      });
  }, [movieId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-rose-400 mb-2">Couldn't load this movie.</p>
        <button
          onClick={() => onNavigate({ name: 'home' })}
          className="text-emerald-400 hover:text-emerald-300"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => onNavigate({ name: 'home' })}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-slate-800">
          <MoviePoster movie={movie} className="w-full h-full" iconSize={48} />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Star size={15} className="text-emerald-400" /> {movie.genre}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> {movie.duration}
            </span>
          </div>

          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mt-8 mb-3">
            Synopsis
          </h2>
          <p className="text-slate-400 leading-relaxed">{movie.desc || 'No description available.'}</p>

          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mt-8 mb-4">
            Theaters & Showtimes
          </h2>
          <div className="space-y-3">
            {THEATERS.map((t) => (
              <div
                key={t.name}
                className="bg-slate-900 rounded-xl border border-slate-800 p-4"
              >
                <div className="flex items-start gap-2 mb-3">
                  <MapPin size={18} className="text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{t.name}</p>
                    <p className="text-slate-500 text-sm">{t.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SHOWTIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() =>
                        onNavigate({
                          name: 'seats',
                          movieId: movie._id,
                          theater: t.name,
                          showtime: time,
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-slate-700 hover:border-emerald-500"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
