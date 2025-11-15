'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="bg-sage-900 dark:bg-sage-950 text-cream shadow-md border-b border-sage-800 dark:border-sage-900">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-sage-300 dark:hover:text-sage-200 transition">
            <span className="text-3xl">⛳</span>
            <span>On Par</span>
          </Link>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            {loading ? (
              <div className="text-sm">Loading...</div>
            ) : user ? (
              <>
                <Link href="/profile" className="hover:text-sage-300 transition font-medium">
                  {user.name}
                </Link>
                <Link href="/tournament/my-tournaments" className="hover:text-sage-300 transition font-medium">
                  My Tournaments
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-sage-700 hover:bg-sage-600 px-5 py-2 rounded-lg transition font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-sage-700 hover:bg-sage-600 px-5 py-2 rounded-lg transition font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
