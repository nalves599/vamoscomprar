import {
  RiArrowRightSLine,
  RiDeleteBin7Line,
  RiShoppingBasketLine,
} from 'react-icons/ri'

import './styles.scss'

type ListProps = {
  title: string
  missingProducts: number
  productsCount: number
  author: { id: string; name: string; avatar: string }
  isFromUser: boolean
  handleGoToShoppingList: () => void
  handleDeleteList: () => Promise<void>
}

export function List({
  title,
  missingProducts,
  productsCount,
  author,
  isFromUser,
  handleGoToShoppingList,
  handleDeleteList,
}: ListProps) {
  return (
    <div className="list-card">
      <div className="card-header">
        <h3>{title}</h3>
        <span>
          {productsCount - missingProducts}/{productsCount}{' '}
          <RiShoppingBasketLine />
        </span>
      </div>
      <div className="card-main">
        <span>Criada por</span>
        <div className="card-footer">
          <div className="user-info">
            <img src={author.avatar} alt={author.name} />
            <p>{author.name}</p>
          </div>
          <div className="options">
            {isFromUser && (
              <button type="button" onClick={handleDeleteList}>
                <RiDeleteBin7Line />
              </button>
            )}
            <button type="button" onClick={handleGoToShoppingList}>
              <RiArrowRightSLine className="highlighted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
