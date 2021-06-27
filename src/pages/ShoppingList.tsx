import { FormEvent, useEffect, useState } from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { RiAddCircleLine, RiDeleteBin7Line } from 'react-icons/ri'
import Modal from 'react-modal'

import { useList } from '../hooks/useList'
import { ListCode } from '../components/ListCode'
import { Product } from '../components/Product'
import { Button } from '../components/Button'
import logoImg from '../assets/images/logo.svg'

import '../styles/shopping-list.scss'
import { database } from '../services/firebase'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'

type User = {
  id: string
  name: string
  avatar: string
}

type ProductType = {
  id: string
  name: string
}

type List = {
  title: string
  author: User
  users: User[]
  missingProducts: number
  checkedProducts: ProductType[]
  toCheckProducts: ProductType[]
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

type ShoppingListParams = {
  listId: string
}

export function ShoppingList() {
  const history = useHistory()
  const [list, setList] = useState<List>()
  const [newProduct, setNewProduct] = useState<string>('')
  const params = useParams<ShoppingListParams>()
  const { user } = useAuth()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [newUserId, setNewUserId] = useState<string>('')

  const listId = params.listId

  const { lists } = useList()

  useEffect(() => {
    async function handleList() {
      const checked: ProductType[] = []
      const toCheck: ProductType[] = []
      let list = lists[listId]

      if (list) {
        list.products.forEach((product) => {
          const productToAdd = { id: product.id, name: product.name }
          if (product.isChecked) checked.push(productToAdd)
          else toCheck.push(productToAdd)
        })

        setList({
          title: list.title,
          author: list.author,
          missingProducts: toCheck.length,
          toCheckProducts: toCheck,
          checkedProducts: checked,
          users: list.users,
        })
      } else {
        const listRef = await database.ref(`/lists/${listId}`).get()

        if (!listRef.exists()) {
          toast.error('Lista inexistente')
          setTimeout(() => history.replace('/'), 2000)
          return
        }

        const databaseList: FirebaseList = listRef.val()
        Object.entries(databaseList.products ?? {}).forEach(([key, value]) => {
          const productToAdd = { id: key, name: value.name }
          if (value.isChecked) checked.push(productToAdd)
          else toCheck.push(productToAdd)
        })
        const users = Object.entries(databaseList.users || {}).map(
          ([key, value]) => {
            return { id: key, name: value.name, avatar: value.avatar }
          }
        )
        setList({
          title: databaseList.title,
          author: databaseList.author,
          missingProducts: toCheck.length,
          toCheckProducts: toCheck,
          checkedProducts: checked,
          users: users,
        })
      }
    }

    handleList()
  }, [lists, listId, history])

  async function handleAddProduct(event: FormEvent) {
    event.preventDefault()

    if (newProduct.trim() === '') return

    if (
      list &&
      user &&
      (list.author.id === user.id ||
        list.users.find((value) => user.id === value.id))
    ) {
      await database
        .ref(`lists/${listId}/products`)
        .push({ name: newProduct, isChecked: false })
      setNewProduct('')
    }
  }

  async function handleToogleCheck(productId: string, isChecked: boolean) {
    await database
      .ref(`lists/${listId}/products/${productId}`)
      .update({ isChecked: !isChecked })
  }

  async function handleDeleteProduct(productId: string) {
    await database.ref(`lists/${listId}/products/${productId}`).remove()
  }

  async function addUser(event: FormEvent) {
    event.preventDefault()

    if (newUserId.trim() === '') return

    const databaseUser = await database.ref(`/users/${newUserId}`).get()

    if (!databaseUser.exists()) {
      toast.error('O ID do utilizado é inválido')
      return
    }

    if (newUserId.trim() === user?.id) {
      toast.warning('Não se preocupe! Você já está na lista :)')
      return
    }

    await database.ref(`/users/${newUserId}/lists/${listId}`).set(list?.title)
    await database.ref(`/lists/${listId}/users/${newUserId}`).update({
      avatar: databaseUser.val().avatar,
      name: databaseUser.val().name,
    })
  }

  return (
    <div id="page-shopping-list">
      <header>
        <div className="content">
          <Link to={user ? '/lists' : '/'}>
            <img src={logoImg} alt="Vamos Comprar" />
          </Link>
          <div>
            <ListCode code={listId} />
            {user?.id === list?.author.id && (
              <Button onClick={() => setModalOpen(true)} isOutlined>
                Adicionar pessoas
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="list-title">
          <h1>{list?.title}</h1>
          <span>{list?.missingProducts || 0} produto(s) em falta</span>
        </div>

        <div className="main-content">
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Insira o nome do produto"
              onChange={(event) => setNewProduct(event.target.value)}
              value={newProduct}
              disabled={
                !user || !list?.users.find((val) => val.id === user?.id)
              }
            />
            <Button
              type="submit"
              disabled={
                !user || !list?.users.find((val) => val.id === user?.id)
              }
            >
              <RiAddCircleLine />
              Adicionar produto
            </Button>
          </form>

          <div className="product-list">
            {list?.toCheckProducts.map((product) => (
              <Product
                disabled={
                  !user || !list?.users.find((val) => val.id === user?.id)
                }
                key={product.id}
                name={product.name}
                isChecked={false}
                onToggleCheck={() => handleToogleCheck(product.id, false)}
              >
                {!(
                  !user || !list?.users.find((val) => val.id === user?.id)
                ) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <RiDeleteBin7Line />
                  </button>
                )}
              </Product>
            ))}
          </div>
          {list && list.checkedProducts.length > 0 && (
            <>
              <div className="separator">Produtos adquiridos</div>
              <div className="product-list">
                {list.checkedProducts.map((product) => (
                  <Product
                    key={product.id}
                    name={product.name}
                    isChecked
                    disabled={
                      !user || !list?.users.find((val) => val.id === user?.id)
                    }
                    onToggleCheck={() => handleToogleCheck(product.id, true)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Modal
        shouldCloseOnEsc
        onRequestClose={() => setModalOpen(false)}
        ariaHideApp={false}
        isOpen={isModalOpen}
        id="add-user-to-list"
      >
        <h2>Adicionar utilizador à sua lista</h2>
        <p>
          Insira o ID do utilizador que deseja adicionar
          <br />O seu ID é <strong>{user?.id}</strong>
        </p>
        <span>Utilizadores já adicionados</span>
        <div className="users-list">
          {list?.users?.map((user) => {
            return (
              <div key={user.id} className="user-info">
                <img src={user.avatar} alt={user.name} />
                <p>{user.name}</p>
              </div>
            )
          })}
        </div>
        <form onSubmit={addUser}>
          <input
            type="text"
            placeholder="Digite o ID"
            onChange={(event) => setNewUserId(event.target.value)}
            value={newUserId}
          />
          <Button type="submit">Adicionar utilizador</Button>
        </form>
      </Modal>
    </div>
  )
}
