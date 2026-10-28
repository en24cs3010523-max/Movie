import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: String, default: 'Unknown' },
    duration: { type: String, default: 'N/A' },
    image: { type: String, default: '' },
    desc: { type: String, default: '' },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
