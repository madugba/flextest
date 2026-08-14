import type { APIConfiguration } from '@/entities/api-configuration'
import { XCircle } from 'lucide-react'
import { StepCard } from './StepCard'
import { labelCls, selectCls } from './import-form-classes'
import type { ClassEntry, StepStatus } from '../model/types'

export function ImportClassesStep({
  status,
  classApiId,
  onClassApiChange,
  apiConfigurations,
  classApiConfig,
  classesError,
  classes,
  selectedClassId,
  onClassChange,
}: {
  status: StepStatus
  classApiId: string
  onClassApiChange: (id: string) => void
  apiConfigurations: APIConfiguration[]
  classApiConfig: APIConfiguration | null
  classesError: string | null
  classes: ClassEntry[]
  selectedClassId: string
  onClassChange: (id: string) => void
}) {
  return (
    <StepCard
      number={1}
      title="Load Classes"
      status={status}
      badge={
        selectedClassId
          ? classes.find(c => c.classid === selectedClassId)?.classname
          : classes.length ? `${classes.length} classes available` : undefined
      }
      collapsible
    >
      <div>
        <label className={labelCls}>API Configuration</label>
        <select
          aria-label="Select API for classes"
          value={classApiId}
          onChange={(e) => onClassApiChange(e.target.value)}
          className={selectCls}
        >
          <option value="">Select an API configuration…</option>
          {apiConfigurations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {classApiConfig && (
          <p className="mt-1 text-xs text-gray-400 font-mono truncate" title={classApiConfig.apiEndpoint}>
            {classApiConfig.apiEndpoint}
          </p>
        )}
      </div>

      {classesError && (
        <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1">
          <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {classesError}
        </p>
      )}

      {classes.length > 0 && (
        <div>
          <label className={labelCls}>Select Class</label>
          <select
            aria-label="Select a class"
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
            className={selectCls}
          >
            <option value="">Choose a class…</option>
            {classes.map(({ classid, classname }) => (
              <option key={classid} value={classid}>{classname}</option>
            ))}
          </select>
        </div>
      )}
    </StepCard>
  )
}
