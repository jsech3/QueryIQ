import { TABLES } from '../lib/schema'

export default function SchemaPanel() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-4 text-sm">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Schema</h3>
      <div className="space-y-4">
        {TABLES.map((t) => (
          <div key={t.name}>
            <div className="text-[var(--color-accent)] font-mono font-semibold">{t.name}</div>
            <ul className="mt-1 space-y-0.5 font-mono text-xs text-gray-400">
              {t.columns.map((c) => (
                <li key={c.name} className="flex gap-2">
                  <span className="text-gray-200">{c.name}</span>
                  <span className="text-gray-600">·</span>
                  <span>{c.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
