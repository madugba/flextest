import { Loader2 } from 'lucide-react'
import type { Module, SchoolClass, SubjectModuleMapping, SubjectRef } from '../model/types'

interface ModuleMappingStepProps {
  subjects: SubjectRef[]
  classes: SchoolClass[]
  isLoadingClasses: boolean
  classesError: string | null
  modules: Module[]
  isLoadingModules: boolean
  modulesError: string | null
  selectedClassId: string
  onSelectedClassIdChange: (id: string) => void
  mapping: SubjectModuleMapping
  onSubjectModuleChange: (subjectId: string, moduleId: string) => void
}

const selectCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white disabled:opacity-60 disabled:cursor-not-allowed'
const labelCls = 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'

export function ModuleMappingStep({
  subjects,
  classes,
  isLoadingClasses,
  classesError,
  modules,
  isLoadingModules,
  modulesError,
  selectedClassId,
  onSelectedClassIdChange,
  mapping,
  onSubjectModuleChange,
}: ModuleMappingStepProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className={labelCls}>
          Filter modules by class <span className="text-gray-400 normal-case font-normal">(optional)</span>
        </label>
        <select
          aria-label="Filter modules by class"
          value={selectedClassId}
          onChange={(e) => onSelectedClassIdChange(e.target.value)}
          disabled={isLoadingClasses}
          className={selectCls}
        >
          <option value="">All classes ({modules.length} modules)</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {classesError && <p className="text-xs text-red-600">{classesError}</p>}
      </div>

      <div className="space-y-1.5">
        <label className={labelCls}>Map each subject to a module</label>
        {isLoadingModules ? (
          <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading modules…
          </div>
        ) : modulesError ? (
          <p className="text-xs text-red-600">{modulesError}</p>
        ) : (
          <div className="border border-gray-200 rounded-lg divide-y max-h-56 overflow-y-auto">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center gap-3 px-3 py-2">
                <span className="text-sm text-gray-700 flex-1 min-w-0 truncate">{subject.name}</span>
                <select
                  aria-label={`Map ${subject.name} to a module`}
                  value={mapping[subject.id] ?? ''}
                  onChange={(e) => onSubjectModuleChange(subject.id, e.target.value)}
                  className="w-1/2 px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                >
                  <option value="">Select module…</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
