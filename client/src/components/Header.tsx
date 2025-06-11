import { useState, useCallback } from 'react';
import { Film, Moon, Sun, User, Search } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTMDB } from '@/contexts/TMDBContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { debounce } from 'lodash-es';

export function Header() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { searchQuery, setSearchQuery } = useTMDB();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    [setSearchQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              <Film className="inline mr-2 h-6 w-6" />
              CineScope
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search movies, TV shows, actors..."
                value={localQuery}
                onChange={handleSearchChange}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
