import type { Movie } from '@/types';

// Local fallback used only if the API is completely unreachable (e.g. backend not started).
// Poster URLs are real Pexels photos so cards always render correctly.
export const fallbackMovies: Movie[] = [
  {
    _id: 'fallback-1',
    title: 'Dune: Part Two',
    genre: 'Sci-Fi / Adventure',
    duration: '2h 46m',
    image: 'https://images.pexels.com/photos/30218464/pexels-photo-30218464.jpeg?auto=compress&cs=tinysrgb&h=750&w=500',
    desc: "Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
  },
  {
    _id: 'fallback-2',
    title: 'Oppenheimer',
    genre: 'Drama / History',
    duration: '3h 00m',
    image: 'https://images.pexels.com/photos/35982173/pexels-photo-35982173.jpeg?auto=compress&cs=tinysrgb&h=750&w=500',
    desc: "The story of American scientist J. Robert Oppenheimer and his role in developing the atomic bomb during World War II, and the moral consequences that followed.",
  },
  {
    _id: 'fallback-3',
    title: 'Interstellar',
    genre: 'Sci-Fi / Drama',
    duration: '2h 49m',
    image: 'https://images.pexels.com/photos/7661409/pexels-photo-7661409.jpeg?auto=compress&cs=tinysrgb&h=750&w=500',
    desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes increasingly uninhabitable.",
  },
  {
    _id: 'fallback-4',
    title: 'The Dark Knight',
    genre: 'Action / Crime',
    duration: '2h 32m',
    image: 'https://images.pexels.com/photos/9824728/pexels-photo-9824728.jpeg?auto=compress&cs=tinysrgb&h=750&w=500',
    desc: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy and forces the hero to confront the thin line between justice and vigilantism.",
  },
  {
    _id: 'fallback-5',
    title: 'Inception',
    genre: 'Sci-Fi / Thriller',
    duration: '2h 28m',
    image: 'https://images.pexels.com/photos/20278554/pexels-photo-20278554.jpeg?auto=compress&cs=tinysrgb&h=750&w=500',
    desc: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
  },
  {
    _id: 'fallback-6',
    title: 'The Batman',
    genre: 'Action / Mystery',
    duration: '2h 56m',
    image: 'https://images.pexels.com/photos/22481866/pexels-photo-22481866.jpeg?auto=compress&cs=tinysrgb&h=750&w=500',
    desc: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence leads closer to home, he must forge new alliances and unmask the culprit.",
  },
];

export function findFallbackMovie(id: string): Movie | null {
  return fallbackMovies.find((m) => m._id === id) || null;
}
