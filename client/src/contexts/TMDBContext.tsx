import { createContext, useContext, useState, ReactNode } from 'react';
import { MediaType, SortBy, StreamingPlatform } from '@/types/tmdb';
// -import { useMovieGenres } from '@/hooks/useTMDB';
interface TMDBContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenres: number[];
  setSelectedGenres: (genres: number[]) => void;
  mediaType: MediaType;
  setMediaType: (type: MediaType) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  platform: StreamingPlatform;
  setPlatform: (platform: StreamingPlatform) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
}

const TMDBContext = createContext<TMDBContextType | undefined>(undefined);

export function TMDBProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');
  const [platform, setPlatform] = useState<StreamingPlatform>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const value = {
    searchQuery,
    setSearchQuery,
    selectedGenres,
    setSelectedGenres,
    mediaType,
    setMediaType,
    sortBy,
    setSortBy,
    platform,
    setPlatform,
    selectedPlatform,
    setSelectedPlatform,
  };

  return (
    <TMDBContext.Provider value={value}>
      {children}
    </TMDBContext.Provider>
  );
}

export function useTMDB() {
  const context = useContext(TMDBContext);
  if (context === undefined) {
    throw new Error('useTMDB must be used within a TMDBProvider');
  }
  return context;
}