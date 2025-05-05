'use client'

import { createContext, SetStateAction, useContext, useState } from 'react'

interface IContextType {
  categoryFilters: string[]
  setCategoryFilter: React.Dispatch<SetStateAction<string[]>>
  sort: string
  setSort: React.Dispatch<SetStateAction<string>>
}

export const INITIAL_FILTER_DATA: IContextType = {
  categoryFilters: [],
  setCategoryFilter: () => {},
  sort: '',
  setSort: () => {},
}

const FilterContext = createContext<IContextType>(INITIAL_FILTER_DATA)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryFilters, setCategoryFilter] = useState([])
  const [sort, setSort] = useState('-createdAt')
  return (
    <FilterContext.Provider
      value={{
        categoryFilters,
        setCategoryFilter,
        sort,
        setSort,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => useContext(FilterContext)
