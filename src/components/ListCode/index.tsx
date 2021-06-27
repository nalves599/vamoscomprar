import { toast } from 'react-toastify'
import copyIcon from '../../assets/images/copy.svg'

import './styles.scss'

type ListCodeProps = {
  code: string
}

export function ListCode(props: ListCodeProps) {
  function copyListCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
    toast.info('Código da lista copiado')
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
