'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { submitScore, getPlayerScores, getCourse } from '@/lib/firestore';
import { getMockCourse } from '@/lib/mockData';
import { Course, Score } from '@/lib/types';
import { getScoreDescription } from '@/utils/calculateScore';

interface ScoreCardProps {
  tournamentId: string;
  courseId: string;
  totalHoles: number;
  onScoreSubmitted?: () => void;
}

export default function ScoreCard({
  tournamentId,
  courseId,
  totalHoles,
  onScoreSubmitted,
}: ScoreCardProps) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentHole, setCurrentHole] = useState(1);
  const [strokes, setStrokes] = useState<number>(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load course data
    const loadCourse = async () => {
      const mockCourse = getMockCourse(courseId);
      if (mockCourse) {
        setCourse(mockCourse);
      } else {
        const firestoreCourse = await getCourse(courseId);
        setCourse(firestoreCourse);
      }
    };

    loadCourse();
  }, [courseId]);

  useEffect(() => {
    // Load existing scores
    if (user) {
      loadScores();
    }
  }, [user, tournamentId]);

  const loadScores = async () => {
    if (!user) return;

    try {
      const playerScores = await getPlayerScores(tournamentId, user.uid);
      setScores(playerScores);

      // Set current hole to the next unscored hole
      const completedHoles = playerScores.map(s => s.hole);
      const nextHole = Array.from({ length: totalHoles }, (_, i) => i + 1)
        .find(h => !completedHoles.includes(h));

      if (nextHole) {
        setCurrentHole(nextHole);
      }
    } catch (err: any) {
      console.error('Error loading scores:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !course) {
      setError('Unable to submit score');
      return;
    }

    if (strokes < 1) {
      setError('Please enter a valid number of strokes');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const holeData = course.holes.find(h => h.hole === currentHole);
      if (!holeData) {
        throw new Error('Invalid hole');
      }

      await submitScore({
        tournamentId,
        playerId: user.uid,
        playerName: user.name,
        hole: currentHole,
        strokes,
        par: holeData.par,
      });

      // Reload scores
      await loadScores();

      // Reset for next hole
      setStrokes(0);

      // Move to next hole if not at the end
      if (currentHole < totalHoles) {
        setCurrentHole(currentHole + 1);
      }

      if (onScoreSubmitted) {
        onScoreSubmitted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit score');
    } finally {
      setLoading(false);
    }
  };

  const getHoleScore = (hole: number): Score | undefined => {
    return scores.find(s => s.hole === hole);
  };

  const getCurrentHolePar = (): number => {
    if (!course) return 4;
    const holeData = course.holes.find(h => h.hole === currentHole);
    return holeData?.par || 4;
  };

  const getCurrentHoleDistance = (): number => {
    if (!course) return 0;
    const holeData = course.holes.find(h => h.hole === currentHole);
    return holeData?.distance || 0;
  };

  const getTotalScore = (): { strokes: number; par: number; relative: number } => {
    const totalStrokes = scores.reduce((sum, s) => sum + s.strokes, 0);
    const totalPar = scores.reduce((sum, s) => sum + s.par, 0);
    return {
      strokes: totalStrokes,
      par: totalPar,
      relative: totalStrokes - totalPar,
    };
  };

  if (!user) {
    return (
      <div className="bg-cream rounded-2xl shadow-lg p-6 border border-sage-200">
        <p className="text-center text-sage-700">Please sign in to submit scores</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-cream rounded-2xl shadow-lg p-6 border border-sage-200">
        <p className="text-center text-sage-700">Loading course data...</p>
      </div>
    );
  }

  const isComplete = scores.length >= totalHoles;
  const total = getTotalScore();

  return (
    <div className="bg-cream rounded-2xl shadow-lg p-6 border border-sage-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-sage-900 mb-2">Scorecard</h3>
        <p className="text-sage-700">{user.name}</p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-olive-100 rounded-xl border border-sage-200">
        <div className="text-center">
          <div className="text-sm text-sage-700">Holes</div>
          <div className="text-2xl font-bold text-sage-900">
            {scores.length}/{totalHoles}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-sage-700">Strokes</div>
          <div className="text-2xl font-bold text-sage-900">{total.strokes}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-sage-700">Score</div>
          <div className={`text-2xl font-bold ${total.relative > 0 ? 'text-accent' : total.relative < 0 ? 'text-sage-600' : 'text-sage-900'}`}>
            {total.relative === 0 ? 'E' : total.relative > 0 ? `+${total.relative}` : total.relative}
          </div>
        </div>
      </div>

      {/* Current Hole Entry */}
      {!isComplete && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border-2 border-sage-500 rounded-xl bg-sage-50">
          <div className="mb-4">
            <div className="text-center mb-2">
              <span className="text-lg font-semibold text-sage-700">Hole </span>
              <span className="text-3xl font-bold text-sage-900">{currentHole}</span>
            </div>
            <div className="text-center text-sm text-sage-600">
              Par {getCurrentHolePar()} • {getCurrentHoleDistance()} yards
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="strokes" className="block text-sm font-medium text-sage-800 mb-2">
              Strokes
            </label>
            <input
              type="number"
              id="strokes"
              min="1"
              max="15"
              value={strokes || ''}
              onChange={(e) => setStrokes(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 text-2xl text-center border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              placeholder="0"
              autoFocus
            />
          </div>

          {strokes > 0 && (
            <div className="mb-4 text-center">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-${getScoreDescription(strokes - getCurrentHolePar())} bg-${getScoreDescription(strokes - getCurrentHolePar())}`}>
                {getScoreDescription(strokes - getCurrentHolePar()).toUpperCase()}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || strokes < 1}
            className="w-full bg-sage-700 hover:bg-sage-600 text-cream font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Score'}
          </button>
        </form>
      )}

      {isComplete && (
        <div className="mb-6 p-4 bg-sage-100 border border-sage-500 rounded-xl text-center">
          <p className="text-lg font-bold text-sage-900">Round Complete!</p>
          <p className="text-sage-700">Final Score: {total.strokes} ({total.relative === 0 ? 'E' : total.relative > 0 ? `+${total.relative}` : total.relative})</p>
        </div>
      )}

      {/* Previous Holes */}
      {scores.length > 0 && (
        <div>
          <h4 className="font-semibold text-sage-800 mb-3">Previous Holes</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Array.from({ length: totalHoles }, (_, i) => i + 1).map(hole => {
              const score = getHoleScore(hole);
              if (!score) return null;

              const holeData = course.holes.find(h => h.hole === hole);
              const relativeToPar = score.strokes - score.par;

              return (
                <div key={hole} className="flex items-center justify-between p-3 bg-olive-100 rounded-lg border border-sage-200">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-sage-800 w-8">#{hole}</div>
                    <div className="text-sm text-sage-600">
                      Par {score.par} • {holeData?.distance || 0} yds
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-sage-900">{score.strokes}</div>
                    <div className={`text-sm font-semibold px-2 py-1 rounded text-${getScoreDescription(relativeToPar)} bg-${getScoreDescription(relativeToPar)}`}>
                      {relativeToPar === 0 ? 'PAR' : relativeToPar > 0 ? `+${relativeToPar}` : relativeToPar}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
