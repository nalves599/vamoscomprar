import { ButtonHTMLAttributes } from 'react'

import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
  headerButton?: boolean
}

export function Button({
  isOutlined = false,
  headerButton = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button ${isOutlined ? 'outlined' : ''} ${
        headerButton ? 'header-button' : ''
      }`}
      {...props}
    />
  )
}
