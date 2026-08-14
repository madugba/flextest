interface DashboardGreetingProps {
  firstName: string
}

export function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}!</h2>
        <p className="text-gray-600 mt-1">Monitor your system in real-time</p>
      </div>
    </section>
  )
}
