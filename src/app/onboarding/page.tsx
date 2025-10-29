import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/shared/ui/Button'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md p-8">

        {/* Logo and text on separate lines */}
        <div className="mb-4 flex flex-col items-center gap-3">
          <div className="relative">
            <Image
              src="/logo-small.png"
              alt="FlexTest"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            FlexTest
          </h1>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Let&apos;s get started by setting up your center
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Setup Steps
          </h2>
          <ul className="space-y-3 text-gray-600 mb-6">
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">1.</span>
              <span>Configure your center details</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">2.</span>
              <span>Configure admin information</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">3.</span>
              <span>Preview and submit</span>
            </li>
          </ul>
          <Link href="/onboarding/setup">
            <Button className="w-full h-12">
              Proceed to Setup
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
