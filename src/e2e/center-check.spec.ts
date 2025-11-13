import { test, expect } from '@playwright/test'

test.describe('Center Check Flow', () => {
  test('should show loading spinner on initial page load', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: true }),
      })
    })

    await page.goto('/')

    const spinner = page.locator('div[class*="animate-spin"]')
    await expect(spinner).toBeVisible()

    await expect(page.getByText('Loading...')).toBeVisible()

    await page.waitForURL('/login', { timeout: 5000 })
  })

  test('should redirect to /login when center exists', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: true }),
      })
    })

    await page.goto('/')

    await page.waitForURL('/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('should redirect to /onboarding when center does not exist (404)', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Center not found' }),
      })
    })

    await page.goto('/')

    await page.waitForURL('/onboarding', { timeout: 5000 })
    expect(page.url()).toContain('/onboarding')
  })

  test('should redirect to /onboarding when center exists = false', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: false }),
      })
    })

    await page.goto('/')

    await page.waitForURL('/onboarding', { timeout: 5000 })
    expect(page.url()).toContain('/onboarding')
  })

  test('should show error page on network error', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    await page.waitForURL(/\/error/, { timeout: 5000 })
    expect(page.url()).toContain('/error')
    expect(page.url()).toContain('type=network')

    await expect(page.getByText('Network Error')).toBeVisible()
    await expect(page.getByText('Unable to reach the server')).toBeVisible()

    const retryButton = page.getByRole('button', { name: /try again/i })
    await expect(retryButton).toBeVisible()
  })

  test('should show error page on timeout', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 4000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: true }),
      })
    })

    await page.goto('/')

    await page.waitForURL(/\/error/, { timeout: 10000 })
    expect(page.url()).toContain('/error')
    expect(page.url()).toContain('type=timeout')

    await expect(page.getByText('Connection Timeout')).toBeVisible()
    await expect(page.getByText(/took too long to respond/i)).toBeVisible()
  })

  test('should show error page on server error (500)', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/')

    await page.waitForURL(/\/error/, { timeout: 5000 })
    expect(page.url()).toContain('/error')
    expect(page.url()).toContain('type=server')

    await expect(page.getByText('Server Error')).toBeVisible()
    await expect(page.getByText(/server encountered an error/i)).toBeVisible()
  })

  test('should display error details when provided', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    await page.waitForURL(/\/error/, { timeout: 5000 })

    await expect(page.getByText('Error Message:')).toBeVisible()
    await expect(page.getByText('Technical Details:')).toBeVisible()

    await expect(page.getByText(/Unable to connect to backend service/i)).toBeVisible()
    await expect(page.getByText(/localhost:3000/)).toBeVisible()
  })

  test('should show retry button on error page', async ({ page }) => {
    let attemptCount = 0
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      attemptCount++
      if (attemptCount === 1) {
        await route.abort('failed')
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ exists: true }),
        })
      }
    })

    await page.goto('/')

    await page.waitForURL(/\/error/, { timeout: 5000 })

    const retryButton = page.getByRole('button', { name: /try again/i })
    await expect(retryButton).toBeVisible()
    await retryButton.click()

    await page.waitForURL('/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('should have "Return to Home" link on error page', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    await page.waitForURL(/\/error/, { timeout: 5000 })

    const homeLink = page.getByRole('link', { name: /return to home/i })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute('href', '/')
  })

  test('should show appropriate icon on error page', async ({ page }) => {
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    await page.waitForURL(/\/error/, { timeout: 5000 })

    const errorIcon = page.locator('div.bg-red-50.rounded-full')
    await expect(errorIcon).toBeVisible()
  })
})
