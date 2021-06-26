import { ReactNode } from 'react'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from 'react-icons/ri'

import './styles.scss'

type ProductProps = {
  name: string
  isChecked: boolean
  onToggleCheck: () => Promise<void>
  children?: ReactNode
}

export function Product({
  name,
  isChecked,
  children,
  onToggleCheck,
}: ProductProps) {
  return (
    <div className="product">
      <div className="product-content">
        <button type="button" onClick={onToggleCheck}>
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
