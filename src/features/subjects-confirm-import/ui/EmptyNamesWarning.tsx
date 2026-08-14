export function EmptyNamesWarning() {
  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-sm text-yellow-800">
        ⚠️ Some subjects have empty names and will be skipped during import
      </p>
    </div>
  )
}
