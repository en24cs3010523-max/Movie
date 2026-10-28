import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/movies', movieRoutes);

// Start the server immediately so the API (with sample fallbacks) is always available.
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));

if (!MONGO_URL) {
  console.warn('MONGO_URL is not set. The API will serve sample movies only.');
} else {
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) =>
      console.warn('MongoDB connection failed — serving sample movies instead:', err.message)
    );
}
