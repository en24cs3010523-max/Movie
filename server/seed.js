import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';

const MONGO_URL = process.env.MONGO_URL;

const seedMovies = [
  {
    title: 'Dune: Part Two',
    genre: 'Sci-Fi / Adventure',
    duration: '2h 46m',
    image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbL9anodQPe2iGfh5yJvS.jpg',
    desc: 'Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family.',
  },
  {
    title: 'Oppenheimer',
    genre: 'Drama / History',
    duration: '3h 00m',
    image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCgc0T8K7N5K9R3p7R6y.jpg',
    desc: 'The story of J. Robert Oppenheimer and his role in developing the atomic bomb.',
  },
  {
    title: 'Interstellar',
    genre: 'Sci-Fi / Drama',
    duration: '2h 49m',
    image: 'https://image.tmdb.org/t/p/w500/gEU2QbiE9L8gY5kZ7Z1Y7R8p6aX.jpg',
    desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
  },
  {
    title: 'The Dark Knight',
    genre: 'Action / Crime',
    duration: '2h 32m',
    image: 'https://image.tmdb.org/t/p/w500/qJ2tW6Q7p8r9S0aB1cD3eF4gH5iJ.jpg',
    desc: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.',
  },
  {
    title: 'Inception',
    genre: 'Sci-Fi / Thriller',
    duration: '2h 28m',
    image: 'https://image.tmdb.org/t/p/w500/9gk7ad6g4f8h9j0k1l2m3n4o5p6.jpg',
    desc: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
  },
  {
    title: 'The Batman',
    genre: 'Action / Mystery',
    duration: '2h 56m',
    image: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36F8o9lJ0w1a2b3c4d5e6.jpg',
    desc: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
  },
];

async function run() {
  if (!MONGO_URL) {
    console.error('MONGO_URL not set');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URL);
  console.log('Connected. Seeding movies...');
  const count = await Movie.countDocuments();
  if (count === 0) {
    await Movie.insertMany(seedMovies);
    console.log('Seeded 6 movies.');
  } else {
    console.log(`Movies already exist (${count}). Skipping seed.`);
  }
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
