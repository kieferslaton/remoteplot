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
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  Grid,
} from "@material-ui/core";

import logo from "../images/logo.png";
import logoRed from "../images/logo-red.png";
import Home from "./Home";
import Print from "./Print";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Admin from "./Admin";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "white",
    position: "relative",
  },
  logo: {
    [theme.breakpoints.down("sm")]: {
      flexGrow: 1,
    },
  },
  navLinks: {
    display: "flex",
    margin: theme.spacing(2),
    flexGrow: 1,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  navLink: {
    margin: theme.spacing(0, 2),
  },
  navButtons: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  navToggle: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  drawer: {
    width: 250,
    position: "relative",
  },
  drawerPaper: {
    width: 250,
  },
  mobileNavItems: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  mobileNavItem: {
    borderBottom: "1px solid #d3d3d3",
    "&:last-child": {
      position: "absolute",
      bottom: 0,
      width: 250,
      borderTop: "1px solid #d3d3d3",
      borderBottom: "none",
    },
  },
  mobileNavLink: {
    height: "100%",
    width: "100%",
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: "#292b2c",
    color: "white",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  footerCol: {
    textAlign: "center",
  },
  footerText: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.7em",
    },
  },
}));

function App() {
  const classes = useStyles();

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

  const deleteCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const removeItemFromCart = (item) => {
    if (cart.length === 1) {
      setCart([]);
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
    let cloneCart = [...cart];
    cloneCart[index] = {
      name: foundItem.name,
      height: foundItem.height,
      width: foundItem.width,
      colorOption: foundItem.colorOption,
      bg: foundItem.bg,
      price: foundItem.price,
      qty: foundItem.qty - 1,
      url: foundItem.url,
      added: foundItem.added,
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
    let cloneCart = [...cart];
    cloneCart[index] = {
      name: foundItem.name,
      height: foundItem.height,
      width: foundItem.width,
      colorOption: foundItem.colorOption,
      bg: foundItem.bg,
      price: foundItem.price,
      qty: foundItem.qty + 1,
      url: foundItem.url,
      added: foundItem.added,
    };
    setCart(cloneCart);
  };

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Link to="/" className={classes.logo}>
              <img src={logoRed} alt="logo" style={{ height: 40 }} />
            </Link>
            <ul className={classes.navLinks}>
              <li className={classes.navLink}>
                <Link to="/">Home</Link>
              </li>
              <li className={classes.navLink}>
                <Link to="/print">Print</Link>
              </li>
            </ul>
            <div className={classes.navButtons}>
              <Button className={classes.navButton}>
                <Link to="/cart">Cart ({cart ? cartQty : "0"})</Link>
                <FaShoppingCart className="button-icon" size={20} />
              </Button>
              <Button className={classes.navButton} style={{ display: "none" }}>
                <p>Login</p>
                <FaUserCircle className="button-icon" size={20} />
              </Button>
            </div>
            <IconButton
              className={classes.navToggle}
              onClick={() => setOpen(true)}
            >
              <FaBars size={20} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <List className={classes.mobileNavItems}>
            <ListItem
              className={classes.mobileNavItem}
              onClick={() => setOpen(false)}
            >
              <Link to="/" className={classes.mobileNavLink}>
                Home
              </Link>
            </ListItem>
            <ListItem
              className={classes.mobileNavItem}
              onClick={() => setOpen(false)}
            >
              <Link to="/print" className={classes.mobileNavLink}>
                Print
              </Link>
            </ListItem>
            <ListItem
              className={classes.mobileNavItem}
              onClick={() => setOpen(false)}
            >
              <Link to="/cart" className={classes.mobileNavLink}>
                Cart ({cart ? cartQty : "0"})
                <FaShoppingCart className="button-icon" size={20} />
              </Link>
            </ListItem>
          </List>
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
          <Checkout cart={cart} deleteCart={deleteCart}/>
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
      </Switch>
      <footer className={classes.footer}>
        <Grid container style={{ justifyContent: "center" }}>
          <Grid item xs={6} md={3} className={classes.footerCol}>
            <h5>Shipping Rates</h5>
            <p className={classes.footerText}>Fedex Ground $9.99</p>
            <p className={classes.footerText}>Fedex Next Day Air $42.99</p>
          </Grid>
          <Grid item xs={6} md={3} className={classes.footerCol}>
            <Link to="/" className="logo" style={{ height: 40 }}>
              <img src={logo} alt="footer-logo" style={{ height: 40 }} />
            </Link>
            <p className={classes.footerText}>
              <FaEnvelope style={{ marginRight: 10 }} />
              info@remoteplot.com
            </p>
            <p className={classes.footerText}>
              <FaLocationArrow style={{ marginRight: 10 }} />
              95 Business Park Dr, <br /> Vicksburg, MS 39180
            </p>
          </Grid>
        </Grid>
      </footer>
    </Router>
  );
}

export default App;
