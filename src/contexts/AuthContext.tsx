import { createContext, ReactNode, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { auth, firebase, database } from '../services/firebase'

type User = {
  id: string
  name: string
  avatar: string
  lists: string[]
}

type AuthContextType = {
  user: User | undefined
  signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL)
          throw new Error('Missing informations from Google Account!')

        database.ref(`users/${uid}/lists`).on('value', (userListsRef) => {
          let listsCodes: string[] = []

          if (userListsRef.exists())
            listsCodes = Object.entries(userListsRef.val()).map(([key]) => key)

          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
            lists: listsCodes,
          })
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        toast.error('Necessita de fotografia e nome na sua conta Google')
        throw new Error('Missing informations from Google Account!')
      }

      database.ref(`users/${uid}/lists`).on('value', (userListsRef) => {
        let listsCodes: string[] = []

        if (userListsRef.exists())
          listsCodes = Object.entries(userListsRef.val()).map(([key]) => key)

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          lists: listsCodes,
        })
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
