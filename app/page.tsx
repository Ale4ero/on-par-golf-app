import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-olive-100 via-cream to-sage-100 p-8">
      <main className="text-center max-w-5xl">
        <div className="mb-8">
          <h1 className="text-7xl font-bold mb-4">
            <span className="text-sage-900">On</span>{' '}
            <span className="text-sage-700">Par</span>
          </h1>
          <p className="text-lg text-sage-800 max-w-md mx-auto leading-relaxed">
            On Par is the place where sport, comfort and nature meet perfectly.
          </p>
        </div>

        <div className="mb-12">
          <Link
            href="/tournament/create"
            className="inline-block bg-sage-900 hover:bg-sage-800 text-cream font-semibold py-3 px-8 rounded-full transition shadow-lg hover:shadow-xl"
          >
            Explore →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/tournament/create"
            className="bg-cream hover:bg-white text-sage-900 font-semibold py-8 px-8 rounded-2xl shadow-lg transition hover:shadow-xl border border-sage-200"
          >
            <div className="text-3xl mb-3">🏆</div>
            <div className="text-xl mb-2">Create Tournament</div>
            <div className="text-sm text-sage-700 mt-2">Host a new golf tournament</div>
          </Link>

          <Link
            href="/tournament/join"
            className="bg-sage-700 hover:bg-sage-600 text-cream font-semibold py-8 px-8 rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="text-3xl mb-3">⛳</div>
            <div className="text-xl mb-2">Join Tournament</div>
            <div className="text-sm text-sage-100 mt-2">Enter tournament code</div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left bg-cream/50 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-sage-200">
          <div>
            <h3 className="font-bold text-sage-900 mb-3 text-lg">📊 Real-time Scoring</h3>
            <p className="text-sm text-sage-700 leading-relaxed">Live leaderboards update as players submit scores</p>
          </div>
          <div>
            <h3 className="font-bold text-sage-900 mb-3 text-lg">🏌️ Multiple Formats</h3>
            <p className="text-sm text-sage-700 leading-relaxed">Stroke play, match play, scramble, and more</p>
          </div>
          <div>
            <h3 className="font-bold text-sage-900 mb-3 text-lg">📱 Mobile Friendly</h3>
            <p className="text-sm text-sage-700 leading-relaxed">Score from anywhere on the course</p>
          </div>
        </div>
      </main>
    </div>
  );
}
