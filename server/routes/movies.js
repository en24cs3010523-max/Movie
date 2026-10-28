import express from 'express';
import Movie from '../models/Movie.js';
import { sampleMovies, findSampleMovie, isDbConnected } from '../data/sampleMovies.js';

const router = express.Router();

// GET /api/movies — all movies (falls back to sample data if DB is unavailable)
router.get('/', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(200).json(sampleMovies);
  }
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    return res.json(movies);
  } catch (err) {
    console.error('Movie query failed, returning samples:', err.message);
    return res.status(200).json(sampleMovies);
  }
});

// GET /api/movies/:id — single movie (falls back to sample data)
router.get('/:id', async (req, res) => {
  if (!isDbConnected()) {
    const movie = findSampleMovie(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    return res.status(200).json(movie);
  }
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      const sample = findSampleMovie(req.params.id);
      if (sample) return res.json(sample);
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.json(movie);
  } catch (err) {
    console.error('Movie lookup failed:', err.message);
    const sample = findSampleMovie(req.params.id);
    if (sample) return res.status(200).json(sample);
    return res.status(200).json(findSampleMovie('sample-1') || sampleMovies[0]);
  }
});

// POST /api/movies — create
router.post('/', async (req, res) => {
  try {
    const { title, genre, duration, image, desc } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const movie = await Movie.create({ title, genre, duration, image, desc });
    return res.status(201).json(movie);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create movie', error: err.message });
  }
});

// PUT /api/movies/:id — update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Movie not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update movie', error: err.message });
  }
});

// DELETE /api/movies/:id — delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Movie not found' });
    return res.json({ message: 'Movie deleted', id: req.params.id });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to delete movie', error: err.message });
  }
});

export default router;
