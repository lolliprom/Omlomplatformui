import { Outlet } from 'react-router';
import { BottomNav } from '../components/bottom-nav';
import { Toaster } from '../components/ui/sonner';

export default function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <main className="pb-20 max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
}
