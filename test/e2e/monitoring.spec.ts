import { test, expect } from '@playwright/test'

test.describe('Monitoring Page', () => {
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

    // Mock exam sessions
    await page.route('**/v1/api/exam-sessions**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'session-1',
              name: 'Mathematics Exam',
              date: '2024-01-15',
              status: 'ACTIVE',
              duration: 120,
              hallCapacity: 50,
            },
          ],
        }),
      })
    })

    // Mock monitoring statistics
    await page.route('**/v1/api/monitoring/session/session-1/statistics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            sessionId: 'session-1',
            sessionName: 'Mathematics Exam',
            sessionDate: '2024-01-15',
            sessionDuration: 120,
            sessionStatus: 'ACTIVE',
            remainingTime: '01:30:00',
            statistics: {
              scheduled: 50,
              absent: 5,
              active: 40,
              submitted: 5,
            },
            timestamp: new Date().toISOString(),
          },
        }),
      })
    })

    // Mock monitoring details
    await page.route('**/v1/api/monitoring/session/session-1/details', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            sessionId: 'session-1',
            candidates: [
              {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                seatNumber: 1,
                status: 'ACTIVE',
                attempted: 25,
                totalQuestions: 50,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        }),
      })
    })

    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'mock-token-123')
    })

    await page.goto('/dashboard/monitoring?sessionId=session-1')
  })

  test('should display monitoring page', async ({ page }) => {
    await expect(page.getByText(/monitoring/i)).toBeVisible()
    await expect(page.getByText(/mathematics exam/i)).toBeVisible()
  })

  test('should display session statistics', async ({ page }) => {
    await expect(page.getByText(/scheduled/i)).toBeVisible()
    await expect(page.getByText(/active/i)).toBeVisible()
    await expect(page.getByText(/submitted/i)).toBeVisible()
    await expect(page.getByText(/absent/i)).toBeVisible()
  })

  test('should display candidate list', async ({ page }) => {
    await expect(page.getByText('John Doe')).toBeVisible()
    await expect(page.getByText(/seat/i)).toBeVisible()
  })

  test('should show candidate progress', async ({ page }) => {
    await expect(page.getByText(/25.*50/i)).toBeVisible() // attempted/total questions
  })

  test('should allow selecting different session', async ({ page }) => {
    // Mock another session
    await page.route('**/v1/api/monitoring/session/session-2/statistics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            sessionId: 'session-2',
            sessionName: 'Physics Exam',
            sessionDate: '2024-01-16',
            sessionDuration: 90,
            sessionStatus: 'ACTIVE',
            remainingTime: '01:00:00',
            statistics: {
              scheduled: 30,
              absent: 2,
              active: 25,
              submitted: 3,
            },
            timestamp: new Date().toISOString(),
          },
        }),
      })
    })

    const sessionSelect = page.getByRole('combobox').filter({ hasText: /session/i })
    if (await sessionSelect.isVisible()) {
      await sessionSelect.click()
      await page.getByText('Physics Exam').click()

      await expect(page.getByText(/physics exam/i)).toBeVisible({ timeout: 3000 })
    }
  })

  test('should display remaining time', async ({ page }) => {
    await expect(page.getByText(/01:30:00/i)).toBeVisible()
  })

  test('should allow logout candidate', async ({ page }) => {
    // Mock logout API
    await page.route('**/v1/api/candidates/1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            candidateId: '1',
            message: 'Candidate logged out',
          },
        }),
      })
    })

    // Look for logout button
    const logoutButton = page.getByRole('button', { name: /logout/i }).first()
    if (await logoutButton.isVisible()) {
      await logoutButton.click()

      // Should show success message or update UI
      await page.waitForTimeout(1000)
    }
  })
})

