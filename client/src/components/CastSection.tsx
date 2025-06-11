import { tmdbApi } from '@/lib/tmdb';
import { TMDBCastMember } from '@/types/tmdb';

interface CastSectionProps {
  cast: TMDBCastMember[];
}

export function CastSection({ cast }: CastSectionProps) {
  const displayCast = cast.slice(0, 10);

  if (displayCast.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Cast</h3>
        <div className="text-gray-500 dark:text-gray-400">No cast information available</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Cast</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {displayCast.map((actor) => (
          <div key={actor.id} className="flex-shrink-0 text-center">
            <img
              src={tmdbApi.getImageUrl(actor.profile_path, 'w185')}
              alt={actor.name}
              className="w-20 h-28 object-cover rounded-lg mb-2 bg-gray-200 dark:bg-gray-700"
              loading="lazy"
            />
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 w-20 truncate">
              {actor.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 w-20 truncate">
              {actor.character}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
