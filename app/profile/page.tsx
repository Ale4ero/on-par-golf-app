'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    handicap: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        handicap: user.handicap || 0,
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        handicap: formData.handicap,
      });

      setSuccess('Profile updated successfully!');
      setEditing(false);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        handicap: user.handicap || 0,
      });
    }
    setEditing(false);
    setError('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-olive-100 via-cream to-sage-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-sage-900 mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-olive-100 via-cream to-sage-100 flex items-center justify-center p-4">
        <div className="bg-cream rounded-2xl shadow-lg p-8 max-w-md text-center border border-sage-200">
          <h2 className="text-2xl font-bold text-sage-900 mb-4">Sign In Required</h2>
          <p className="text-sage-700 mb-6">You must be signed in to view your profile.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-olive-100 via-cream to-sage-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-cream rounded-2xl shadow-lg p-8 border border-sage-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-sage-900">My Profile</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-sage-700 hover:bg-sage-600 text-cream px-4 py-2 rounded-lg transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {success && (
            <div className="mb-4 p-3 bg-sage-100 border border-sage-400 text-sage-900 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-sage-800 mb-2">Email</label>
              <div className="px-4 py-3 bg-olive-100 rounded-lg text-sage-700 border border-sage-200">
                {user.email}
              </div>
              <p className="mt-1 text-sm text-sage-600">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-sage-800 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                required
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:bg-olive-100 disabled:text-sage-700 bg-white"
              />
            </div>

            <div>
              <label htmlFor="handicap" className="block text-sm font-medium text-sage-800 mb-2">
                Handicap
              </label>
              <input
                type="number"
                id="handicap"
                value={formData.handicap}
                onChange={(e) => setFormData({ ...formData, handicap: parseInt(e.target.value) || 0 })}
                disabled={!editing}
                min="0"
                max="54"
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:bg-olive-100 disabled:text-sage-700 bg-white"
              />
              <p className="mt-1 text-sm text-sage-600">
                Your official golf handicap (0-54)
              </p>
            </div>

            {editing && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-sage-200 hover:bg-sage-300 text-sage-900 font-bold py-3 px-6 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-sage-700 hover:bg-sage-600 text-cream font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 pt-8 border-t border-sage-200">
            <h2 className="text-xl font-bold text-sage-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link
                href="/tournament/create"
                className="block bg-sage-50 hover:bg-sage-100 text-sage-800 font-medium py-3 px-4 rounded-lg transition border border-sage-200"
              >
                Create a Tournament
              </Link>
              <Link
                href="/tournament/join"
                className="block bg-olive-100 hover:bg-olive-200 text-sage-800 font-medium py-3 px-4 rounded-lg transition border border-sage-200"
              >
                Join a Tournament
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-sage-200">
            <h2 className="text-xl font-bold text-sage-900 mb-2">Account Info</h2>
            <div className="text-sm text-sage-700 space-y-1">
              <p>
                <span className="font-medium">Member since:</span>{' '}
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              <p>
                <span className="font-medium">Tournaments played:</span>{' '}
                {user.tournaments?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
