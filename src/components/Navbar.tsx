import { Film, Home, LayoutDashboard, ShieldCheck, LogOut, UserRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { View } from '@/types';

interface NavbarProps {
  view: View;
  onNavigate: (view: View) => void;
  onSignIn: () => void;
}

export default function Navbar({ view, onNavigate, onSignIn }: NavbarProps) {
  const { user, logout } = useApp();

  const navItem = (label: string, target: View, icon: React.ReactNode, active: boolean) => (
    <button
      onClick={() => onNavigate(target)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-emerald-400 bg-emerald-500/10'
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate({ name: 'home' })}
          className="flex items-center gap-2 text-white font-bold text-xl tracking-tight"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 text-slate-950">
            <Film size={20} />
          </span>
          <span>IMovies</span>
        </button>

        <nav className="flex items-center gap-1">
          {navItem('Home', { name: 'home' }, <Home size={18} />, view.name === 'home')}
          {user &&
            navItem(
              'My Tickets',
              { name: 'dashboard' },
              <LayoutDashboard size={18} />,
              view.name === 'dashboard'
            )}
          {navItem('Admin', { name: 'admin' }, <ShieldCheck size={18} />, view.name === 'admin')}

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <UserRound size={18} className="text-emerald-400" />
                <span className="hidden md:inline">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
