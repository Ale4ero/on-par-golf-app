'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { createTournament, generateJoinCode } from '@/lib/firestore';
import { mockCourses } from '@/lib/mockData';
import { TournamentType } from '@/lib/types';

export default function TournamentForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    courseId: mockCourses[0].courseId,
    type: 'stroke-play' as TournamentType,
    holes: 18,
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be signed in to create a tournament');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const selectedCourse = mockCourses.find(c => c.courseId === formData.courseId);
      if (!selectedCourse) {
        throw new Error('Invalid course selected');
      }

      const joinCode = generateJoinCode();

      const tournamentId = await createTournament({
        name: formData.name,
        hostId: user.uid,
        hostName: user.name,
        courseId: formData.courseId,
        courseName: selectedCourse.name,
        type: formData.type,
        players: [{
          uid: user.uid,
          name: user.name,
          ...(user.handicap !== undefined && { handicap: user.handicap }),
          status: 'joined',
        }],
        startDate: new Date(formData.startDate),
        holes: formData.holes,
        status: 'pending',
        joinCode,
      });

      router.push(`/tournament/${tournamentId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'holes' ? parseInt(value) : value,
    }));
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto bg-cream rounded-2xl shadow-lg p-8 border border-sage-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-sage-900 mb-4">Sign In Required</h2>
          <p className="text-sage-700 mb-6">You must be signed in to create a tournament.</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-sage-700 hover:bg-sage-600 text-cream font-bold py-2 px-6 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-cream rounded-2xl shadow-lg p-8 border border-sage-300">
      <h2 className="text-3xl font-bold text-sage-900 mb-6">Create Tournament</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-sage-800 mb-2">
            Tournament Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
            placeholder="e.g., Spring Classic 2025"
          />
        </div>

        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-sage-800 mb-2">
            Golf Course *
          </label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
          >
            {mockCourses.map(course => (
              <option key={course.courseId} value={course.courseId}>
                {course.name} - {course.location} (Par {course.totalPar})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-sage-800 mb-2">
            Tournament Format *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
          >
            <option value="stroke-play">Stroke Play (Individual)</option>
            <option value="match-play">Match Play (Head-to-Head)</option>
            <option value="scramble">Scramble (Team)</option>
            <option value="best-ball">Best Ball (Team)</option>
            <option value="alternate-shot">Alternate Shot (Team)</option>
          </select>
          <p className="mt-2 text-sm text-sage-600">
            {formData.type === 'stroke-play' && 'Total strokes count - lowest score wins'}
            {formData.type === 'match-play' && 'Compete hole-by-hole against opponents'}
            {formData.type === 'scramble' && 'Team selects best shot each time'}
            {formData.type === 'best-ball' && 'Count best score per hole from team'}
            {formData.type === 'alternate-shot' && 'Team members alternate shots'}
          </p>
        </div>

        <div>
          <label htmlFor="holes" className="block text-sm font-medium text-sage-800 mb-2">
            Number of Holes *
          </label>
          <select
            id="holes"
            name="holes"
            value={formData.holes}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
          >
            <option value={9}>9 Holes</option>
            <option value={18}>18 Holes</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-sage-800 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white text-gray-900"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-sage-200 hover:bg-sage-300 text-sage-900 font-bold py-3 px-6 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-sage-700 hover:bg-sage-600 text-cream font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>
      </form>
    </div>
  );
}
