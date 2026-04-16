import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Daily from './pages/Daily'
import Playground from './pages/Playground'

export default function App() {
  const loc = useLocation()
  const linkClass = (path: string) =>
    `text-sm px-3 py-1.5 rounded-md transition-colors ${
      loc.pathname === path
        ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
        : 'text-gray-400 hover:text-white hover:bg-[var(--color-bg-elev)]'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] sticky top-0 z-10 bg-[var(--color-bg)]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text tracking-tight">QueryIQ</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">beta</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/daily" className={linkClass('/daily')}>Daily</Link>
            <Link to="/playground" className={linkClass('/playground')}>Playground</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </main>
      <footer className="border-t border-[var(--color-border)] text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span>QueryIQ · part of the <a href="https://daitiq.com" className="text-[var(--color-accent)] hover:underline">DAITIQ</a> family</span>
          <span>Runs 100% in your browser · SQLite via sql.js</span>
        </div>
      </footer>
    </div>
  )
}
