import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home } from './pages/Home'
import { NewShoppingList } from './pages/NewShoppingList'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/lists/new" component={NewShoppingList} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
