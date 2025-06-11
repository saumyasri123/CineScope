import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { LoadingSpinner } from './LoadingSpinner';
import { useTMDB } from '@/contexts/TMDBContext';
import { useInfiniteDiscover } from '@/hooks/useTMDB';

type DiscoverPage = {
  results: any[];
  total_results: number;
};

export function MovieGrid() {
  // Add selectedPlatform to your destructure
  const { mediaType, sortBy, selectedGenres, searchQuery, selectedPlatform } = useTMDB();
  const { ref, inView } = useInView();

  // Pass selectedPlatform to useInfiniteDiscover
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteDiscover(mediaType, sortBy, selectedGenres, searchQuery, selectedPlatform);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading movies..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 text-lg font-semibold mb-2">
          Error loading content
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          {error.message}
        </div>
      </div>
    );
  }

  const allItems =
    (data?.pages as DiscoverPage[] | undefined)?.flatMap(page => page.results) || [];

  if (allItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          No {mediaType === 'movie' ? 'movies' : 'TV shows'} found
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Try adjusting your filters or search query
        </div>
      </div>
    );
  }

  const totalResults = (data?.pages[0] as DiscoverPage)?.total_results || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : `Popular ${mediaType === 'movie' ? 'Movies' : 'TV Shows'}`}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {allItems.length} of {totalResults.toLocaleString()} results
        </div>
      </div>

      {/* Movie Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {allItems.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <MovieCard item={item} mediaType={mediaType} />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading indicator for infinite scroll */}
      {hasNextPage && (
        <div ref={ref} className="mt-8">
          {isFetchingNextPage ? (
            <LoadingSpinner text="Loading more..." />
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}
    </div>
  );
}