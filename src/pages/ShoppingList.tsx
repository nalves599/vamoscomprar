import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  RiAddCircleLine,
  RiBasketballLine,
  RiDeleteBin7Line,
} from 'react-icons/ri'

import { useList } from '../hooks/useList'
import { ListCode } from '../components/ListCode'
import { Product } from '../components/Product'
import { Button } from '../components/Button'
import logoImg from '../assets/images/logo.svg'

import '../styles/shopping-list.scss'

type ShoppingListParams = {
  listId: string
}

export function ShoppingList() {
  const [newProduct, setNewProduct] = useState<string>('')
  const params = useParams<ShoppingListParams>()

  const listId = params.listId

  const list = useList(listId)

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
          <h1>Compras para casa</h1>
          <span>3 produto(s) em falta</span>
        </div>

        <div className="main-content">
          <form>
            <input
              type="text"
              placeholder="Insira o nome do produto"
              onChange={(event) => setNewProduct(event.target.value)}
              value={newProduct}
            />
            <Button type="submit">
              <RiAddCircleLine size="1.5rem" />
              Adicionar produto
            </Button>
          </form>

          <div className="product-list">
            <Product name={'Pasta de dentes'} isChecked={false}></Product>
            <Product name={'Granola'} isChecked={false}></Product>
            <Product name={'Ração para o cão'} isChecked={false}></Product>
          </div>
          <div className="separator">Produtos adquiridos</div>
          <div className="product-list">
            <Product name={'Gel de banho'} isChecked>
              <button>
                <RiDeleteBin7Line size="1.5rem" />
              </button>
            </Product>
          </div>
        </div>
      </main>
    </div>
  )
}
