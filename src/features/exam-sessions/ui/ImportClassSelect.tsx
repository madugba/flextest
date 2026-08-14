interface ImportClassSelectProps {
  selectedClass: string
  onClassChange: (value: string) => void
}

export function ImportClassSelect({ selectedClass, onClassChange }: ImportClassSelectProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        Class <span className="text-red-500">*</span>
      </label>
      <select
        aria-label="Select a class"
        value={selectedClass}
        onChange={(e) => onClassChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Select a class...</option>
      </select>
      <p className="mt-1 text-xs text-gray-500">Select the class for school portal import</p>
    </div>
  )
}
