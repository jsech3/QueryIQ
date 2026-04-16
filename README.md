# QueryIQ

Live, in-browser SQL practice. A new data puzzle every day.

**→ [queryiq.daitiq.com](https://queryiq.daitiq.com)**

Part of the [DAITIQ](https://daitiq.com) family (alongside [GameIQ](https://gameiq.daitiq.com)).

## What it is

A zero-install SQL playground:

- **Daily puzzle** — one scenario per day with a themed mini-dataset. Write SQL, submit, get graded.
- **Playground** — same database, no grading, any query you want.
- **Progress** — streaks and solved-today tracked in localStorage. No account needed.

Everything runs client-side. No backend, no data collection beyond optional analytics.

## Stack

- Vite + React + TypeScript + Tailwind v4
- [sql.js](https://sql.js.org/) — SQLite compiled to WebAssembly, runs in the browser
- [CodeMirror 6](https://codemirror.net/) with SQL syntax highlighting
- Deployed on Vercel

## Develop

```bash
npm install
npm run dev           # http://localhost:5173
npm run build         # output → dist/
npm run preview       # serve built output
node scripts/validate-puzzles.mjs   # sanity-check schema + puzzle solutions
```

## Project layout

```
src/
├── lib/
│   ├── schema.ts        CREATE TABLE + INSERT seed for the movies dataset
│   ├── sqlEngine.ts     sql.js wrapper; singleton DB instance
│   └── puzzles.ts       Puzzle definitions + daily selection (midnight PT)
├── components/
│   ├── SqlEditor.tsx    CodeMirror wrapper
│   ├── ResultsTable.tsx Render query results
│   └── SchemaPanel.tsx  Sidebar with tables + columns
└── pages/
    ├── Home.tsx         Dashboard: today's puzzle + streak
    ├── Daily.tsx        Play + submit the daily
    └── Playground.tsx   Free-form SQL against the same DB
```

## Add a new puzzle

1. Append an entry to `PUZZLES` in `src/lib/puzzles.ts` — include `id`, `title`, `concept`, `difficulty`, `scenario`, `hint`, `solution`, and optional `expectedColumns`.
2. Run `node scripts/validate-puzzles.mjs` to confirm your solution executes and returns rows.
3. Ship it. The daily rotates deterministically through the puzzle list by day-of-epoch (America/Los_Angeles).

## License

MIT
