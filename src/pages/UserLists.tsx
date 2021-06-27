import React from 'react'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { useHistory } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'

import { List } from '../components/List'
import { UserCode } from '../components/UserCode'
import { useAuth } from '../hooks/useAuth'
import { useList } from '../hooks/useList'

import '../styles/user-lists.scss'

export function UserLists() {
  const history = useHistory()
  const { user, signOut } = useAuth()
  const { lists, removeList, clearLists } = useList()

  function handleCreateShoppingList() {
    history.push('/lists/new')
  }

  function handleGoToShoppingList(listId: string) {
    history.push(`/lists/${listId}`)
  }

  async function handleDeleteList(listId: string) {
    removeList(listId)
  }

  async function handleSignOut() {
    await signOut()
    clearLists()

    history.replace('/')
  }

  return (
    <div id="page-user-lists">
      <header>
        <div className="content">
          <img src={logoImg} alt="Vamos Comprar" />
          <div>
            <UserCode code={user?.id || ''} label={user?.name || ''} />
            <Button isOutlined onClick={handleCreateShoppingList}>
              Criar lista de compras
            </Button>
            <button
              type="button"
              className="exit-button"
              onClick={handleSignOut}
            >
              <RiLogoutBoxRLine />
            </button>
          </div>
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
