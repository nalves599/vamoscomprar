import { FormEvent, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { RiAddCircleLine, RiDeleteBin7Line } from 'react-icons/ri'

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
        setList({
          title: databaseList.title,
          author: databaseList.author,
          missingProducts: toCheck.length,
          toCheckProducts: toCheck,
          checkedProducts: checked,
          users: databaseList.users,
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

  return (
    <div id="page-shopping-list">
      <header>
        <div className="content">
          <img src={logoImg} alt="Vamos Comprar" />
          <div>
            <ListCode code={listId} />
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
            />
            <Button type="submit">
              <RiAddCircleLine />
              Adicionar produto
            </Button>
          </form>

          <div className="product-list">
            {list?.toCheckProducts.map((product) => (
              <Product
                key={product.id}
                name={product.name}
                isChecked={false}
                onToggleCheck={() => handleToogleCheck(product.id, false)}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <RiDeleteBin7Line />
                </button>
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
                    onToggleCheck={() => handleToogleCheck(product.id, true)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
