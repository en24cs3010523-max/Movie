import { useMemo, useState } from 'react';
import { ArrowLeft, Armchair } from 'lucide-react';
import type { Movie, View } from '@/types';

interface SeatSelectionProps {
  movie: Movie;
  theater: string;
  showtime: string;
  onNavigate: (view: View) => void;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = 8;
const PRICE = 10;

export default function SeatSelection({ movie, theater, showtime, onNavigate }: SeatSelectionProps) {
  // Deterministic "booked" seats derived from the movie id so the layout is stable per movie.
  const bookedSeats = useMemo(() => {
    const set = new Set<string>();
    const seed = movie._id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    let s = seed;
    const rand = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    const total = ROWS.length * COLS;
    const target = Math.floor(total * 0.3);
    while (set.size < target) {
      const r = ROWS[Math.floor(rand() * ROWS.length)];
      const c = Math.floor(rand() * COLS) + 1;
      set.add(`${r}${c}`);
    }
    return set;
  }, [movie._id]);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (seat: string) => {
    if (bookedSeats.has(seat)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat)) next.delete(seat);
      else next.add(seat);
      return next;
    });
  };

  const total = selected.size * PRICE;

  const proceed = () => {
    const booking = {
      id: `${Date.now()}`,
      movieId: movie._id,
      movieTitle: movie.title,
      movieImage: movie.image,
      theater,
      showtime,
      seats: Array.from(selected).sort(),
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      total,
    };
    onNavigate({ name: 'checkout', booking });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => onNavigate({ name: 'details', movieId: movie._id })}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{movie.title}</h1>
        <p className="text-slate-400 mt-1">
          {theater} · {showtime}
        </p>
      </div>

      {/* Screen */}
      <div className="mb-10">
        <div className="mx-auto h-2 w-3/4 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent rounded-full" />
        <p className="text-center text-slate-500 text-xs mt-2 tracking-widest uppercase">Screen</p>
      </div>

      {/* Seats */}
      <div className="flex flex-col items-center gap-2.5">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center gap-2.5">
            <span className="w-6 text-center text-slate-500 text-sm">{row}</span>
            <div className="flex gap-2">
              {Array.from({ length: COLS }).map((_, i) => {
                const seat = `${row}${i + 1}`;
                const isBooked = bookedSeats.has(seat);
                const isSelected = selected.has(seat);
                return (
                  <button
                    key={seat}
                    onClick={() => toggle(seat)}
                    disabled={isBooked}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center transition-all ${
                      isBooked
                        ? 'bg-slate-800 text-slate-700 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                    title={isBooked ? 'Booked' : seat}
                  >
                    <Armchair size={16} />
                  </button>
                );
              })}
            </div>
            <span className="w-6 text-center text-slate-500 text-sm">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-emerald-500" /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-800 opacity-60" /> Booked
        </span>
      </div>

      {/* Footer bar */}
      <div className="sticky bottom-4 mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <p className="text-slate-400 text-sm">
            {selected.size > 0
              ? `${selected.size} seat${selected.size > 1 ? 's' : ''} selected`
              : 'Select seats to continue'}
          </p>
          {selected.size > 0 && (
            <p className="text-2xl font-bold text-white mt-0.5">${total}</p>
          )}
        </div>
        <button
          disabled={selected.size === 0}
          onClick={proceed}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
