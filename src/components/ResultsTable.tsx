import type { QueryResult } from '../lib/sqlEngine'

type Props = {
  result: QueryResult | null
  error: string | null
}

export default function ResultsTable({ result, error }: Props) {
  if (error) {
    return (
      <div className="rounded-lg border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 p-4 text-sm font-mono text-[var(--color-error)]">
        {error}
      </div>
    )
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-4 text-sm text-gray-500">
        Run a query to see results here.
      </div>
    )
  }

  if (result.rowCount === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-4 text-sm text-gray-500">
        Query returned 0 rows.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead className="bg-[var(--color-bg-card)] text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              {result.columns.map((c) => (
                <th key={c} className="px-3 py-2 text-left font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr
                key={i}
                className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-card)]/50"
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1.5 text-gray-200">
                    {cell === null ? (
                      <span className="text-gray-500 italic">null</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[11px] text-gray-500">
        {result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'}
      </div>
    </div>
  )
}
