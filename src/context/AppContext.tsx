import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Booking, User } from '@/types';

interface AppState {
  user: User | null;
  bookings: Booking[];
  login: (user: User) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const USER_KEY = 'imovies_user';
const BOOKINGS_KEY = 'imovies_bookings';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const raw = localStorage.getItem(BOOKINGS_KEY);
      return raw ? (JSON.parse(raw) as Booking[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const value = useMemo<AppState>(
    () => ({
      user,
      bookings,
      login: (u) => setUser(u),
      logout: () => setUser(null),
      addBooking: (b) => setBookings((prev) => [b, ...prev]),
      cancelBooking: (id) => setBookings((prev) => prev.filter((b) => b.id !== id)),
    }),
    [user, bookings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
