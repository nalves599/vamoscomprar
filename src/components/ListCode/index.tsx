import copyIcon from '../../assets/images/copy.svg'

import './styles.scss'

type ListCodeProps = {
  code: string
}

export function ListCode(props: ListCodeProps) {
  function copyListCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
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
