import { useParams } from 'react-router-dom'

type ShoppingListParams = {
  listId: string
}

export function ShoppingList() {
  const params = useParams<ShoppingListParams>()

  const listId = params.listId

  return <h1>{listId}</h1>
}
