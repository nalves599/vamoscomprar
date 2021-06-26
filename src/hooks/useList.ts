import { useContext } from 'react'
import { ListsContext } from '../contexts/ListsContext'

export function useList() {
  const value = useContext(ListsContext)

  return value
}
