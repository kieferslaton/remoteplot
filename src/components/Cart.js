import React, { useState, useEffect } from "react";
import { FaRegTimesCircle, FaPlus, FaMinus } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
  Container,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import PDF from "./PDF";

const useStyles = makeStyles((theme) => ({
  row: {
    justifyContent: "center",
  },
  card: {
    maxWidth: 600,
    padding: theme.spacing(2), 
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  paper: {
    border: "1px solid #d3d3d3",
    padding: theme.spacing(2),
    justifyContent: "center",
    borderRadius: 0,
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const Cart = ({
  removeItemFromCart,
  decrementQuantity,
  incrementQuantity,
  cart,
}) => {
  const classes = useStyles();
  const [localCart, setLocalCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let organizedCart = [];
    let uniqueUrls = [];

    cart.forEach((item) => {
      if (!uniqueUrls.includes(item.url)) uniqueUrls.push(item.url);
    });

    uniqueUrls.forEach((url) => {
      let items = [];
      cart.forEach((item) => {
        if (item.url === url) items.push(item);
      });

      organizedCart.push(items);
    });

    setLocalCart(organizedCart);

    let sum = 0;

    cart.forEach((item) => {
      sum += item.price * item.qty;
    });

    setTotal(sum);
  }, [cart]);

  return (
    <Container className="container">
      <Grid container>
        <h2>Cart</h2>
      </Grid>
      <Grid container className={classes.row}>
        <Grid item xs={12} className={classes.card}>
          <Paper elevation={3} className={classes.paper}>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <Table>
                <TableBody>
                  {localCart.map((url) => (
                    <>
                      <TableRow>
                        <TableCell colSpan="4">
                          <PDF url={url[0].url} width={200} />
                        </TableCell>
                      </TableRow>
                      <TableRow className="header-row">
                        <TableCell>Item</TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          Qty
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          Price
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <>
                        {url.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell>
                              {item.name} {item.colorOption}{" "}
                              {item.bg ? "Background" : "No Background"}
                            </TableCell>
                            <TableCell>
                              <span
                                style={{
                                  display: "flex",
                                  flexFlow: "row nowrap",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <FaMinus
                                  className="decrement-button"
                                  onClick={() => decrementQuantity(item)}
                                />
                                {item.qty}
                                <FaPlus
                                  className="increment-button"
                                  onClick={() => incrementQuantity(item)}
                                />
                              </span>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              ${(item.price * item.qty).toFixed(2)}
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              <FaRegTimesCircle
                                size={20}
                                onClick={() => removeItemFromCart(item)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    </>
                  ))}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      Total:
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      ${total.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            <Grid container className={classes.row}>
            <Link to="/checkout">
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
              >
                Checkout
              </Button>
            </Link>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
