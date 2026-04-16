import { useEffect, useState } from 'react'
import SqlEditor from '../components/SqlEditor'
import ResultsTable from '../components/ResultsTable'
import SchemaPanel from '../components/SchemaPanel'
import { getDatabase, runQuery, type QueryResult } from '../lib/sqlEngine'

const SAMPLES = [
  { label: 'Top rated', sql: 'SELECT title, rating FROM movies ORDER BY rating DESC LIMIT 10' },
  { label: 'Movies by year', sql: 'SELECT release_year, COUNT(*) AS count FROM movies GROUP BY release_year ORDER BY release_year DESC' },
  { label: 'Director credits', sql: 'SELECT d.name, COUNT(*) AS movies FROM movies m JOIN directors d ON m.director_id = d.id GROUP BY d.name ORDER BY movies DESC' },
]

export default function Playground() {
  const [query, setQuery] = useState(SAMPLES[0].sql)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    getDatabase().then(() => setDbReady(true)).catch((e) => setError(String(e)))
  }, [])

  async function handleRun() {
    setRunning(true)
    setError(null)
    try {
      const r = await runQuery(query)
      setResult(r)
    } catch (e) {
      setResult(null)
      setError((e as Error).message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Playground</h1>
        <p className="text-sm text-gray-400 mt-1">
          Same movies database as the Daily. Write any SQL, run anything. Nothing gets graded here.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 self-center mr-1">Try:</span>
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => setQuery(s.sql)}
                className="text-xs px-2 py-1 rounded border border-[var(--color-border)] text-gray-400 hover:bg-[var(--color-bg-elev)] hover:text-white"
              >
                {s.label}
              </button>
            ))}
          </div>
          <SqlEditor value={query} onChange={setQuery} minHeight="180px" />
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={!dbReady || running}
              className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:brightness-110 disabled:opacity-50 text-sm"
            >
              {running ? 'Running…' : 'Run Query'}
            </button>
            {!dbReady && (
              <span className="text-xs text-gray-500 self-center">Loading database…</span>
            )}
          </div>
          <ResultsTable result={result} error={error} />
        </div>

        <aside>
          <SchemaPanel />
        </aside>
      </div>
    </div>
  )
}
