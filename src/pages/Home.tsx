import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RiEyeLine } from 'react-icons/ri'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { Button } from '../components/Button'

import logoImg from '../assets/images/logo.svg'
import listaImg from '../assets/images/list.svg'
import googleImg from '../assets/images/google.svg'

import '../styles/auth.scss'

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [listId, setListId] = useState<string>('')

  async function handleSignIn() {
    let userId = user?.id
    if (!user) userId = await signInWithGoogle()

    const databaseUser = await database.ref(`users/${userId}`).get()

    if (databaseUser.exists()) {
      history.push('/lists')
      return
    }

    history.push('/lists/new')
  }

  async function handleViewShoppingList(event: FormEvent) {
    event.preventDefault()

    if (listId.trim() === '') return

    const listRef = await database.ref(`lists/${listId}`).get()

    if (!listRef.exists()) {
      toast.error('Lista de compras inválida')
      return
    }

    if (listRef.val().completedAt) {
      toast.warn('Lista já se encontra concluída')
      return
    }

    history.push(`/lists/${listId}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={listaImg}
          alt="Ilustração representando uma pessoa com uma lista de compras"
        />
        <strong>Escolha já as suas compras</strong>
        <p>Poupe, sabendo o que vai querer</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Vamos Comprar" />
          <button className="sign-in" onClick={handleSignIn}>
            <img src={googleImg} alt="Logo da Google" />
            Entre com a sua conta Google
          </button>
          <div className="separator">ou veja uma lista de compras</div>
          <form onSubmit={handleViewShoppingList}>
            <input
              type="text"
              placeholder="Insira o código da lista"
              onChange={(event) => setListId(event.target.value)}
              value={listId}
            />
            <Button type="submit">
              <RiEyeLine />
              Ver lista de compras
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
