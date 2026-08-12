import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/v1/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '1',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            centerId: 'center-1',
            permissions: ['read', 'write'],
          },
        }),
      })
    })

    // Mock metrics API
    await page.route('**/v1/api/metrics/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            system: {
              server: { status: 'healthy', uptime: 3600000 },
              cpu: { usage: 45.5, average: 40.2 },
              memory: { used: 2147483648, total: 8589934592, percentage: 25.0 },
              requests: { perSecond: 10.5, total: 1000 },
            },
            business: {
              centers: { total: 5, active: 3 },
              admins: { total: 10, active: 8 },
              sessions: { active: 2 },
              security: { failedLogins: 2 },
            },
            connections: {
              clients: { active: 15, peak: 20 },
              database: { active: 5, max: 10, idle: 3 },
              redis: { connected: true },
            },
            performance: {
              responseTime: { average: 150, p95: 300, p99: 500 },
              errorRate: { percentage: 0.5, count: 5 },
            },
          },
        }),
      })
    })

    // Set auth token
    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'mock-token-123')
    })

    await page.goto('/dashboard')
  })

  test('should display dashboard with welcome message', async ({ page }) => {
    await expect(page.getByText(/welcome back/i)).toBeVisible()
    await expect(page.getByText(/admin/i)).toBeVisible()
  })

  test('should display system health metrics', async ({ page }) => {
    await expect(page.getByText(/server status/i)).toBeVisible()
    await expect(page.getByText(/cpu usage/i)).toBeVisible()
    await expect(page.getByText(/memory/i)).toBeVisible()
    await expect(page.getByText(/connected clients/i)).toBeVisible()
  })

  test('should display business metrics', async ({ page }) => {
    await expect(page.getByText(/total centers/i)).toBeVisible()
    await expect(page.getByText(/total admins/i)).toBeVisible()
    await expect(page.getByText(/active sessions/i)).toBeVisible()
    await expect(page.getByText(/failed logins/i)).toBeVisible()
  })

  test('should display performance metrics', async ({ page }) => {
    await expect(page.getByText(/avg response time/i)).toBeVisible()
    await expect(page.getByText(/error rate/i)).toBeVisible()
  })

  test('should navigate to different sections via sidebar', async ({ page }) => {
    // Test navigation to centers
    await page.getByRole('link', { name: /centers/i }).click()
    await page.waitForURL('/dashboard/centers', { timeout: 3000 })
    expect(page.url()).toContain('/dashboard/centers')

    // Navigate back to dashboard
    await page.getByRole('link', { name: /dashboard/i }).click()
    await page.waitForURL('/dashboard', { timeout: 3000 })

    // Test navigation to admins
    await page.getByRole('link', { name: /admins/i }).click()
    await page.waitForURL('/dashboard/admins', { timeout: 3000 })
  })

  test('should show loading state initially', async ({ page }) => {
    // Navigate to dashboard without mocking metrics initially
    await page.route('**/v1/api/metrics/dashboard', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            system: { server: { status: 'healthy' } },
            business: { centers: { total: 0 } },
            connections: { clients: { active: 0 } },
            performance: { responseTime: { average: 0 } },
          },
        }),
      })
    })

    await page.goto('/dashboard')

    // Should show loading spinner
    const spinner = page.locator('[class*="animate-spin"]')
    await expect(spinner).toBeVisible({ timeout: 1000 })
  })
})

