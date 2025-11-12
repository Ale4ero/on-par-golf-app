'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred.'}</p>
            <button
              onClick={reset}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
