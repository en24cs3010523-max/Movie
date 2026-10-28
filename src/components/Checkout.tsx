import { ArrowLeft, CheckCircle2, Ticket } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import MoviePoster from '@/components/MoviePoster';
import type { Booking, View } from '@/types';

interface CheckoutProps {
  booking: Booking;
  onNavigate: (view: View) => void;
}

export default function Checkout({ booking, onNavigate }: CheckoutProps) {
  const { addBooking } = useApp();

  const confirm = () => {
    addBooking(booking);
    onNavigate({ name: 'dashboard' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => onNavigate({ name: 'seats', movieId: booking.movieId, theater: booking.theater, showtime: booking.showtime })}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500/20 to-transparent p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          <p className="text-slate-400 text-sm mt-1">Review and confirm your booking.</p>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex gap-4">
            <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
              <MoviePoster movie={{ image: booking.movieImage, title: booking.movieTitle }} className="w-full h-full" iconSize={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{booking.movieTitle}</h2>
              <p className="text-slate-400 text-sm mt-1">{booking.theater}</p>
              <p className="text-slate-400 text-sm">{booking.showtime} · {booking.date}</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <p className="text-sm text-slate-300 font-medium mb-2">Seats ({booking.seats.length})</p>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20"
                >
                  <Ticket size={14} /> {s}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5 flex items-center justify-between">
            <span className="text-slate-300">Total ({booking.seats.length} × $10)</span>
            <span className="text-3xl font-bold text-white">${booking.total}</span>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={confirm}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} /> Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
