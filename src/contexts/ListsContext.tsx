import { createContext, ReactNode, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

type User = {
  id: string
  name: string
  avatar: string
}

type Product = {
  id: string
  name: string
  isChecked: boolean
}

type ShoppingList = {
  title: string
  author: User
  users: User[]
  missingProducts: number
  productsCount: number
  products: Product[]
  isCompleted: boolean
}

type FirebaseList = {
  author: User
  title: string
  users: User[]
  products: Record<
    string,
    {
      name: string
      isChecked: boolean
    }
  >
  isCompleted: boolean
}

type ListsContextType = {
  lists: Record<string, ShoppingList>
}

type ListsContextProviderProps = {
  children: ReactNode
}

export const ListsContext = createContext({} as ListsContextType)

export function ListsContextProvider({ children }: ListsContextProviderProps) {
  const [lists, setLists] = useState<Record<string, ShoppingList>>({})
  const { user } = useAuth()

  useEffect(() => {
    const databaseRefs = user?.lists.map((listCode) => {
      const databaseRef = database.ref(`lists/${listCode}`)

      databaseRef.on('value', (list) => {
        const databaseList = list.val()
        const firebaseList: FirebaseList = databaseList ?? {}
        let missingProducts = 0

        const products = Object.entries(firebaseList.products || {}).map(
          ([key, value]) => {
            if (!value.isChecked) missingProducts++
            return {
              id: key,
              name: value.name,
              isChecked: value.isChecked,
            }
          }
        )

        setLists((lists) => {
          return {
            ...lists,
            [listCode]: {
              author: firebaseList.author,
              title: firebaseList.title,
              users: firebaseList.users,
              missingProducts,
              products,
              productsCount: products.length,
              isCompleted: firebaseList.isCompleted,
            },
          }
        })
      })

      return databaseRef
    })

    return () => {
      databaseRefs?.forEach((databaseRef) => databaseRef.off('value'))
    }
  }, [user?.lists])

  return (
    <ListsContext.Provider value={{ lists }}>{children}</ListsContext.Provider>
  )
}
