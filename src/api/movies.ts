import type { Movie, NewMovie } from '@/types';

const API_BASE = '/api';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchMovies(): Promise<Movie[]> {
  const res = await fetch(`${API_BASE}/movies`);
  return handle<Movie[]>(res);
}

export async function fetchMovie(id: string): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies/${id}`);
  return handle<Movie>(res);
}

export async function createMovie(movie: NewMovie): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  return handle<Movie>(res);
}

export async function updateMovie(id: string, movie: Partial<NewMovie>): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  return handle<Movie>(res);
}

export async function deleteMovie(id: string): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE}/movies/${id}`, { method: 'DELETE' });
  return handle<{ message: string; id: string }>(res);
}
