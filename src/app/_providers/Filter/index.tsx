'use client'

import { createContext, SetStateAction, useContext, useState } from 'react'

interface IContextType {
  categoryFilters: string[]
  setCategoryFilter: React.Dispatch<SetStateAction<string[]>>
  sort: string
  setSort: React.Dispatch<SetStateAction<string>>
  date: string
  setDate: React.Dispatch<SetStateAction<string>>
  tags: string[] // Add tags
  setTags: React.Dispatch<SetStateAction<string[]>> // Add setTags function
}

const INITIAL_FILTER_DATA: IContextType = {
  categoryFilters: [],
  setCategoryFilter: () => {},
  sort: '',
  setSort: () => {},
  date: '',
  setDate: () => {},
  tags: [], // Initialize tags as an empty array
  setTags: () => {}, // Initialize setTags function
}

const FilterContext = createContext<IContextType>(INITIAL_FILTER_DATA)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryFilters, setCategoryFilter] = useState([])
  const [sort, setSort] = useState('-createdAt')
  const [date, setDate] = useState('2025-06')
  const [tags, setTags] = useState<string[]>([]) // Manage tags here

  return (
    <FilterContext.Provider
      value={{ categoryFilters, setCategoryFilter, sort, setSort, date, setDate, tags, setTags }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => useContext(FilterContext)
