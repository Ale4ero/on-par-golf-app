'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 bg-sage-700 hover:bg-sage-600 border-2 border-sage-500"
      aria-label="Toggle theme"
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-cream transition-transform ${
          theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center text-sm">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  );
}
