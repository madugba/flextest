import type { APIConfiguration } from '@/entities/api-configuration'
import { labelCls, selectCls } from './import-form-classes'

interface StudentApiSelectorProps {
  studentApiId: string
  onStudentApiChange: (id: string) => void
  apiConfigurations: APIConfiguration[]
}

export function StudentApiSelector({
  studentApiId,
  onStudentApiChange,
  apiConfigurations,
}: StudentApiSelectorProps) {
  return (
    <div>
      <label className={labelCls}>API Configuration</label>
      <select
        aria-label="Select API for students"
        value={studentApiId}
        onChange={(e) => onStudentApiChange(e.target.value)}
        className={selectCls}
      >
        <option value="">Select an API configuration…</option>
        {apiConfigurations.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
