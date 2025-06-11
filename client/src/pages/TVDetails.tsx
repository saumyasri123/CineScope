import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Play, Plus, Check } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CastSection } from '@/components/CastSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tmdbApi } from '@/lib/tmdb';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

export default function TVDetails() {
  const { id } = useParams<{ id: string }>();
  const tvId = parseInt(id || '0');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const [show, setShow] = useState<any>(null);
  const [showLoading, setShowLoading] = useState(true);
  const [showError, setShowError] = useState<Error | null>(null);

  const [credits, setCredits] = useState<any>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setShowLoading(true);
    setShowError(null);
    tmdbApi.getTVDetails(tvId)
      .then(setShow)
      .catch(e => setShowError(e))
      .finally(() => setShowLoading(false));
  }, [tvId]);

  useEffect(() => {
    setCreditsLoading(true);
    tmdbApi.getTVCredits(tvId)
      .then(setCredits)
      .finally(() => setCreditsLoading(false));
  }, [tvId]);

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const data = await tmdbApi.getTVShowVideos(tvId);
        const trailer = data.results.find(
          (v: any) => v.site === "YouTube" && v.type === "Trailer"
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch {
        setTrailerKey(null);
      }
    }
    fetchTrailer();
  }, [tvId]);

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading TV show details..." />
      </div>
    );
  }

  if (showError || !show) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error loading TV show details
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {showError?.message || 'TV show not found'}
          </div>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900 border-gray-300 dark:text-gray-100 dark:border-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'TBA';
  const runtime = show.episode_run_time.length > 0 ? `${show.episode_run_time[0]} min/episode` : 'N/A';

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-900 border-gray-300 dark:text-gray-100 dark:border-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 md:h-96 overflow-hidden">
          <img
            src={tmdbApi.getBackdropUrl(show.backdrop_path)}
            alt={`${show.name} backdrop`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-900 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* TV Show Poster */}
          <div className="flex-shrink-0">
            <img
              src={tmdbApi.getImageUrl(show.poster_path, 'w500')}
              alt={`${show.name} poster`}
              className="w-64 h-96 object-cover rounded-lg shadow-xl bg-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* TV Show Info */}
          <div className="flex-1 pt-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-4">
                {show.tagline}
              </p>
            )}

            {/* Rating and Meta Info */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {show.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/ 10</span>
              </div>
              <span className="text-gray-600 dark:text-gray-300">{year}</span>
              <span className="text-gray-600 dark:text-gray-300">{runtime}</span>
              <Badge variant="secondary" className="bg-green-600 text-white">
                {show.status}
              </Badge>
            </div>

            {/* Show Details */}
            <div className="flex items-center space-x-6 mb-6 text-gray-600 dark:text-gray-300">
              <span>{show.number_of_seasons} Seasons</span>
              <span>{show.number_of_episodes} Episodes</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres.map((genre: { id: number; name: string }) => (
                <Badge key={genre.id} variant="outline" className="text-red-600 border-red-600">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg">
              {show.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowTrailer(true)}
                disabled={!trailerKey}
              >
                <Play className="h-5 w-5 mr-2" />
                Play Trailer
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleWatchlist}
                className={cn(
                  isInWatchlist ? 'border-green-600 text-green-600' : '',
                  'text-gray-900 border-gray-300 dark:text-gray-100 dark:border-gray-100'
                )}
              >
                {isInWatchlist ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>

            {/* Production Info */}
            {show.production_companies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Production Companies
                </h3>
                <div className="flex flex-wrap gap-4">
                  {show.production_companies.slice(0, 4).map((company: { id: number; name: string; logo_path?: string }) => (
                    <div key={company.id} className="flex items-center space-x-2">
                      {company.logo_path && (
                        <img
                          src={tmdbApi.getImageUrl(company.logo_path, 'w92')}
                          alt={company.name}
                          className="h-8 object-contain"
                        />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {showTrailer && trailerKey && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative w-full max-w-2xl aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-lg"
              />
              <button
                className="absolute top-2 right-2 text-white text-2xl"
                onClick={() => setShowTrailer(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Cast Section */}
        {!creditsLoading && credits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CastSection cast={credits.cast} />
          </motion.div>
        )}
      </div>
    </div>
  );
}