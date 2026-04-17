import { test, expect } from '@playwright/test'

const TABLES = ['movies', 'directors', 'genres', 'actors', 'movie_actors']

function todayPuzzleIndex(): number {
  const laDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  const daysSinceEpoch = Math.floor(
    new Date(laDate + 'T00:00:00Z').getTime() / 86_400_000,
  )
  return daysSinceEpoch % 7
}

const SOLUTIONS = [
  'SELECT title, release_year FROM movies WHERE release_year >= 2010',
  'SELECT title, rating FROM movies ORDER BY rating DESC, title ASC LIMIT 5',
  'SELECT m.title AS title, d.name AS director_name FROM movies m JOIN directors d ON m.director_id = d.id',
  'SELECT g.name AS genre_name, COUNT(*) AS movie_count FROM movies m JOIN genres g ON m.genre_id = g.id GROUP BY g.name ORDER BY movie_count DESC, genre_name ASC',
  'SELECT d.name AS director_name, COUNT(*) AS movie_count FROM movies m JOIN directors d ON m.director_id = d.id GROUP BY d.name HAVING COUNT(*) > 1 ORDER BY movie_count DESC, director_name ASC',
  'SELECT title, runtime_minutes FROM movies WHERE runtime_minutes > (SELECT AVG(runtime_minutes) FROM movies) ORDER BY runtime_minutes DESC, title ASC',
  "SELECT a.name AS actor_name, ma.role AS role FROM movies m JOIN movie_actors ma ON ma.movie_id = m.id JOIN actors a ON a.id = ma.actor_id WHERE m.title = 'Inception'",
]

test.describe('Home page', () => {
  test('renders headline and today card', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Write SQL. Get sharper.')
    await expect(page.getByText('Difficulty')).toBeVisible()
    await expect(page.getByRole('link', { name: "Play Today's Puzzle" })).toBeVisible()
  })

  test('progress card shows streak and solved count', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Day streak')).toBeVisible()
    await expect(page.getByText('Solved today')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('nav links route between pages', async ({ page }) => {
    await page.goto('/')

    await page.locator('nav').getByRole('link', { name: 'Daily' }).click()
    await expect(page).toHaveURL(/\/daily/)

    await page.locator('nav').getByRole('link', { name: 'Playground' }).click()
    await expect(page).toHaveURL(/\/playground/)

    await page.locator('nav').getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL(/\/$/)
  })
})

test.describe('Daily Challenge', () => {
  test('shows puzzle scenario and schema panel', async ({ page }) => {
    await page.goto('/daily')
    await expect(page.getByRole('button', { name: 'Run' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()

    for (const table of TABLES) {
      await expect(page.locator(`text=${table}`).first()).toBeVisible()
    }
  })

  test('show/hide hint toggle works', async ({ page }) => {
    await page.goto('/daily')
    await page.getByText('Show hint').click()
    await expect(page.getByText('Hide hint')).toBeVisible()
  })

  test('submitting correct solution shows success', async ({ page }) => {
    await page.goto('/daily')

    await page.waitForSelector('button:has-text("Submit"):not([disabled])', { timeout: 10_000 })

    const editor = page.locator('.cm-content')
    await editor.click()
    await page.keyboard.press('Meta+a')
    await page.keyboard.type(SOLUTIONS[todayPuzzleIndex()], { delay: 5 })

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Correct', { exact: false })).toBeVisible({ timeout: 10_000 })
  })

  test('submitting wrong query shows warning', async ({ page }) => {
    await page.goto('/daily')
    await page.waitForSelector('button:has-text("Submit"):not([disabled])', { timeout: 10_000 })

    const editor = page.locator('.cm-content')
    await editor.click()
    await page.keyboard.press('Meta+a')
    await page.keyboard.type('SELECT 1 AS wrong_answer', { delay: 5 })

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Close, but not quite')).toBeVisible({ timeout: 10_000 })
  })

  test('submitting invalid SQL shows error', async ({ page }) => {
    await page.goto('/daily')
    await page.waitForSelector('button:has-text("Run"):not([disabled])', { timeout: 10_000 })

    const editor = page.locator('.cm-content')
    await editor.click()
    await page.keyboard.press('Meta+a')
    await page.keyboard.type('SELEC broken query!!!', { delay: 5 })

    await page.getByRole('button', { name: 'Run' }).click()
    await expect(
      page.locator('[class*="error"]').or(page.getByText('near'))
    ).toBeVisible({ timeout: 10_000 })
  })
})

test.describe('Playground', () => {
  test('runs a sample query and shows results', async ({ page }) => {
    await page.goto('/playground')
    await page.waitForSelector('button:has-text("Run Query"):not([disabled])', { timeout: 10_000 })

    await page.getByRole('button', { name: 'Run Query' }).click()
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/\d+ rows?/).first()).toBeVisible()
  })

  test('sample buttons swap query text', async ({ page }) => {
    await page.goto('/playground')
    const btn = page.locator('button', { hasText: 'Movies by year' })
    await btn.click()
    await expect(page.locator('.cm-content')).toContainText('release_year')
  })

  test('schema panel shows all tables', async ({ page }) => {
    await page.goto('/playground')
    for (const table of TABLES) {
      await expect(page.locator(`text=${table}`).first()).toBeVisible()
    }
  })

  test('running invalid SQL shows error without crashing', async ({ page }) => {
    await page.goto('/playground')
    await page.waitForSelector('button:has-text("Run Query"):not([disabled])', { timeout: 10_000 })

    const editor = page.locator('.cm-content')
    await editor.click()
    await page.keyboard.press('Meta+a')
    await page.keyboard.type('DROP TABLE nonexistent', { delay: 5 })

    await page.getByRole('button', { name: 'Run Query' }).click()
    await expect(
      page.locator('[class*="error"]').or(page.getByText('no such table'))
    ).toBeVisible({ timeout: 5_000 })

    await expect(page.locator('h1')).toContainText('Playground')
  })
})
