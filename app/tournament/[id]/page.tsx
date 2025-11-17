'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Leaderboard from '@/components/Leaderboard';
import ScoreCard from '@/components/ScoreCard';
import { subscribeTournament, updateTournament, addPlayerToTournament } from '@/lib/firestore';
import { Tournament } from '@/lib/types';
import { getMockCourse } from '@/lib/mockData';

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const tournamentId = params?.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'scorecard'>('leaderboard');
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (!tournamentId) return;

    // Subscribe to tournament updates
    const unsubscribe = subscribeTournament(tournamentId, (updatedTournament) => {
      setTournament(updatedTournament);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tournamentId]);

  const isHost = user && tournament && user.uid === tournament.hostId;
  const isPlayer = user && tournament && tournament.players.some(p => p.uid === user.uid);

  const handleStartTournament = async () => {
    if (!tournament || !isHost) return;

    try {
      await updateTournament(tournament.id, { status: 'active' });
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };

  const handleCompleteTournament = async () => {
    if (!tournament || !isHost) return;

    const confirmed = confirm('Are you sure you want to complete this tournament?');
    if (!confirmed) return;

    try {
      await updateTournament(tournament.id, { status: 'completed' });
    } catch (error) {
      console.error('Error completing tournament:', error);
    }
  };

  const copyJoinCode = () => {
    if (!tournament?.joinCode) return;

    navigator.clipboard.writeText(tournament.joinCode);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const course = tournament ? getMockCourse(tournament.courseId) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-900 via-sage-800 to-olive-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-cream mb-2">Loading tournament...</div>
          <div className="text-sage-300">Please wait</div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-900 via-sage-800 to-olive-900 flex items-center justify-center p-4">
        <div className="bg-cream rounded-2xl shadow-lg p-8 max-w-md text-center border border-sage-300">
          <h2 className="text-2xl font-bold text-sage-900 mb-4">Tournament Not Found</h2>
          <p className="text-sage-700 mb-6">The tournament you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-sage-700 hover:bg-sage-600 text-cream font-bold py-2 px-6 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-900 via-sage-800 to-olive-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tournament Header */}
        <div className="bg-cream rounded-2xl shadow-lg p-6 mb-6 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-sage-900 mb-2">{tournament.name}</h1>
              <div className="space-y-1 text-sage-700">
                <p>
                  <span className="font-semibold">Course:</span> {tournament.courseName}
                </p>
                <p>
                  <span className="font-semibold">Format:</span>{' '}
                  {tournament.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                <p>
                  <span className="font-semibold">Holes:</span> {tournament.holes}
                </p>
                <p>
                  <span className="font-semibold">Players:</span> {tournament.players.length}
                </p>
                <p>
                  <span className="font-semibold">Start Date:</span>{' '}
                  {new Date(tournament.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Status Badge */}
              <div
                className={`px-4 py-2 rounded-lg text-center font-semibold ${
                  tournament.status === 'pending'
                    ? 'bg-accent/20 text-sage-900 border border-accent'
                    : tournament.status === 'active'
                    ? 'bg-sage-100 text-sage-900 border border-sage-400'
                    : 'bg-olive-200 text-sage-900 border border-olive-400'
                }`}
              >
                {tournament.status === 'pending' && 'Pending'}
                {tournament.status === 'active' && 'Active'}
                {tournament.status === 'completed' && 'Completed'}
              </div>

              {/* Join Code */}
              {tournament.joinCode && tournament.status !== 'completed' && (
                <div className="bg-sage-50 rounded-lg p-3">
                  <div className="text-xs text-sage-700 mb-1">Join Code:</div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-sage-900">{tournament.joinCode}</div>
                    <button
                      onClick={copyJoinCode}
                      className="text-sm bg-sage-700 hover:bg-sage-600 text-cream px-3 py-1 rounded transition"
                    >
                      {copying ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Host Actions */}
              {isHost && (
                <div className="flex flex-col gap-2">
                  {tournament.status === 'pending' && (
                    <button
                      onClick={handleStartTournament}
                      className="bg-sage-700 hover:bg-sage-600 text-cream font-bold py-2 px-4 rounded-lg transition"
                    >
                      Start Tournament
                    </button>
                  )}
                  {tournament.status === 'active' && (
                    <button
                      onClick={handleCompleteTournament}
                      className="bg-sage-600 hover:bg-sage-700 text-cream font-bold py-2 px-4 rounded-lg transition"
                    >
                      Complete Tournament
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        {isPlayer && tournament.status === 'active' && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition border ${
                activeTab === 'leaderboard'
                  ? 'bg-sage-700 text-cream border-sage-700'
                  : 'bg-cream text-sage-800 hover:bg-sage-50 border-sage-200'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition border ${
                activeTab === 'scorecard'
                  ? 'bg-sage-700 text-cream border-sage-700'
                  : 'bg-cream text-sage-800 hover:bg-sage-50 border-sage-200'
              }`}
            >
              My Scorecard
            </button>
          </div>
        )}

        {/* Content */}
        <div>
          {activeTab === 'leaderboard' || !isPlayer || tournament.status !== 'active' ? (
            <Leaderboard tournament={tournament} />
          ) : (
            <ScoreCard
              tournamentId={tournament.id}
              courseId={tournament.courseId}
              totalHoles={tournament.holes}
              onScoreSubmitted={() => {
                // Optionally switch to leaderboard after score submission
                // setActiveTab('leaderboard');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
