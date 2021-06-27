import { toast } from 'react-toastify'
import copyIcon from '../../assets/images/copy.svg'

import './styles.scss'

type ListCodeProps = {
  code: string
}

export function ListCode(props: ListCodeProps) {
  function copyListCodeToClipboard() {
    try {
      navigator.clipboard.writeText(props.code)
      toast.info('Código da lista copiado')
    } catch (err) {
      toast.warn('Erro ao copiar código')
      toast.info('O código da lista é ' + props.code)
    }
  }
  return (
    <button className="list-code" onClick={copyListCodeToClipboard}>
      <div>
        <img src={copyIcon} alt="Copy list code" />
      </div>
      <span>Lista #{props.code}</span>
    </button>
  )
}
