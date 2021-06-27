import { toast } from 'react-toastify'
import copyIcon from '../../assets/images/copy.svg'

import './styles.scss'

type UserCodeProps = {
  code: string
  label?: string
}

export function UserCode(props: UserCodeProps) {
  function copyUserCodeToClipboard() {
    try {
      navigator.clipboard.writeText(props.code)
      toast.info('Código do utilizador copiado')
    } catch (err) {
      toast.warn('Erro ao copiar código')
      toast.info('O código do utilizador é ' + props.code)
    }
  }

  return (
    <button className="user-code" onClick={copyUserCodeToClipboard}>
      <div>
        <img src={copyIcon} alt="Copy user code" />
      </div>
      <span>User #{props.label || props.code}</span>
    </button>
  )
}
