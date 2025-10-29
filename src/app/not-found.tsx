import Link from 'next/link'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Page Not Found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved or deleted.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please{' '}
            <a href="mailto:support@flextest.com" className="text-primary hover:underline">
              contact support
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}

export const metadata = {
  title: '404 - Page Not Found | FlexTest',
  description: 'The page you are looking for could not be found.',
}
