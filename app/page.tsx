'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllTournaments } from '@/lib/firestore';
import { Tournament } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const allTournaments = await getAllTournaments();
        setTournaments(allTournaments);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="bg-gradient-to-br from-sage-900 via-sage-800 to-olive-900 min-h-[calc(100vh-73px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome and Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div>
            {user ? (
              <h2 className="text-2xl font-bold text-cream">
                Welcome, {user.name}
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-cream">
                Welcome
              </h2>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href="/tournament/create"
              className="bg-cream hover:bg-sage-100 text-sage-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <span>🏆</span>
              <span>Create Tournament</span>
            </Link>
            <Link
              href="/tournament/join"
              className="bg-[var(--accent)] hover:brightness-90 text-cream font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <span>⛳</span>
              <span>Join Tournament</span>
            </Link>
          </div>
        </div>

        {/* Tournaments Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-cream mb-6">Tournaments</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-sage-300">Loading tournaments...</div>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="bg-cream rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">⛳</div>
              <h3 className="text-2xl font-bold mb-4">No Tournaments Yet</h3>
              <p className="text-sage-700 mb-6">
                Be the first to create a tournament!
              </p>
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
    </div>
  );
}
