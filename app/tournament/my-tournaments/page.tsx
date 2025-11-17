'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getUserTournaments } from '@/lib/firestore';
import { Tournament } from '@/lib/types';
import Link from 'next/link';

export default function MyTournamentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const fetchTournaments = async () => {
      try {
        const userTournaments = await getUserTournaments(user.uid);
        setTournaments(userTournaments);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-900 via-sage-800 to-olive-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-cream mb-2">Loading...</div>
          <div className="text-sage-300">Fetching your tournaments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-900 via-sage-800 to-olive-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cream mb-2">My Tournaments</h1>
          <p className="text-sage-300">All tournaments you've created or joined</p>
        </div>

        {tournaments.length === 0 ? (
          <div className="bg-cream rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">⛳</div>
            <h2 className="text-2xl font-bold mb-4">No Tournaments Yet</h2>
            <p className="text-sage-700 mb-6">
              You haven't created or joined any tournaments yet.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/tournament/create"
                className="bg-sage-700 hover:bg-sage-600 text-cream font-bold py-3 px-6 rounded-lg transition"
              >
                Create Tournament
              </Link>
              <Link
                href="/tournament/join"
                className="bg-sage-600 hover:bg-sage-500 text-cream font-bold py-3 px-6 rounded-lg transition"
              >
                Join Tournament
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => {
              const isHost = tournament.hostId === user?.uid;
              const statusColor =
                tournament.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : tournament.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800';

              return (
                <Link
                  key={tournament.id}
                  href={`/tournament/${tournament.id}`}
                  className="bg-cream rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{tournament.name}</h3>
                      <p className="text-sm text-sage-700">{tournament.courseName}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                    >
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Format:</span>
                      <span className="text-sage-700">
                        {tournament.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Players:</span>
                      <span className="text-sage-700">{tournament.players.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Date:</span>
                      <span className="text-sage-700">
                        {new Date(tournament.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isHost && (
                    <div className="pt-3 border-t border-sage-200">
                      <span className="text-xs font-semibold text-sage-600 flex items-center gap-1">
                        <span>👑</span> You're the host
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
