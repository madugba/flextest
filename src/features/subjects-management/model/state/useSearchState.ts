'use client'

import { useState } from 'react'

export function useSearchState() {
  const [search, setSearch] = useState('')

  return { search, setSearch }
}
