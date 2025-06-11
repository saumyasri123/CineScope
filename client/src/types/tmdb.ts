export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  original_title: string;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBMovieDetails extends Omit<TMDBMovie, 'genre_ids'> {
  genres: TMDBGenre[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  imdb_id: string | null;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface TMDBTVDetails extends Omit<TMDBTVShow, 'genre_ids'> {
  genres: TMDBGenre[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  tagline: string;
  episode_run_time: number[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

export type MediaType = 'movie' | 'tv';
export type SortBy = 'popularity' | 'release_date' | 'vote_average' | 'title';
export type StreamingPlatform = 'all' | 'netflix' | 'prime' | 'disney' | 'hulu' | 'hbo';
