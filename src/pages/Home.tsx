import { RiEyeLine } from 'react-icons/ri'

import { Button } from '../components/Button'

import logoImg from '../assets/images/logo.svg'
import listaImg from '../assets/images/lista.svg'
import googleImg from '../assets/images/google.svg'

import '../styles/auth.scss'

export function Home() {
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
          <button className="sign-in">
            <img src={googleImg} alt="Logo da Google" />
            Entre com a sua conta Google
          </button>
          <div className="separator">ou veja uma lista de compras</div>
          <form>
            <input type="text" placeholder="Insira o código da lista" />
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
