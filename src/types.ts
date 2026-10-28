export interface Movie {
  _id: string;
  title: string;
  genre: string;
  duration: string;
  image: string;
  desc: string;
}

export interface NewMovie {
  title: string;
  genre: string;
  duration: string;
  image: string;
  desc: string;
}

export interface Booking {
  id: string;
  movieId: string;
  movieTitle: string;
  movieImage: string;
  theater: string;
  showtime: string;
  seats: string[];
  date: string;
  total: number;
}

export interface User {
  name: string;
  email: string;
}

export type View =
  | { name: 'home' }
  | { name: 'details'; movieId: string }
  | { name: 'seats'; movieId: string; theater: string; showtime: string }
  | { name: 'checkout'; booking: Booking }
  | { name: 'dashboard' }
  | { name: 'admin' };
