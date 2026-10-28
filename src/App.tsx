import { useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { fetchMovie } from '@/api/movies';
import { findFallbackMovie } from '@/api/fallback';
import type { Movie, View } from '@/types';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import Home from '@/components/Home';
import MovieDetails from '@/components/MovieDetails';
import SeatSelection from '@/components/SeatSelection';
import Checkout from '@/components/Checkout';
import Dashboard from '@/components/Dashboard';
import Admin from '@/components/Admin';

function Shell() {
  const { user, bookings } = useApp();
  const [view, setView] = useState<View>({ name: 'home' });
  const [showAuth, setShowAuth] = useState(false);
  const [seatMovie, setSeatMovie] = useState<Movie | null>(null);

  // Auto-close auth modal once the user logs in
  useEffect(() => {
    if (user && showAuth) setShowAuth(false);
  }, [user, showAuth]);

  // Gate auth-protected views
  const guarded = view.name === 'dashboard' || view.name === 'checkout';
  useEffect(() => {
    if (guarded && !user) setShowAuth(true);
  }, [guarded, user]);

  // Load movie when entering seat selection
  useEffect(() => {
    if (view.name === 'seats') {
      fetchMovie(view.movieId)
        .then((m) => setSeatMovie(m))
        .catch(() => setSeatMovie(findFallbackMovie(view.movieId)));
    } else {
      setSeatMovie(null);
    }
  }, [view]);

  const navigate = (next: View) => {
    if ((next.name === 'dashboard' || next.name === 'checkout') && !user) {
      setShowAuth(true);
      return;
    }
    setView(next);
    window.scrollTo({ top: 0 });
  };

  const renderView = () => {
    switch (view.name) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'details':
        return <MovieDetails movieId={view.movieId} onNavigate={navigate} />;
      case 'seats':
        if (!seatMovie) {
          return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center text-slate-400">
              <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p>Loading...</p>
            </div>
          );
        }
        return (
          <SeatSelection
            movie={seatMovie}
            theater={view.theater}
            showtime={view.showtime}
            onNavigate={navigate}
          />
        );
      case 'checkout':
        return <Checkout booking={view.booking} onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar view={view} onNavigate={navigate} onSignIn={() => setShowAuth(true)} />
      <main className="pb-16">
        {renderView()}
        {bookings.length > 0 && view.name === 'home' && (
          <p className="text-center text-slate-600 text-xs mt-8">
            You have {bookings.length} active booking{bookings.length > 1 ? 's' : ''}. Visit My Tickets to view them.
          </p>
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        IMovies &copy; {new Date().getFullYear()} — A modern cinema booking experience.
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

export default App;
