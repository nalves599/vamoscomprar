import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { AuthContextProvider } from './contexts/AuthContext'
import { ListsContextProvider } from './contexts/ListsContext'
import { Home } from './pages/Home'
import { NewShoppingList } from './pages/NewShoppingList'
import { ShoppingList } from './pages/ShoppingList'

import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ListsContextProvider>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/lists/new" component={NewShoppingList} />
            <Route path="/lists/:listId" component={ShoppingList} />
          </Switch>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            limit={3}
            newestOnTop={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ListsContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
