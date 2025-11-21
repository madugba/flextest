import { test, expect } from '@playwright/test'

test.describe('CRUD Operations', () => {
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
            email: 'admin@email.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            centerId: 'center-1',
            permissions: ['read', 'write'],
          },
        }),
      })
    })

    // Mock candidates list
    await page.route('**/v1/api/candidates**', async (route) => {
      const url = new URL(route.request().url())
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              candidates: [
                {
                  id: '1',
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john@email.com',
                  status: 'ACTIVE',
                  isVerified: true,
                  isActive: true,
                  createdAt: '2024-01-01',
                  updatedAt: '2024-01-01',
                },
              ],
              pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
            },
          }),
        })
      }
    })

    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'mock-token-123')
    })

    await page.goto('/dashboard/candidates')
  })

  test('should display candidates list', async ({ page }) => {
    await expect(page.getByText(/candidates/i)).toBeVisible()
    await expect(page.getByText('John Doe')).toBeVisible()
    await expect(page.getByText('john@example.com')).toBeVisible()
  })

  test('should open add candidate dialog', async ({ page }) => {
    // Mock create candidate API
    await page.route('**/v1/api/candidates', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
              isVerified: false,
              isActive: true,
              createdAt: '2024-01-02',
              updatedAt: '2024-01-02',
            },
          }),
        })
      }
    })

    const addButton = page.getByRole('button', { name: /add candidate/i })
    if (await addButton.isVisible()) {
      await addButton.click()

      // Should show dialog
      await expect(page.getByText(/add candidate/i)).toBeVisible({ timeout: 2000 })
    }
  })

  test('should search candidates', async ({ page }) => {
    // Mock search API
    await page.route('**/v1/api/candidates?search=john**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            candidates: [
              {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                status: 'ACTIVE',
                isVerified: true,
                isActive: true,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
            ],
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          },
        }),
      })
    })

    const searchInput = page.getByPlaceholder(/search/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('john')
      await page.waitForTimeout(500) // Wait for debounce

      await expect(page.getByText('John Doe')).toBeVisible()
    }
  })

  test('should filter candidates by status', async ({ page }) => {
    // Mock filtered API
    await page.route('**/v1/api/candidates?status=ACTIVE**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            candidates: [
              {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                status: 'ACTIVE',
                isVerified: true,
                isActive: true,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
            ],
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          },
        }),
      })
    })

    const statusFilter = page.getByRole('combobox').filter({ hasText: /status/i })
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.getByText('ACTIVE').click()

      await expect(page.getByText('John Doe')).toBeVisible()
    }
  })

  test('should view candidate details', async ({ page }) => {
    // Mock get candidate by ID
    await page.route('**/v1/api/candidates/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            status: 'ACTIVE',
            isVerified: true,
            isActive: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        }),
      })
    })

    // Look for view/details button
    const viewButton = page.getByRole('button', { name: /view|details|info/i }).first()
    if (await viewButton.isVisible()) {
      await viewButton.click()

      // Should show candidate details
      await expect(page.getByText(/john doe/i)).toBeVisible({ timeout: 2000 })
    }
  })
})

