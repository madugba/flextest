export function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'submitted':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'flagged':
      return 'bg-red-100 text-red-700 border-red-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}
