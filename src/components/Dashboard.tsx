import { Calendar, Clock, MapPin, Ticket, Trash2, Film } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import MoviePoster from '@/components/MoviePoster';
import type { View } from '@/types';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { bookings, cancelBooking, user } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Tickets</h1>
        <p className="text-slate-400 mt-1">
          {user ? `Welcome back, ${user.name}.` : 'Your booking history.'}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 text-slate-500 mb-4">
            <Ticket size={26} />
          </div>
          <p className="text-slate-300 font-medium">No bookings yet.</p>
          <p className="text-slate-500 text-sm mt-1 mb-6">Browse what's showing and book your first ticket.</p>
          <button
            onClick={() => onNavigate({ name: 'home' })}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Film size={18} /> Browse Movies
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
            >
              <div className="w-full sm:w-24 h-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                <MoviePoster movie={{ image: b.movieImage, title: b.movieTitle }} className="w-full h-full" iconSize={28} />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white">{b.movieTitle}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-400" /> {b.theater}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="text-emerald-400" /> {b.showtime}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-emerald-400" /> {b.date}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {b.seats.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20"
                    >
                      <Ticket size={12} /> {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                  <span className="text-xl font-bold text-white">${b.total}</span>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                  >
                    <Trash2 size={16} /> Cancel Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
