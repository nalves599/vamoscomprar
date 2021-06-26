import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Button } from '../components/Button'

import logoImg from '../assets/images/logo.svg'
import listaImg from '../assets/images/list.svg'

import '../styles/auth.scss'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

export function NewShoppingList() {
  const history = useHistory()
  const [listName, setListName] = useState<string>('')
  const { user } = useAuth()

  async function handleCreateShoppingList(event: FormEvent) {
    event.preventDefault()

    if (listName.trim() === '') return

    if (user) {
      const listsRef = database.ref('lists') // Reference to collection
      const firebaseList = await listsRef.push({
        title: listName,
        author: { id: user.id, name: user.name, avatar: user.avatar },
      })
      await database
        .ref(`/users/${user.id}/lists/${firebaseList.key}`)
        .set(listName)

      history.push(`/lists/${firebaseList.key}`)
    }
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
          <h2>Crie uma nova lista</h2>
          <form onSubmit={handleCreateShoppingList}>
            <input
              type="text"
              placeholder="Insira o nome da lista de compras"
              onChange={(event) => setListName(event.target.value)}
              value={listName}
            />
            <Button type="submit">Criar lista de compras</Button>
          </form>
          <p>
            Quer ver uma lista já existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
