import { useTMDB } from '@/contexts/TMDBContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MediaType, SortBy } from '@/types/tmdb';

// Static genre lists for demo purposes
const movieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  // ...add more as needed
];
const tvGenres = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  // ...add more as needed
];

const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'release_date', label: 'Release Date' },
  { value: 'vote_average', label: 'Rating' },
  { value: 'title', label: 'A-Z' },
] as const;

// Use TMDB provider IDs!
const platformOptions = [
  { value: 'all', label: 'All Platforms' },
  { value: '8', label: 'Netflix' },
  { value: '9', label: 'Amazon Prime' },
  { value: '337', label: 'Disney+' },
  { value: '15', label: 'Hulu' },
  { value: '384', label: 'HBO Max' },
  { value: '119', label: 'Zee5' },
  { value: '237', label: 'SonyLIV' },
] as const;

export function Sidebar() {
  const {
    mediaType,
    setMediaType,
    sortBy,
    setSortBy,
    selectedPlatform,
    setSelectedPlatform,
    selectedGenres,
    setSelectedGenres,
  } = useTMDB();

  // Use static genres
  const currentGenres = mediaType === 'movie' ? movieGenres : tvGenres;

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(
      selectedGenres.includes(genreId)
        ? selectedGenres.filter(id => id !== genreId)
        : [...selectedGenres, genreId]
    );
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 p-6 sticky top-16 h-screen overflow-y-auto">
      {/* Filters Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Filters</h3>

        {/* Sort By */}
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </Label>
          <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Streaming Platform */}
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platform
          </Label>
          <Select
            value={selectedPlatform}
            onValueChange={setSelectedPlatform}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Type */}
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </Label>
          <div className="flex space-x-2">
            <Button
              variant={mediaType === 'movie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMediaType('movie')}
              className="flex-1 text-gray-900 dark:text-gray-100"
            >
              Movies
            </Button>
            <Button
              variant={mediaType === 'tv' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMediaType('tv')}
              className="flex-1 text-gray-900 dark:text-gray-100"
            >
              TV Shows
            </Button>
          </div>
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Genres</h3>
        <div className="space-y-2">
          {currentGenres.map((genre: { id: number; name: string }) => (
            <div key={genre.id} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre.id}`}
                checked={selectedGenres.includes(genre.id)}
                onCheckedChange={() => handleGenreToggle(genre.id)}
                className="accent-gray-900 dark:accent-gray-100"
              />
              <Label
                htmlFor={`genre-${genre.id}`}
                className="text-sm text-gray-700 dark:text-gray-100 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              >
                {genre.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}