import { Button } from '../components/Button'

import logoImg from '../assets/images/logo.svg'
import listaImg from '../assets/images/compras.svg'

import '../styles/auth.scss'

export function NewShoppingList() {
  return (
    <div id="page-auth">
      <aside>
        <img
          src={listaImg}
          alt="Ilustração representando uma pessoa a fazer compras"
        />
        <strong>Escolha já as suas compras</strong>
        <p>Poupe, sabendo o que vai querer</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Vamos Comprar" />
          <h2>Crie uma nova lista </h2>
          <form>
            <input
              type="text"
              placeholder="Insira o nome da lista de compras"
            />
            <Button type="submit">Criar lista de compras</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
