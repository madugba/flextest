import { useEffect, useState } from 'react'
import { proxyFetch } from '../lib/proxyFetch'
import {
  deriveClassesUrl,
  deriveClassModulesUrl,
  deriveModulesUrl,
  extractClasses,
  extractModules,
} from '../lib/catalog'
import type { APIConfiguration, Module, SchoolClass } from './types'

/**
 * Loads the class list and the module catalog for the selected push API's
 * flexdesk host, optionally narrowed to one class (modules only, not classes
 * — flexdesk has no `?classId=` filter, so a class-scoped fetch hits a
 * separate nested endpoint).
 */
export function useModuleCatalog(pushApiConfig: APIConfiguration | null, enabled: boolean) {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [classesError, setClassesError] = useState<string | null>(null)

  const [allModules, setAllModules] = useState<Module[]>([])
  const [isLoadingAllModules, setIsLoadingAllModules] = useState(false)
  const [modulesError, setModulesError] = useState<string | null>(null)

  const [selectedClassId, setSelectedClassId] = useState('')
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [isLoadingFilteredModules, setIsLoadingFilteredModules] = useState(false)

  useEffect(() => {
    if (!enabled || !pushApiConfig) return
    let cancelled = false
    const apiKey = pushApiConfig.apiKey ?? undefined

    setIsLoadingClasses(true)
    setClassesError(null)
    proxyFetch(deriveClassesUrl(pushApiConfig.apiEndpoint), { apiKey })
      .then((raw) => { if (!cancelled) setClasses(extractClasses(raw)) })
      .catch((err) => { if (!cancelled) setClassesError(err instanceof Error ? err.message : 'Failed to load classes') })
      .finally(() => { if (!cancelled) setIsLoadingClasses(false) })

    setIsLoadingAllModules(true)
    setModulesError(null)
    proxyFetch(deriveModulesUrl(pushApiConfig.apiEndpoint), { apiKey })
      .then((raw) => { if (!cancelled) setAllModules(extractModules(raw)) })
      .catch((err) => { if (!cancelled) setModulesError(err instanceof Error ? err.message : 'Failed to load modules') })
      .finally(() => { if (!cancelled) setIsLoadingAllModules(false) })

    return () => { cancelled = true }
  }, [enabled, pushApiConfig])

  useEffect(() => {
    if (!selectedClassId || !pushApiConfig) {
      setFilteredModules([])
      return
    }
    let cancelled = false
    setIsLoadingFilteredModules(true)
    proxyFetch(deriveClassModulesUrl(pushApiConfig.apiEndpoint, selectedClassId), {
      apiKey: pushApiConfig.apiKey ?? undefined,
    })
      .then((raw) => { if (!cancelled) setFilteredModules(extractModules(raw)) })
      .catch((err) => { if (!cancelled) setModulesError(err instanceof Error ? err.message : 'Failed to load modules for class') })
      .finally(() => { if (!cancelled) setIsLoadingFilteredModules(false) })

    return () => { cancelled = true }
  }, [selectedClassId, pushApiConfig])

  const modules = selectedClassId ? filteredModules : allModules
  const isLoadingModules = selectedClassId ? isLoadingFilteredModules : isLoadingAllModules

  return {
    classes,
    isLoadingClasses,
    classesError,
    modules,
    isLoadingModules,
    modulesError,
    selectedClassId,
    setSelectedClassId,
  }
}
