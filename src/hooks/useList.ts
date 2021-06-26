import { useContext } from 'react'
import { ListsContext } from '../contexts/ListsContext'

export function useList(listCode: string) {
  const { lists } = useContext(ListsContext)

  const list = lists[listCode]

  return list
}
