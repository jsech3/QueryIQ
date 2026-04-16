import { Link } from 'react-router-dom'
import { puzzleForDate, todayDateKey } from '../lib/puzzles'

export default function Home() {
  const puzzle = puzzleForDate()
  const dateKey = todayDateKey()
  const solvedKey = `queryiq_solved_${puzzle.id}_${dateKey}`
  const solved = typeof window !== 'undefined' && !!localStorage.getItem(solvedKey)
  const streak = typeof window !== 'undefined' ? Number(localStorage.getItem('queryiq_streak') || 0) : 0

  return (
    <div className="space-y-10">
      <section className="text-center py-10 md:py-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">
          Write SQL. Get sharper.
        </h1>
        <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto">
          A fresh SQL puzzle every day, running 100% in your browser. No signups, no install, no friction.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/daily"
            className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:brightness-110 transition"
          >
            {solved ? 'Replay Today' : "Play Today's Puzzle"}
          </Link>
          <Link
            to="/playground"
            className="px-6 py-3 rounded-lg border border-[var(--color-border)] text-gray-200 hover:bg-[var(--color-bg-elev)] transition"
          >
            Open Playground
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[var(--color-accent)]">Today</span>
            <span className="text-xs text-gray-500 font-mono">{dateKey}</span>
          </div>
          <h2 className="text-xl font-semibold text-white">{puzzle.title}</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">{puzzle.concept}</p>
          <p className="mt-4 text-sm text-gray-300">{puzzle.scenario}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Difficulty: <span className="text-gray-300">{'●'.repeat(puzzle.difficulty)}{'○'.repeat(3 - puzzle.difficulty)}</span>
            </div>
            {solved && <span className="text-xs text-[var(--color-accent)]">✓ Solved</span>}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6">
          <span className="text-xs uppercase tracking-wider text-[var(--color-purple)]">Your progress</span>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-white">{streak}</div>
              <div className="text-xs text-gray-500 mt-1">Day streak</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{solved ? '1' : '0'}</div>
              <div className="text-xs text-gray-500 mt-1">Solved today</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Everything's stored locally in your browser. No account required.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">How it works</h3>
        <ol className="grid md:grid-cols-3 gap-4 text-sm">
          <li>
            <div className="text-[var(--color-accent)] text-xs font-mono mb-1">01</div>
            <div className="font-semibold text-white">Load the puzzle</div>
            <div className="text-gray-400 mt-1">A new scenario and mini-dataset every day.</div>
          </li>
          <li>
            <div className="text-[var(--color-accent)] text-xs font-mono mb-1">02</div>
            <div className="font-semibold text-white">Write SQL</div>
            <div className="text-gray-400 mt-1">Query a real SQLite database that runs in your browser.</div>
          </li>
          <li>
            <div className="text-[var(--color-accent)] text-xs font-mono mb-1">03</div>
            <div className="font-semibold text-white">Get graded</div>
            <div className="text-gray-400 mt-1">We compare your result to the reference answer.</div>
          </li>
        </ol>
      </section>
    </div>
  )
}
