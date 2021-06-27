import React from 'react'
import { useHistory } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'

import { List } from '../components/List'
import { useAuth } from '../hooks/useAuth'
import { useList } from '../hooks/useList'

import '../styles/user-lists.scss'

export function UserLists() {
  const history = useHistory()
  const { user } = useAuth()
  const { lists, removeList } = useList()

  function handleGoToShoppingList(listId: string) {
    history.push(`/lists/${listId}`)
  }

  async function handleDeleteList(listId: string) {
    removeList(listId)
  }

  return (
    <div id="page-user-lists">
      <header>
        <div className="content">
          <img src={logoImg} alt="Vamos Comprar" />
          <div></div>
        </div>
      </header>

      <main>
        <div className="list-title">
          <h1>Listas de compras</h1>
          <span>
            {Object.values(lists ?? {}).reduce(
              (sum, { missingProducts }) => sum + missingProducts,
              0
            )}{' '}
            produto(s) em falta
          </span>
        </div>

        <div className="main-content">
          {Object.entries(lists ?? {}).map(([key, list]) => {
            return (
              <List
                key={key}
                title={list.title}
                missingProducts={list.missingProducts}
                productsCount={list.productsCount}
                author={list.author}
                isFromUser={user?.id === list.author.id}
                handleGoToShoppingList={() => handleGoToShoppingList(key)}
                handleDeleteList={() => handleDeleteList(key)}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}
