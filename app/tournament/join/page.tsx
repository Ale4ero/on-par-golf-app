'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getTournamentByJoinCode, addPlayerToTournament } from '@/lib/firestore';

export default function JoinTournamentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/auth');
      return;
    }

    if (!joinCode) {
      setError('Please enter a join code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const tournament = await getTournamentByJoinCode(joinCode.toUpperCase());

      if (!tournament) {
        setError('Tournament not found. Please check the code and try again.');
        return;
      }

      if (tournament.status === 'completed') {
        setError('This tournament has already been completed.');
        return;
      }

      // Check if user is already in the tournament
      const isAlreadyJoined = tournament.players.some(p => p.uid === user.uid);

      if (isAlreadyJoined) {
        // Already joined, just redirect
        router.push(`/tournament/${tournament.id}`);
        return;
      }

      // Add player to tournament
      await addPlayerToTournament(tournament.id, {
        uid: user.uid,
        name: user.name,
        handicap: user.handicap,
        status: 'joined',
      });

      router.push(`/tournament/${tournament.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join tournament');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-olive-100 via-cream to-sage-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream rounded-2xl shadow-lg p-8 border border-sage-200">
          <h2 className="text-2xl font-bold text-sage-900 mb-4 text-center">Sign In Required</h2>
          <p className="text-sage-700 mb-6 text-center">
            You must be signed in to join a tournament.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="w-full bg-sage-700 hover:bg-sage-600 text-cream font-bold py-2 px-6 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-100 via-cream to-sage-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-cream rounded-2xl shadow-lg p-8 border border-sage-200">
        <h2 className="text-3xl font-bold text-sage-900 mb-2 text-center">Join Tournament</h2>
        <p className="text-sage-700 mb-6 text-center">
          Enter the tournament code provided by the host
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="joinCode" className="block text-sm font-medium text-sage-800 mb-2">
              Tournament Code
            </label>
            <input
              type="text"
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
              maxLength={6}
              className="w-full px-4 py-3 text-2xl text-center font-bold border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 uppercase bg-white"
              placeholder="ABC123"
              autoFocus
            />
            <p className="mt-2 text-sm text-sage-600 text-center">
              6-character code (not case sensitive)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-700 hover:bg-sage-600 text-cream font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join Tournament'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sage-700 hover:text-sage-600 font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
