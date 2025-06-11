import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MovieGrid } from '@/components/MovieGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <MovieGrid />
        </main>
      </div>
    </div>
  );
}
