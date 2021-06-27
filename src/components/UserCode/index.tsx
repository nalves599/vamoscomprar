import copyIcon from '../../assets/images/copy.svg'

import './styles.scss'

type UserCodeProps = {
  code: string
  label?: string
}

export function UserCode(props: UserCodeProps) {
  function copyUserCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
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
