import { createContext, useContext } from 'react'

type SearchContextValue = {
  search: string
  setSearch: (value: string) => void
  debouncedSearch: string
}

export const SearchContext = createContext<SearchContextValue>({
  search: '',
  setSearch: () => {},
  debouncedSearch: '',
})

export const useSearch = () => useContext(SearchContext)
