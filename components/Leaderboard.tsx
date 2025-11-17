'use client';

import { useState, useEffect } from 'react';
import { subscribeTournamentScores } from '@/lib/firestore';
import { Score, Tournament, LeaderboardEntry } from '@/lib/types';
import { calculateAllPlayerScores, calculateLeaderboard, formatScore } from '@/utils/calculateScore';
import { getRankColorClass } from '@/utils/formatLeaderboard';

interface LeaderboardProps {
  tournament: Tournament;
}

export default function Leaderboard({ tournament }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'front9' | 'back9' | 'completed'>('all');

  useEffect(() => {
    // Subscribe to real-time score updates
    const unsubscribe = subscribeTournamentScores(tournament.id, (updatedScores) => {
      setScores(updatedScores);

      // Calculate leaderboard
      const playerScores = calculateAllPlayerScores(
        tournament.players.map(p => ({ uid: p.uid, name: p.name })),
        updatedScores
      );

      const newLeaderboard = calculateLeaderboard(playerScores);
      setLeaderboard(newLeaderboard);
    });

    return () => unsubscribe();
  }, [tournament.id]);

  const filteredLeaderboard = leaderboard.filter(entry => {
    switch (filter) {
      case 'front9':
        return entry.front9 !== undefined && entry.thru >= 9;
      case 'back9':
        return entry.back9 !== undefined && entry.thru >= 18;
      case 'completed':
        return entry.thru === tournament.holes;
      default:
        return true;
    }
  });

  return (
    <div className="bg-cream rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-sage-900">Leaderboard</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-sage-700">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 border border-sage-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
          >
            <option value="all">All</option>
            <option value="front9">Front 9</option>
            <option value="back9">Back 9</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredLeaderboard.length === 0 ? (
        <div className="text-center py-8 text-sage-600">
          <p className="text-lg mb-2">No scores yet</p>
          <p className="text-sm">Players will appear here as they submit their scores</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLeaderboard.map((entry, index) => {
            const isLeader = entry.rank === 1;
            const showRankChange = index > 0 && entry.rank !== filteredLeaderboard[index - 1].rank;

            return (
              <div
                key={entry.playerId}
                className={`p-4 rounded-xl border-2 transition ${getRankColorClass(entry.rank)}`}
              >
                <div className="flex items-center justify-between">
                  {/* Rank & Player Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center min-w-[3rem]">
                      <div className={`text-2xl font-bold ${isLeader ? 'text-accent' : 'text-sage-800'}`}>
                        {entry.rank}
                        {isLeader && <span className="ml-1">🏆</span>}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-sage-900">
                        {entry.playerName}
                      </div>
                      <div className="text-sm text-sage-600">
                        Thru {entry.thru} {entry.thru === tournament.holes ? '(F)' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-6">
                    {/* Front 9 / Back 9 */}
                    {filter === 'all' && (
                      <div className="hidden md:flex gap-4 text-sm text-sage-700">
                        {entry.front9 !== undefined && (
                          <div>
                            <span className="font-medium">F9:</span>{' '}
                            <span className="font-semibold">{formatScore(entry.front9)}</span>
                          </div>
                        )}
                        {entry.back9 !== undefined && (
                          <div>
                            <span className="font-medium">B9:</span>{' '}
                            <span className="font-semibold">{formatScore(entry.back9)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Total Score */}
                    <div className="text-center min-w-[5rem]">
                      <div
                        className={`text-3xl font-bold ${
                          entry.score < 0
                            ? 'text-sage-600'
                            : entry.score > 0
                            ? 'text-accent'
                            : 'text-sage-900'
                        }`}
                      >
                        {formatScore(entry.score)}
                      </div>
                      <div className="text-xs text-sage-600">{entry.totalStrokes} strokes</div>
                    </div>

                    {/* Last Hole */}
                    {entry.lastHole && (
                      <div className="hidden lg:block text-sm">
                        <div className="text-sage-600">Hole {entry.lastHole.hole}</div>
                        <div className="font-semibold">
                          {entry.lastHole.strokes}{' '}
                          <span
                            className={`text-xs ${
                              entry.lastHole.relativeToPar < 0
                                ? 'text-sage-600'
                                : entry.lastHole.relativeToPar > 0
                                ? 'text-accent'
                                : 'text-sage-700'
                            }`}
                          >
                            ({formatScore(entry.lastHole.relativeToPar)})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-sage-200">
        <div className="text-sm text-sage-700">
          <div className="font-semibold mb-2">Score Legend:</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-eagle border border-sage-400"></div>
              <span>Eagle or better</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-birdie border border-sage-400"></div>
              <span>Birdie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-par border border-sage-300"></div>
              <span>Par</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-bogey border border-accent"></div>
              <span>Bogey</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-double-bogey border border-accent"></div>
              <span>Double+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
