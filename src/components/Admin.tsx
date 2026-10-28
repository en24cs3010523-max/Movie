import { useEffect, useState } from 'react';
import { Lock, Pencil, Plus, ShieldCheck, Trash2, X, Film, Star, Clock } from 'lucide-react';
import {
  fetchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from '@/api/movies';
import MoviePoster from '@/components/MoviePoster';
import type { Movie, NewMovie } from '@/types';

const ADMIN_USER = 'en24cs3010502@admin';
const ADMIN_PASS = 'en24cs3010502';

const emptyForm: NewMovie = {
  title: '',
  genre: '',
  duration: '',
  image: '',
  desc: '',
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<NewMovie>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadMovies = () => {
    setLoading(true);
    setError('');
    fetchMovies()
      .then((m) => {
        setMovies(m);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (authed) loadMovies();
  }, [authed]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      setAuthed(true);
    } else {
      setAuthError('Invalid admin credentials.');
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setMsg('Title is required.');
      return;
    }
    setSaving(true);
    setMsg('');
    const op = editingId
      ? updateMovie(editingId, form)
      : createMovie(form);
    op
      .then(() => {
        setSaving(false);
        resetForm();
        loadMovies();
        setMsg(editingId ? 'Movie updated.' : 'Movie added.');
      })
      .catch((err) => {
        setSaving(false);
        setMsg(err.message);
      });
  };

  const startEdit = (m: Movie) => {
    setEditingId(m._id);
    setForm({
      title: m.title,
      genre: m.genre,
      duration: m.duration,
      image: m.image,
      desc: m.desc,
    });
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMovie(id)
      .then(() => loadMovies())
      .catch((err) => setMsg(err.message));
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 mb-3">
              <ShieldCheck size={24} />
            </span>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in with your admin credentials.</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin username"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition"
                />
              </div>
            </div>
            {authError && <p className="text-rose-400 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage the movie catalogue.</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
          <ShieldCheck size={16} /> Admin
        </span>
      </div>

      {/* Form */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            {editingId ? <Pencil size={18} className="text-emerald-400" /> : <Plus size={18} className="text-emerald-400" />}
            {editingId ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
            >
              <X size={16} /> Cancel edit
            </button>
          )}
        </div>
        <form onSubmit={submitForm} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-300 mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Movie title"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Genre</label>
            <input
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              placeholder="e.g. Action / Sci-Fi"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Duration</label>
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 2h 30m"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-300 mb-1.5">Poster URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://image.tmdb.org/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-300 mb-1.5">Description</label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Synopsis..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition resize-none"
            />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between">
            {msg && <p className="text-sm text-emerald-400">{msg}</p>}
            <button
              type="submit"
              disabled={saving}
              className="ml-auto bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 disabled:text-slate-400 font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : editingId ? 'Update Movie' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <h2 className="text-lg font-semibold text-white mb-4">Current Movies ({movies.length})</h2>
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p>Loading movies...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-rose-400 mb-1">Couldn't load movies.</p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
          <Film size={32} className="mx-auto mb-3 text-slate-600" />
          <p>No movies yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {movies.map((m) => (
            <div
              key={m._id}
              className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center gap-4"
            >
              <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <MoviePoster movie={m} className="w-full h-full" iconSize={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{m.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Star size={12} className="text-emerald-400" /> {m.genre}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} className="text-emerald-400" /> {m.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(m)}
                  className="p-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => remove(m._id, m.title)}
                  className="p-2 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
