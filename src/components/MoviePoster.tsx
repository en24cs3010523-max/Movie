import { useState } from 'react';
import { Film } from 'lucide-react';
import type { Movie } from '@/types';

interface MoviePosterProps {
  movie: Pick<Movie, 'image' | 'title'>;
  className?: string;
  imgClassName?: string;
  iconSize?: number;
}

// Renders a movie poster with a graceful placeholder if the image URL is
// missing or fails to load — never leaves a blank card.
export default function MoviePoster({
  movie,
  className = '',
  imgClassName = '',
  iconSize = 40,
}: MoviePosterProps) {
  const [failed, setFailed] = useState(false);
  const showImage = movie.image && !failed;

  return (
    <div className={`overflow-hidden bg-slate-800 relative ${className}`}>
      {showImage ? (
        <img
          src={movie.image}
          alt={movie.title}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-600">
          <Film size={iconSize} />
        </div>
      )}
    </div>
  );
}
