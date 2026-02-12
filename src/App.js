import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const productObject = cartList.find(eachCard => eachCard.id === product.id)

    if (productObject) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCard => {
          if (eachCard.id === productObject.id) {
            const updatedQuantity = eachCard.quantity + product.quantity
            return {...eachCard, quantity: updatedQuantity}
          }
          return eachCard
        }),
      }))
    } else {
      const updatedCardList = [...cartList, product]
      this.setState({cartList: updatedCardList})
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedCardList = cartList.filter(eachCard => eachCard.id !== id)
    this.setState({cartList: updatedCardList})
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachCardItem => {
        if (id === eachCardItem.id) {
          const updatedQuantity = eachCardItem.quantity + 1
          return {...eachCardItem, quantity: updatedQuantity}
        }
        return eachCardItem
      }),
    }))
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const productObject = cartList.find(eachCardItem => eachCardItem.id === id)
    if (productObject.quantity > 1) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCardItem => {
          if (id === eachCardItem.id) {
            const updatedQuantity = eachCardItem.quantity - 1
            return {...eachCardItem, quantity: updatedQuantity}
          }
          return eachCardItem
        }),
      }))
    } else {
      this.removeCartItem(id)
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
