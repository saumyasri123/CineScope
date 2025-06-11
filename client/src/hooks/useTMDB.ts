import { useInfiniteQuery } from '@tanstack/react-query';
import { tmdbApi } from '@/lib/tmdb';
import type { MediaType, SortBy, TMDBMovie, TMDBTVShow } from '@/types/tmdb';

// Extend types for providers
type MovieWithProviders = TMDBMovie & { providers: number[] };
type TVShowWithProviders = TMDBTVShow & { providers: number[] };

type TMDBResponseWithProviders<T> = {
  page: number;
  results: (T & { providers: number[] })[];
  total_pages: number;
  total_results: number;
};
export function useInfiniteDiscover(
  mediaType: MediaType,
  sortBy: SortBy,
  genreIds: number[],
  searchQuery?: string,
  selectedPlatform?: string // <-- add this
) {
  return useInfiniteQuery<
    TMDBResponseWithProviders<MovieWithProviders> | TMDBResponseWithProviders<TVShowWithProviders>
  >({
    queryKey: ['/api/tmdb/discover', mediaType, sortBy, genreIds, searchQuery, selectedPlatform],
    queryFn: async ({ pageParam = 1 }) => {
      const page = pageParam as number;
      const genreString = genreIds.length > 0 ? genreIds.join(',') : undefined;

      let response;
      if (searchQuery && searchQuery.length > 2) {
        response = mediaType === 'movie'
          ? await tmdbApi.searchMovies(searchQuery, page)
          : await tmdbApi.searchTVShows(searchQuery, page);
      } else {
        const sortByMap: Record<SortBy, string> = {
          'popularity': `${mediaType === 'movie' ? 'popularity' : 'popularity'}.desc`,
          'release_date': `${mediaType === 'movie' ? 'release_date' : 'first_air_date'}.desc`,
          'vote_average': 'vote_average.desc',
          'title': `${mediaType === 'movie' ? 'title' : 'name'}.asc`,
        };

        // Add provider filter if selected
        const params: Record<string, string | number> = {
          page,
          sort_by: sortByMap[sortBy],
          ...(genreString && { with_genres: genreString }),
        };
        if (selectedPlatform && selectedPlatform !== 'all') {
          params.with_watch_providers = selectedPlatform;
          params.watch_region = 'IN'; // or your country code
        }

        response = mediaType === 'movie'
          ? await tmdbApi.discoverMovies(params)
          : await tmdbApi.discoverTVShows(params);
      }

      // Attach providers to each item
      const resultsWithProviders = await Promise.all(
        response.results.map(async (item: TMDBMovie | TMDBTVShow) => {
          try {
            const providerData = await tmdbApi.getWatchProviders(mediaType, item.id);
            const country = providerData.results?.IN || providerData.results?.US;
            const providers = country?.flatrate?.map((prov: any) => prov.provider_id) || [];
            return { ...item, providers };
          } catch {
            return { ...item, providers: [] };
          }
        })
      );

      return {
        ...response,
        results: resultsWithProviders,
      } as TMDBResponseWithProviders<MovieWithProviders> | TMDBResponseWithProviders<TVShowWithProviders>;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}