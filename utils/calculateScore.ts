import { Score, PlayerScore, HoleScore, LeaderboardEntry } from '@/lib/types';

/**
 * Calculate a player's total score relative to par
 */
export const calculatePlayerScore = (
  playerId: string,
  playerName: string,
  scores: Score[]
): PlayerScore => {
  const playerScores = scores.filter(s => s.playerId === playerId);

  const holes: HoleScore[] = playerScores.map(s => ({
    hole: s.hole,
    strokes: s.strokes,
    par: s.par,
    relativeToPar: s.strokes - s.par,
  }));

  const totalStrokes = holes.reduce((sum, h) => sum + h.strokes, 0);
  const totalPar = holes.reduce((sum, h) => sum + h.par, 0);
  const score = totalStrokes - totalPar;

  // Calculate front 9 and back 9
  const front9Holes = holes.filter(h => h.hole <= 9);
  const back9Holes = holes.filter(h => h.hole > 9);

  const front9 = front9Holes.length > 0
    ? front9Holes.reduce((sum, h) => sum + h.strokes, 0) -
      front9Holes.reduce((sum, h) => sum + h.par, 0)
    : undefined;

  const back9 = back9Holes.length > 0
    ? back9Holes.reduce((sum, h) => sum + h.strokes, 0) -
      back9Holes.reduce((sum, h) => sum + h.par, 0)
    : undefined;

  return {
    playerId,
    playerName,
    totalStrokes,
    totalPar,
    score,
    holes,
    front9,
    back9,
  };
};

/**
 * Calculate all player scores for a tournament
 */
export const calculateAllPlayerScores = (
  players: { uid: string; name: string }[],
  scores: Score[]
): PlayerScore[] => {
  return players.map(player =>
    calculatePlayerScore(player.uid, player.name, scores)
  );
};

/**
 * Get the score description (birdie, par, bogey, etc.)
 */
export const getScoreDescription = (relativeToPar: number): string => {
  if (relativeToPar <= -2) return 'eagle';
  if (relativeToPar === -1) return 'birdie';
  if (relativeToPar === 0) return 'par';
  if (relativeToPar === 1) return 'bogey';
  return 'double-bogey';
};

/**
 * Get the CSS class for a score
 */
export const getScoreClass = (relativeToPar: number): string => {
  const description = getScoreDescription(relativeToPar);
  return `text-${description} bg-${description}`;
};

/**
 * Format score relative to par (e.g., -2, E, +3)
 */
export const formatScore = (score: number): string => {
  if (score === 0) return 'E';
  if (score > 0) return `+${score}`;
  return `${score}`;
};

/**
 * Calculate leaderboard entries from player scores
 */
export const calculateLeaderboard = (playerScores: PlayerScore[]): LeaderboardEntry[] => {
  // Sort by score (lower is better)
  const sorted = [...playerScores].sort((a, b) => a.score - b.score);

  // Assign ranks
  const leaderboard: LeaderboardEntry[] = [];
  let currentRank = 1;

  sorted.forEach((ps, index) => {
    // Check if tied with previous player
    if (index > 0 && ps.score === sorted[index - 1].score) {
      // Use same rank as previous player
      currentRank = leaderboard[index - 1].rank;
    } else {
      currentRank = index + 1;
    }

    leaderboard.push({
      rank: currentRank,
      playerId: ps.playerId,
      playerName: ps.playerName,
      totalStrokes: ps.totalStrokes,
      totalPar: ps.totalPar,
      score: ps.score,
      thru: ps.holes.length,
      front9: ps.front9,
      back9: ps.back9,
      lastHole: ps.holes.length > 0 ? ps.holes[ps.holes.length - 1] : undefined,
    });
  });

  return leaderboard;
};

/**
 * Get rank suffix (1st, 2nd, 3rd, 4th, etc.)
 */
export const getRankSuffix = (rank: number): string => {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
};
