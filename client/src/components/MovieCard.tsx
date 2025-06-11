import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'wouter';
import { tmdbApi } from '@/lib/tmdb';
import { TMDBMovie, TMDBTVShow } from '@/types/tmdb';

interface MovieCardProps {
  item: TMDBMovie | TMDBTVShow;
  mediaType: 'movie' | 'tv';
}

function isMovie(item: TMDBMovie | TMDBTVShow): item is TMDBMovie {
  return 'title' in item;
}

function getRandomPlatforms() {
  const platforms = [
    { name: 'Netflix', color: 'bg-red-600', letter: 'N' },
    { name: 'Amazon Prime', color: 'bg-blue-800', letter: 'P' },
    { name: 'Disney+', color: 'bg-blue-600', letter: 'D' },
    { name: 'HBO Max', color: 'bg-purple-600', letter: 'H' },
    { name: 'Hulu', color: 'bg-green-600', letter: 'H' },
    { name: 'Apple TV', color: 'bg-gray-800', letter: 'A' },
    { name: 'Zee5', color: 'bg-purple-700', letter: 'Z' },
    { name: 'SonyLIV', color: 'bg-green-700', letter: 'S' },
  ];
  
  const numPlatforms = Math.floor(Math.random() * 2) + 1; // 1-2 platforms
  const shuffled = platforms.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPlatforms);
}

export function MovieCard({ item, mediaType }: MovieCardProps) {
  const title = isMovie(item) ? item.title : item.name;
  const releaseDate = isMovie(item) ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'TBA';
  const platforms = getRandomPlatforms();

  return (
    <Link href={`/${mediaType}/${item.id}`}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-lg">
          {/* Movie Poster */}
          <div className="relative">
            <img
              src={tmdbApi.getImageUrl(item.poster_path)}
              alt={`${title} poster`}
              className="w-full h-80 object-cover group-hover:opacity-90 transition-opacity duration-300"
              loading="lazy"
            />
            
            {/* Rating Badge */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-white">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Platform Icons */}
            <div className="absolute bottom-2 left-2 flex space-x-1">
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 ${platform.color} rounded flex items-center justify-center`}
                  title={platform.name}
                >
                  <span className="text-white text-xs font-bold">{platform.letter}</span>
                </div>
              ))}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-2">{title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span>{year}</span>
                  {isMovie(item) && (
                    <>
                      <span>•</span>
                      <span>Movie</span>
                    </>
                  )}
                  {!isMovie(item) && (
                    <>
                      <span>•</span>
                      <span>TV Show</span>
                    </>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-400 line-clamp-2">
                  {item.overview}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
