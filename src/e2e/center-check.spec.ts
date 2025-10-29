import { test, expect } from '@playwright/test'

test.describe('Center Check Flow', () => {
  test('should show loading spinner on initial page load', async ({ page }) => {
    // Mock API to delay response so we can see the loading state
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: true }),
      })
    })

    await page.goto('/')

    // Check that loading spinner is visible
    const spinner = page.locator('div[class*="animate-spin"]')
    await expect(spinner).toBeVisible()

    // Check that loading text is visible
    await expect(page.getByText('Loading...')).toBeVisible()

    // Wait for redirect to complete
    await page.waitForURL('/login', { timeout: 5000 })
  })

  test('should redirect to /login when center exists', async ({ page }) => {
    // Mock API response: center exists
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: true }),
      })
    })

    await page.goto('/')

    // Should redirect to login page
    await page.waitForURL('/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('should redirect to /onboarding when center does not exist (404)', async ({ page }) => {
    // Mock API response: 404 (center doesn't exist)
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Center not found' }),
      })
    })

    await page.goto('/')

    // Should redirect to onboarding page
    await page.waitForURL('/onboarding', { timeout: 5000 })
    expect(page.url()).toContain('/onboarding')
  })

  test('should redirect to /onboarding when center exists = false', async ({ page }) => {
    // Mock API response: center exists = false
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: false }),
      })
    })

    await page.goto('/')

    // Should redirect to onboarding page
    await page.waitForURL('/onboarding', { timeout: 5000 })
    expect(page.url()).toContain('/onboarding')
  })

  test('should show error page on network error', async ({ page }) => {
    // Mock API to fail with network error
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    // Should redirect to error page
    await page.waitForURL(/\/error/, { timeout: 5000 })
    expect(page.url()).toContain('/error')
    expect(page.url()).toContain('type=network')

    // Check error page content
    await expect(page.getByText('Network Error')).toBeVisible()
    await expect(page.getByText('Unable to reach the server')).toBeVisible()

    // Check that retry button is visible
    const retryButton = page.getByRole('button', { name: /try again/i })
    await expect(retryButton).toBeVisible()
  })

  test('should show error page on timeout', async ({ page }) => {
    // Mock API to delay response beyond timeout (3 seconds)
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 4000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: true }),
      })
    })

    await page.goto('/')

    // Should redirect to error page after timeout
    await page.waitForURL(/\/error/, { timeout: 10000 })
    expect(page.url()).toContain('/error')
    expect(page.url()).toContain('type=timeout')

    // Check error page content
    await expect(page.getByText('Connection Timeout')).toBeVisible()
    await expect(page.getByText(/took too long to respond/i)).toBeVisible()
  })

  test('should show error page on server error (500)', async ({ page }) => {
    // Mock API to return server error
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/')

    // Should redirect to error page
    await page.waitForURL(/\/error/, { timeout: 5000 })
    expect(page.url()).toContain('/error')
    expect(page.url()).toContain('type=server')

    // Check error page content
    await expect(page.getByText('Server Error')).toBeVisible()
    await expect(page.getByText(/server encountered an error/i)).toBeVisible()
  })

  test('should display error details when provided', async ({ page }) => {
    // Mock API to fail with network error
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    // Wait for error page
    await page.waitForURL(/\/error/, { timeout: 5000 })

    // Check that error details are displayed
    await expect(page.getByText('Error Message:')).toBeVisible()
    await expect(page.getByText('Technical Details:')).toBeVisible()

    // Check that the actual error messages are visible
    await expect(page.getByText(/Unable to connect to backend service/i)).toBeVisible()
    await expect(page.getByText(/localhost:3000/)).toBeVisible()
  })

  test('should show retry button on error page', async ({ page }) => {
    // Mock API to fail initially
    let attemptCount = 0
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      attemptCount++
      if (attemptCount === 1) {
        // First attempt: fail
        await route.abort('failed')
      } else {
        // Second attempt: succeed
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ exists: true }),
        })
      }
    })

    await page.goto('/')

    // Wait for error page
    await page.waitForURL(/\/error/, { timeout: 5000 })

    // Click retry button
    const retryButton = page.getByRole('button', { name: /try again/i })
    await expect(retryButton).toBeVisible()
    await retryButton.click()

    // Should redirect to root and then to login
    await page.waitForURL('/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('should have "Return to Home" link on error page', async ({ page }) => {
    // Mock API to fail
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    // Wait for error page
    await page.waitForURL(/\/error/, { timeout: 5000 })

    // Check for "Return to Home" link
    const homeLink = page.getByRole('link', { name: /return to home/i })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute('href', '/')
  })

  test('should show appropriate icon on error page', async ({ page }) => {
    // Mock API to fail
    await page.route('http://localhost:3000/v1/api/center', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/')

    // Wait for error page
    await page.waitForURL(/\/error/, { timeout: 5000 })

    // Check that error icon container is visible (red background circle)
    const errorIcon = page.locator('div.bg-red-50.rounded-full')
    await expect(errorIcon).toBeVisible()
  })
})
