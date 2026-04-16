export type Puzzle = {
  id: string
  title: string
  concept: string
  difficulty: 1 | 2 | 3
  scenario: string
  hint: string
  /** A known-good SQL solution that the grader will compare against. */
  solution: string
  /** Optional: columns the user's result must contain (order-independent). */
  expectedColumns?: string[]
}

export const PUZZLES: Puzzle[] = [
  {
    id: 'select-basics',
    title: 'The 2010s Shortlist',
    concept: 'SELECT · WHERE',
    difficulty: 1,
    scenario:
      'Show every movie released in 2010 or later. Return the title and release_year.',
    hint: 'SELECT title, release_year FROM movies WHERE release_year >= 2010',
    solution: 'SELECT title, release_year FROM movies WHERE release_year >= 2010',
    expectedColumns: ['title', 'release_year'],
  },
  {
    id: 'order-limit',
    title: 'Top of the Class',
    concept: 'ORDER BY · LIMIT',
    difficulty: 1,
    scenario:
      'Find the 5 highest-rated movies in the database. Return the title and rating, highest rating first.',
    hint: 'ORDER BY rating DESC, then LIMIT 5.',
    solution: 'SELECT title, rating FROM movies ORDER BY rating DESC, title ASC LIMIT 5',
    expectedColumns: ['title', 'rating'],
  },
  {
    id: 'join-intro',
    title: 'Who Directed What',
    concept: 'INNER JOIN',
    difficulty: 2,
    scenario:
      'For every movie, show its title and the name of its director. Return two columns: title, director_name.',
    hint: 'JOIN movies to directors ON movies.director_id = directors.id.',
    solution:
      'SELECT m.title AS title, d.name AS director_name FROM movies m JOIN directors d ON m.director_id = d.id',
    expectedColumns: ['title', 'director_name'],
  },
  {
    id: 'count-group',
    title: 'Genre Census',
    concept: 'GROUP BY · COUNT',
    difficulty: 2,
    scenario:
      "How many movies are in each genre? Return two columns: genre_name and movie_count, sorted by movie_count descending.",
    hint: 'Join movies to genres, then GROUP BY genre name and COUNT(*).',
    solution:
      'SELECT g.name AS genre_name, COUNT(*) AS movie_count FROM movies m JOIN genres g ON m.genre_id = g.id GROUP BY g.name ORDER BY movie_count DESC, genre_name ASC',
    expectedColumns: ['genre_name', 'movie_count'],
  },
  {
    id: 'having',
    title: 'Prolific Auteurs',
    concept: 'GROUP BY · HAVING',
    difficulty: 2,
    scenario:
      'Which directors have more than one movie in our database? Return director_name and movie_count, sorted by movie_count descending.',
    hint: 'GROUP BY director, then HAVING COUNT(*) > 1.',
    solution:
      'SELECT d.name AS director_name, COUNT(*) AS movie_count FROM movies m JOIN directors d ON m.director_id = d.id GROUP BY d.name HAVING COUNT(*) > 1 ORDER BY movie_count DESC, director_name ASC',
    expectedColumns: ['director_name', 'movie_count'],
  },
  {
    id: 'subquery',
    title: 'Above Average',
    concept: 'Subquery',
    difficulty: 3,
    scenario:
      'List every movie whose runtime is longer than the average runtime across all movies. Return title and runtime_minutes, longest first.',
    hint: 'Use (SELECT AVG(runtime_minutes) FROM movies) inside a WHERE clause.',
    solution:
      'SELECT title, runtime_minutes FROM movies WHERE runtime_minutes > (SELECT AVG(runtime_minutes) FROM movies) ORDER BY runtime_minutes DESC, title ASC',
    expectedColumns: ['title', 'runtime_minutes'],
  },
  {
    id: 'multi-join',
    title: 'Cast List',
    concept: 'Multi-table JOIN',
    difficulty: 3,
    scenario:
      "Who stars in 'Inception'? Return each actor's name and the role they played.",
    hint: 'Join movies → movie_actors → actors, filter WHERE title = "Inception".',
    solution:
      "SELECT a.name AS actor_name, ma.role AS role FROM movies m JOIN movie_actors ma ON ma.movie_id = m.id JOIN actors a ON a.id = ma.actor_id WHERE m.title = 'Inception'",
    expectedColumns: ['actor_name', 'role'],
  },
]

/** Deterministic puzzle-of-the-day based on days-since-epoch in America/Los_Angeles. */
export function puzzleForDate(date = new Date()): Puzzle {
  const laDateString = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  const daysSinceEpoch = Math.floor(
    new Date(laDateString + 'T00:00:00Z').getTime() / 86_400_000,
  )
  return PUZZLES[daysSinceEpoch % PUZZLES.length]
}

export function todayDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}
