import { LeaderboardEntry } from '@/lib/types';
import { formatScore } from './calculateScore';

/**
 * Format leaderboard data for display
 */
export const formatLeaderboardDisplay = (
  entries: LeaderboardEntry[]
): Array<{
  rank: string;
  player: string;
  score: string;
  thru: string;
  totalStrokes: number;
  front9?: string;
  back9?: string;
}> => {
  return entries.map(entry => ({
    rank: `${entry.rank}`,
    player: entry.playerName,
    score: formatScore(entry.score),
    thru: `${entry.thru}`,
    totalStrokes: entry.totalStrokes,
    front9: entry.front9 !== undefined ? formatScore(entry.front9) : '-',
    back9: entry.back9 !== undefined ? formatScore(entry.back9) : '-',
  }));
};

/**
 * Filter leaderboard by various criteria
 */
export const filterLeaderboard = (
  entries: LeaderboardEntry[],
  filter: 'all' | 'front9' | 'back9' | 'completed'
): LeaderboardEntry[] => {
  switch (filter) {
    case 'front9':
      return entries.filter(e => e.front9 !== undefined);
    case 'back9':
      return entries.filter(e => e.back9 !== undefined);
    case 'completed':
      return entries.filter(e => e.thru === 18);
    default:
      return entries;
  }
};

/**
 * Group leaderboard entries by rank (for tie handling)
 */
export const groupLeaderboardByRank = (
  entries: LeaderboardEntry[]
): Map<number, LeaderboardEntry[]> => {
  const grouped = new Map<number, LeaderboardEntry[]>();

  entries.forEach(entry => {
    const existing = grouped.get(entry.rank) || [];
    grouped.set(entry.rank, [...existing, entry]);
  });

  return grouped;
};

/**
 * Get color class for rank
 */
export const getRankColorClass = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'bg-accent/20 text-sage-900 border-accent';
    case 2:
      return 'bg-sage-100 text-sage-900 border-sage-300';
    case 3:
      return 'bg-olive-200 text-sage-900 border-olive-400';
    default:
      return 'bg-white text-sage-800 border-sage-200';
  }
};
