import initSqlJs, { type Database } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { SCHEMA_SQL, SEED_SQL } from './schema'

let dbPromise: Promise<Database> | null = null

export function getDatabase(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = initSqlJs({ locateFile: () => wasmUrl }).then((SQL) => {
      const db = new SQL.Database()
      db.exec(SCHEMA_SQL)
      db.exec(SEED_SQL)
      return db
    })
  }
  return dbPromise
}

export type QueryResult = {
  columns: string[]
  rows: unknown[][]
  rowCount: number
}

export async function runQuery(sql: string): Promise<QueryResult> {
  const db = await getDatabase()
  const results = db.exec(sql)
  if (results.length === 0) {
    return { columns: [], rows: [], rowCount: 0 }
  }
  const last = results[results.length - 1]
  return {
    columns: last.columns,
    rows: last.values,
    rowCount: last.values.length,
  }
}

export function resultsEqual(a: QueryResult, b: QueryResult): boolean {
  if (a.columns.length !== b.columns.length) return false
  if (a.rows.length !== b.rows.length) return false
  const stringify = (r: QueryResult) =>
    r.rows.map((row) => row.map((v) => (v === null ? '∅' : String(v))).join('|')).sort()
  const aRows = stringify(a)
  const bRows = stringify(b)
  for (let i = 0; i < aRows.length; i++) {
    if (aRows[i] !== bRows[i]) return false
  }
  return true
}
