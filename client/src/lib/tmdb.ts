import { TMDBResponse, TMDBMovie, TMDBTVShow, TMDBGenresResponse, TMDBMovieDetails, TMDBTVDetails, TMDBCredits, MediaType, SortBy } from '@/types/tmdb';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  console.warn('TMDB API key not found. Please set VITE_TMDB_API_KEY environment variable.');
}

class TMDBApi {
  private async request<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', TMDB_API_KEY);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/movie/popular', { page });
  }

  // Get popular TV shows
  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return this.request<TMDBResponse<TMDBTVShow>>('/tv/popular', { page });
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/search/movie', { query, page });
  }

  // Search TV shows
  async searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return this.request<TMDBResponse<TMDBTVShow>>('/search/tv', { query, page });
  }

  // Get movie genres
  async getMovieGenres(): Promise<TMDBGenresResponse> {
    return this.request<TMDBGenresResponse>('/genre/movie/list');
  }

  // Get TV genres
  async getTVGenres(): Promise<TMDBGenresResponse> {
    return this.request<TMDBGenresResponse>('/genre/tv/list');
  }

  //Get Trailer
  async getMovieVideos(movieId: number): Promise<{ results: Array<{ key: string; site: string; type: string; name: string }> }> {
    return this.request(`/movie/${movieId}/videos`);
  }

  // Discover movies with filters
  async discoverMovies(params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    primary_release_year?: number;
  } = {}): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', params);
  }

  // Discover TV shows with filters
  async discoverTVShows(params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    first_air_date_year?: number;
  } = {}): Promise<TMDBResponse<TMDBTVShow>> {
    return this.request<TMDBResponse<TMDBTVShow>>('/discover/tv', params);
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.request<TMDBMovieDetails>(`/movie/${movieId}`);
  }

  // Get TV show details
  async getTVDetails(tvId: number): Promise<TMDBTVDetails> {
    return this.request<TMDBTVDetails>(`/tv/${tvId}`);
  }

  // Get movie credits
  async getMovieCredits(movieId: number): Promise<TMDBCredits> {
    return this.request<TMDBCredits>(`/movie/${movieId}/credits`);
  }

  // Get TV credits
  async getTVCredits(tvId: number): Promise<TMDBCredits> {
    return this.request<TMDBCredits>(`/tv/${tvId}/credits`);
  }

  // Get image URL
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  // Get backdrop URL
  getBackdropUrl(path: string | null, size: string = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  // Get TV Shows Trailers
  async getTVShowVideos(tvId: number): Promise<{ results: Array<{ key: string; site: string; type: string; name: string }> }> {
    return this.request(`/tv/${tvId}/videos`);
  }

  async getWatchProviders(mediaType: 'movie' | 'tv', id: number) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const res = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/watch/providers?api_key=${apiKey}`
    );
    if (!res.ok) throw new Error('Failed to fetch watch providers');
    return res.json();
  }

}

export const tmdbApi = new TMDBApi();
