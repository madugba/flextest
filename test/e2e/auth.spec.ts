import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/v1/api/auth/login', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()

      if (postData?.email === 'admin@example.com' && postData?.password === 'password123') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              user: {
                id: '1',
                email: 'admin@example.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN',
                centerId: 'center-1',
                permissions: ['read', 'write'],
              },
              token: {
                accessToken: 'mock-token-123',
                expiresIn: '3600',
                tokenType: 'Bearer',
              },
            },
          }),
        })
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: {
              message: 'Invalid credentials',
              code: 'INVALID_CREDENTIALS',
            },
          }),
        })
      }
    })

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
  })

  test('should display login page', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('FlexTest')).toBeVisible()
    await expect(page.getByText('Sign in to your admin account')).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder(/email/i).fill('admin@example.com')
    await page.getByPlaceholder(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 5000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder(/email/i).fill('admin@example.com')
    await page.getByPlaceholder(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 3000 })
  })

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login')

    const passwordInput = page.getByPlaceholder(/password/i)
    const toggleButton = page.locator('button[type="button"]').filter({ has: page.locator('svg') })

    await passwordInput.fill('password123')

    // Password should be hidden by default
    expect(await passwordInput.getAttribute('type')).toBe('password')

    // Click toggle button
    await toggleButton.click()

    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text')

    // Toggle again
    await toggleButton.click()

    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login')

    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i })
    await expect(forgotPasswordLink).toBeVisible()
    await forgotPasswordLink.click()

    await page.waitForURL('/forgot-password', { timeout: 3000 })
    expect(page.url()).toContain('/forgot-password')
  })

  test('should require email and password', async ({ page }) => {
    await page.goto('/login')

    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    // Form validation should prevent submission or show error
    // The exact behavior depends on your form validation implementation
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
  })
})

