import { ReactNode } from 'react'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from 'react-icons/ri'

import './styles.scss'

type ProductProps = {
  name: string
  isChecked: boolean
  children?: ReactNode
}

export function Product({ name, isChecked, children }: ProductProps) {
  return (
    <div className="product">
      <div className="product-content">
        <button type="button">
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
