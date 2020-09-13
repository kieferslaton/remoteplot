import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.scss";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaEnvelope,
  FaLocationArrow,
} from "react-icons/fa";
import { Drawer } from "@material-ui/core";


import logo from '../images/logo.png'
import logoRed from "../images/logo-red.png";
import Home from "./Home";
import Print from "./Print";
import Cart from "./Cart";
import Checkout from './Checkout';

function App() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartQty, setCartQty] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCart(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  useEffect(() => {
    if (cart.length > -1) {
      let qty = 0;
      cart.forEach((item) => {
        qty += item.qty;
      });

      setCartQty(qty);

      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const updateCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeItemFromCart = (item) => {
    if(cart.length === 1){
      setCart([])
    } else {
    let itemId = item.name + item.url;
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.name + cartItem.url !== itemId)
    );
    }
  };

  const decrementQuantity = (item) => {
    let itemId = item.name + item.url;
    let foundItem = cart.find(
      (cartItem) => cartItem.name + cartItem.url === itemId
    );
    let index = cart.findIndex(
      (cartItem) => cartItem.name + cartItem.url === itemId
    );
    let cloneCart = [...cart]
    cloneCart[index]={
      name: foundItem.name,
      height: foundItem.height, 
      width: foundItem.width, 
      colorOption: foundItem.colorOption, 
      bg: foundItem.bg, 
      price: foundItem.price,
      qty: foundItem.qty - 1,
      url: foundItem.url,
      added: foundItem.added
    };
    setCart(cloneCart);
  };
  
  const incrementQuantity = (item) => {
    let itemId = item.name + item.url;
    let foundItem = cart.find(
      (cartItem) => cartItem.name + cartItem.url === itemId
    );
    let index = cart.findIndex(
      (cartItem) => cartItem.name + cartItem.url === itemId
    );
    let cloneCart = [...cart]
    cloneCart[index]={
      name: foundItem.name,
      height: foundItem.height, 
      width: foundItem.width, 
      colorOption: foundItem.colorOption, 
      bg: foundItem.bg, 
      price: foundItem.price,
      qty: foundItem.qty + 1,
      url: foundItem.url,
      added: foundItem.added
    };
    setCart(cloneCart);
  };

  return (
    <Router style={{ position: "relative" }}>
      <div>
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={logoRed} alt="logo" />
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/print">Print</Link>
            </li>
          </ul>
          <div className="nav-buttons">
            <button className="button">
              <Link to="/cart">Cart({cart ? cartQty : "0"})</Link>
              <FaShoppingCart className="button-icon" size={20} />
            </button>
            <button className="button login" style={{display: 'none'}}>
              <p>Login</p>
              <FaUserCircle className="button-icon" size={20} />
            </button>
          </div>
          <button className="nav-toggle" onClick={() => setOpen(true)}>
            <FaBars size={20} />
          </button>
        </nav>
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          className="drawer"
        >
          <div className="mobile-nav">
            <div className="mobile-nav-links">
              <Link to="/">
                <button className="button" onClick={() => setOpen(false)}>
                  Home
                </button>
              </Link>
              <Link to="/print">
                <button className="button" onClick={() => setOpen(false)}>
                  Print
                </button>
              </Link>
            </div>
            <div className="mobile-nav-buttons">
              <Link to="/cart">
                <button className="button" onClick={() => setOpen(false)}>
                  <p>Cart({cart ? cartQty : "0"})</p>
                  <FaShoppingCart className="button-icon" size={20} />
                </button>
              </Link>
              <Link to="/login" style={{display: 'none'}}>
                <button className="button login" onClick={() => setOpen(false)}>
                  <p>Login</p>
                  <FaUserCircle className="button-icon" size={20} />
                </button>
              </Link>
            </div>
          </div>
        </Drawer>
      </div>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/print">
          <Print updateCart={updateCart} cart={cart} />
        </Route>
        <Route path="/cart">
          <Cart
            removeItemFromCart={removeItemFromCart}
            decrementQuantity={decrementQuantity}
            incrementQuantity={incrementQuantity}
            cart={cart}
          />
        </Route>
        <Route path="/checkout">
          <Checkout cart={cart}/>
        </Route>
      </Switch>
      <footer className="footer">
      <div className="footer-col">
        <h5>Shipping Rates</h5>
        <p>Fedex Ground $9.99</p>
        <p>Fedex Next Day Air $42.99</p>
        </div>
        <div className="footer-col">
        <Link to="/" className="logo" style={{height: 40}}>
            <img src={logo} alt="footer-logo" style={{height: 40}} />
          </Link>
          <p>
            <FaEnvelope style={{ marginRight: 10 }} />
            info@remoteplot.com
          </p>
          <p>
            <FaLocationArrow style={{ marginRight: 10 }} />
            
              95 Business Park Dr, <br /> Vicksburg, MS 39180
          </p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
