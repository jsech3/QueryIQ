import initSqlJs from 'sql.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Strip TS syntax from our src files by reading and evaluating as text. Simpler:
// import the compiled dist/ artifacts. But we haven't compiled a node-targeted bundle.
// Easiest: re-read the schema and puzzles from source and eval-evade by regex extraction.

const schemaSrc = readFileSync(resolve(__dirname, '../src/lib/schema.ts'), 'utf8')
const puzzlesSrc = readFileSync(resolve(__dirname, '../src/lib/puzzles.ts'), 'utf8')

function extractTemplate(src, name) {
  const re = new RegExp(`export const ${name} = \`([\\s\\S]*?)\``, 'm')
  const m = re.exec(src)
  if (!m) throw new Error(`Could not extract ${name}`)
  return m[1]
}

const SCHEMA_SQL = extractTemplate(schemaSrc, 'SCHEMA_SQL')
const SEED_SQL = extractTemplate(schemaSrc, 'SEED_SQL')

// Extract puzzles: crude parser looking for { id: '...', ..., solution: '...' }
const puzzleRe = /\{\s*id:\s*'([^']+)',[\s\S]*?solution:\s*("[^"]+"|'[^']+'|`[^`]+`)/g
const puzzles = []
let match
while ((match = puzzleRe.exec(puzzlesSrc)) !== null) {
  let sol = match[2]
  sol = sol.slice(1, -1) // strip quotes
  puzzles.push({ id: match[1], solution: sol })
}

const SQL = await initSqlJs({ locateFile: () => resolve(__dirname, '../node_modules/sql.js/dist/sql-wasm.wasm') })
const db = new SQL.Database()

try {
  db.exec(SCHEMA_SQL)
  console.log('✓ schema parsed ok')
} catch (e) {
  console.error('✗ SCHEMA_SQL failed:', e.message)
  process.exit(1)
}

try {
  db.exec(SEED_SQL)
  console.log('✓ seed data inserted ok')
} catch (e) {
  console.error('✗ SEED_SQL failed:', e.message)
  process.exit(1)
}

let allOk = true
for (const p of puzzles) {
  try {
    const res = db.exec(p.solution)
    const rows = res[0]?.values?.length ?? 0
    console.log(`✓ ${p.id}: ${rows} rows`)
    if (rows === 0) console.log(`  ⚠ warning: ${p.id} returns 0 rows`)
  } catch (e) {
    console.error(`✗ ${p.id}:`, e.message)
    allOk = false
  }
}

process.exit(allOk ? 0 : 1)
