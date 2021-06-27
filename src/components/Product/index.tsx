import { ReactNode } from 'react'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from 'react-icons/ri'

import './styles.scss'

type ProductProps = {
  name: string
  isChecked: boolean
  onToggleCheck: () => Promise<void>
  children?: ReactNode
  disabled: boolean
}

export function Product({
  name,
  isChecked,
  children,
  disabled,
  onToggleCheck,
}: ProductProps) {
  return (
    <div className="product">
      <div className="product-content">
        <button type="button" onClick={onToggleCheck} disabled={disabled}>
          {isChecked ? (
            <RiCheckboxCircleLine className="checked" />
          ) : (
            <RiCheckboxBlankCircleLine />
          )}
        </button>
        <p>{name}</p>
      </div>
      <div className="options">{children}</div>
    </div>
  )
}
