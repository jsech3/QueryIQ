import { useEffect, useState } from 'react'
import SqlEditor from '../components/SqlEditor'
import ResultsTable from '../components/ResultsTable'
import SchemaPanel from '../components/SchemaPanel'
import { puzzleForDate, todayDateKey } from '../lib/puzzles'
import { getDatabase, runQuery, resultsEqual, type QueryResult } from '../lib/sqlEngine'

type Status =
  | { kind: 'idle' }
  | { kind: 'running' }
  | { kind: 'error'; message: string }
  | { kind: 'wrong'; reason: string }
  | { kind: 'correct' }

export default function Daily() {
  const puzzle = puzzleForDate()
  const dateKey = todayDateKey()
  const solvedKey = `queryiq_solved_${puzzle.id}_${dateKey}`

  const [query, setQuery] = useState('-- write your SQL here\n')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [showHint, setShowHint] = useState(false)
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    getDatabase().then(() => setDbReady(true)).catch((e) => {
      setStatus({ kind: 'error', message: String(e) })
    })
  }, [])

  useEffect(() => {
    if (localStorage.getItem(solvedKey)) setStatus({ kind: 'correct' })
  }, [solvedKey])

  async function handleRun() {
    setStatus({ kind: 'running' })
    try {
      const r = await runQuery(query)
      setResult(r)
      setStatus({ kind: 'idle' })
    } catch (e) {
      setResult(null)
      setStatus({ kind: 'error', message: (e as Error).message })
    }
  }

  async function handleSubmit() {
    setStatus({ kind: 'running' })
    try {
      const userResult = await runQuery(query)
      const expected = await runQuery(puzzle.solution)
      setResult(userResult)

      if (puzzle.expectedColumns) {
        const lowerUser = userResult.columns.map((c) => c.toLowerCase())
        const missing = puzzle.expectedColumns.filter((c) => !lowerUser.includes(c.toLowerCase()))
        if (missing.length) {
          setStatus({ kind: 'wrong', reason: `Missing column(s): ${missing.join(', ')}` })
          return
        }
      }

      if (resultsEqual(userResult, expected)) {
        setStatus({ kind: 'correct' })
        localStorage.setItem(solvedKey, '1')
        bumpStreak(dateKey)
      } else {
        setStatus({
          kind: 'wrong',
          reason: `Got ${userResult.rowCount} rows, expected ${expected.rowCount}. Check your filters / joins.`,
        })
      }
    } catch (e) {
      setResult(null)
      setStatus({ kind: 'error', message: (e as Error).message })
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--color-accent)]">
              Daily · {dateKey}
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">{puzzle.title}</h1>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {puzzle.concept} · difficulty {puzzle.difficulty}/3
            </p>
          </div>
          {status.kind === 'correct' && (
            <div className="text-[var(--color-accent)] text-sm font-semibold">✓ Solved</div>
          )}
        </div>
        <p className="mt-4 text-gray-200">{puzzle.scenario}</p>
        <button
          className="mt-3 text-xs text-[var(--color-purple)] hover:underline"
          onClick={() => setShowHint((s) => !s)}
        >
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>
        {showHint && (
          <div className="mt-2 text-xs text-gray-400 font-mono bg-[var(--color-bg)] rounded p-3 border border-[var(--color-border)]">
            {puzzle.hint}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-[1fr_240px] gap-6">
        <div className="space-y-4">
          <SqlEditor value={query} onChange={setQuery} minHeight="180px" />
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={!dbReady || status.kind === 'running'}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-gray-200 hover:bg-[var(--color-bg-elev)] disabled:opacity-50 text-sm"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={!dbReady || status.kind === 'running'}
              className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:brightness-110 disabled:opacity-50 text-sm"
            >
              Submit
            </button>
            {!dbReady && (
              <span className="text-xs text-gray-500 self-center">Loading database…</span>
            )}
          </div>

          {status.kind === 'correct' && (
            <div className="rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] p-4 text-sm text-[var(--color-accent)]">
              <strong>Correct.</strong> Nicely done. Come back tomorrow for the next one.
            </div>
          )}
          {status.kind === 'wrong' && (
            <div className="rounded-lg border border-[var(--color-warn)]/40 bg-[var(--color-warn)]/10 p-4 text-sm text-[var(--color-warn)]">
              Close, but not quite. {status.reason}
            </div>
          )}

          <ResultsTable
            result={result}
            error={status.kind === 'error' ? status.message : null}
          />
        </div>

        <aside>
          <SchemaPanel />
        </aside>
      </div>
    </div>
  )
}

function bumpStreak(dateKey: string) {
  const lastKey = localStorage.getItem('queryiq_last_solve_date')
  if (lastKey === dateKey) return
  const prevStreak = Number(localStorage.getItem('queryiq_streak') || 0)
  if (!lastKey) {
    localStorage.setItem('queryiq_streak', '1')
  } else {
    const last = new Date(lastKey + 'T00:00:00Z')
    const today = new Date(dateKey + 'T00:00:00Z')
    const diff = Math.round((today.getTime() - last.getTime()) / 86_400_000)
    localStorage.setItem('queryiq_streak', String(diff === 1 ? prevStreak + 1 : 1))
  }
  localStorage.setItem('queryiq_last_solve_date', dateKey)
}
