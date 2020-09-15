import React, { useState, useEffect, Fragment } from "react";
import { FaKeycdn, FaPlusCircle } from "react-icons/fa";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
  Container,
  Button,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  FormControl,
  RadioGroup,
  Radio,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { loadStripe } from "@stripe/stripe-js";
import { CircularProgress } from "@material-ui/core";
import * as emailjs from 'emailjs-com'
import axios from "axios";
import PDF from "./PDF";

const useStyles = makeStyles((theme) => ({
  row: {
    justifyContent: "center",
  },
  card: {
    margin: "0 auto",
    maxWidth: 600,
    padding: theme.spacing(1, 2),
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
  cardElement: {
    border: '1px solid #d3d3d3', 
    padding: 10,
    borderRadius: 3
  }
}));

require("dotenv").config();

const url = process.env.REACT_APP_URL;

const CheckoutForm = ({ cart, passOrderId }) => {
  // axios.get(`${url}/hello/`).then(res => console.log(res)).catch(err => console.log(err))
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const [localCart, setLocalCart] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [shipTotal, setShipTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel: "",
    errors: []
  });
  const [multiAddress, setMultiAddress] = useState(false);
  const [ship, setShip] = useState([
    {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      errors: [],
      items: [],
      shipMenuItem: {
        name: "ground",
        price: 9.99,
      },
    },
  ]);
  const [globalErrors, setGlobalErrors] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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
  }, [cart]);

  useEffect(() => {
    let subtotal = 0;

    localCart.forEach((url) => {
      url.forEach((item) => {
        subtotal += item.qty * item.price * ship.length;
      });
    });

    let shipTotal = 0;

    ship.forEach((addr) => {
      shipTotal += addr.shipMenuItem.price;
    });

    let total = 0;
    total += subtotal;
    total += shipTotal;

    setCartSubtotal(subtotal);
    setShipTotal(shipTotal);
    setCartTotal(total);
  }, [cart, ship, localCart]);

  const handleShipChange = (e) => {
    const { name, value } = e.target;
    const [index, prop] = name.split(" ");
    let shipClone = [...ship];
    shipClone[index][prop] = value;
    setShip(shipClone);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const handleShipSelected = (e) => {
    const { name, value } = e.target;
    let shipClone = [...ship];
    shipClone[name].shipMenuItem = {
      name: value,
      price: value === "ground" ? 9.99 : 42.99,
    };
    setShip(shipClone);
  };

  const addAddress = (e) => {
    e.preventDefault();
    setShip([
      ...ship,
      {
        street1: "",
        street2: "",
        city: "", 
        state: "",
        zip: "",
        errors: [], 
        items: [],
        shipMenuItem: {
          name: "ground",
          price: 9.99,
        },
      },
    ]);
  };

  const errorCheck = () => {
    let errors = []
    let errorFields = {
      firstName : contact.firstName, 
      lastName: contact.lastName, 
      email: contact.email
    }

    let contactErrors = contact.errors

    Object.keys(errorFields).forEach(key => {
      const name = key
      const value = errorFields[key]
      if(value === "") {
        contactErrors.push(name)
        errors.push(name)
      }
    })

    setContact({...contact, errors: contactErrors})

    let shipClone = [...ship]

    shipClone.forEach((addr, index) => {
      let errorFields = {
        street1: addr.street1, 
        city: addr.city, 
        state: addr.state, 
        zip: addr.zip
      }

      Object.keys(errorFields).forEach(key => {
        const name = key
        const value = errorFields[key]
        if(value === "") {
          addr.errors.push(name)
          errors.push(name+index)
        }
      })
    })

    setShip(shipClone)
    return errors
  }

  const handlePay = async () => {
    let errors = errorCheck()
    if(errors.length > 0){
      setGlobalErrors(true)
      return
    }

    if (!stripe || !elements) {
      return;
    }

    const billingDetails = {
      name: contact.firstName + " " + contact.lastName,
      email: contact.email,
      address: {
        city: ship[0].city,
        line1: ship[0].street1,
        line2: ship[0].street2,
        state: ship[0].state,
        postal_code: ship[0].zip,
      },
    };

    setGlobalErrors(false);
    setPaymentProcessing(true);

    const { data: clientSecret } = await axios.post(`${url}/stripe/`, {
      amount: cartTotal.toFixed(2) * 100,
    });

    console.log(clientSecret);

    const cardElement = elements.getElement(CardElement);

    const paymentMethodReq = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: billingDetails,
    });

    const confirmed = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodReq.paymentMethod.id,
    });

    if (confirmed !== undefined) {
      setPaymentProcessing(false);
      let orderNumber = Date.now().toString();

      let shipClone = [...ship];

      shipClone.forEach((addr) => {
        localCart.forEach((url) => {
          addr.items.push(url);
        });
      });

      let processedOrder = {
        orderNumber: orderNumber,
        billingDetails: billingDetails,
        ship: shipClone,
      };

      axios
        .post(`${url}/orders/new`, processedOrder)
        .then((res) => {
          let templateParams = {
            name: contact.firstName,
            email: contact.email,
            orderNumber: processedOrder.orderNumber
          }

          emailjs.send(
            'gmail', 
            process.env.REACT_APP_EMAIL_TEMPLATE, 
            templateParams,
            process.env.REACT_APP_EMAIL_KEY
          ).then(res => console.log(res.data)).catch(err => console.log(err))          

          passOrderId(res.data._id)
        })
        .catch((err) => console.log(err));
    }

    console.log(confirmed);
  };

  return (
    <Container className="container">
      <Grid container style={{maxWidth: 1000, margin: '0 auto'}}>
        <Grid item xs={12} md={6}>
          <div className={classes.card} style={{ display: "none" }}>
            <Paper elevation={3} className={classes.paper}>
              <p>Have an Account?</p>
              <button style={{ marginLeft: 10 }}>Sign In</button>
            </Paper>
          </div>
          <div className={classes.card}>
            <Paper elevation={3} className={classes.paper}>
              <Grid container>
                <h5>Contact</h5>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    name="firstName"
                    error={!contact.firstName.length && contact.errors.includes("firstName")}
                    value={contact.firstName}
                    onChange={handleContactChange}
                    label="First Name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    name="lastName"
                    error={!contact.lastName.length && contact.errors.includes("lastName")}
                    value={contact.lastName}
                    onChange={handleContactChange}
                    label="Last Name"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="email"
                    name="email"
                    error={!contact.email.length && contact.errors.includes("email")}
                    value={contact.email}
                    onChange={handleContactChange}
                    label="Email"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="tel"
                    name="tel"
                    value={contact.tel}
                    onChange={handleContactChange}
                    label="Phone"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          </div>
          <div className={classes.card}>
            <Paper elevation={3} className={classes.paper}>
              <Grid container>
                <h5>Shipping Address</h5>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="multiple-address"
                        style={{ display: "inline" }}
                        onChange={() => setMultiAddress(!multiAddress)}
                      />
                    }
                    label="I need to ship to multiple addresses."
                  />
                </Grid>
              </Grid>
              {ship.map((addr, index) => (
                <div key={addr}>
                  <Grid
                    container
                    style={{ display: multiAddress ? "" : "none" }}
                  >
                    <h3>Address {index + 1}</h3>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        label="Street Address"
                        error={!ship[index].street1.length && ship[index].errors.includes("street1")}
                        fullWidth
                        name={`${index} street1`}
                        value={addr.street1}
                        onChange={handleShipChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        label="Apt, Suite, etc."
                        fullWidth
                        name={`${index} street2`}
                        value={addr.street2}
                        onChange={handleShipChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        type="text"
                        label="City"
                        error={!ship[index].city.length && ship[index].errors.includes("city")}
                        name={`${index} city`}
                        value={addr.city}
                        onChange={handleShipChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="text"
                        label="State"
                        error={!ship[index].state.length && ship[index].errors.includes("state")}
                        name={`${index} state`}
                        value={addr.state}
                        onChange={handleShipChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        type="string"
                        label="ZIP Code"
                        error={!ship[index].zip.length && ship[index].errors.includes("zip")}
                        fullWidth
                        name={`${index} zip`}
                        value={addr.zip}
                        onChange={handleShipChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 10 }} className={classes.row}>
                    <h6>Shipping</h6>
                    <Grid item xs={12} sm={10} md={8}>
                    <RadioGroup>
                      <FormControlLabel
                        control={
                          <Radio
                            name={index}
                            value="ground"
                            onClick={handleShipSelected}
                            checked={
                              addr.shipMenuItem.name === "ground" ? true : false
                            }
                          />
                        }
                        label="Fedex 2-3 Day Ground $9.99"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            name={index}
                            value="next-day"
                            onClick={handleShipSelected}
                            checked={
                              addr.shipMenuItem.name === "next-day"
                                ? true
                                : false
                            }
                          />
                        }
                        label="Fedex Next Day Air $42.99"
                      />
                    </RadioGroup>
                    </Grid>
                  </Grid>
                  <Divider style={{ display: multiAddress ? "" : "none", margin: 20 }}/>
                </div>
              ))}
              <Grid container className={classes.row}
                style={{ display: multiAddress ? "" : "none" }}
              >
                <Button variant="outlined" color="primary" onClick={addAddress}>
                  Add Another Address
                  <FaPlusCircle style={{ marginLeft: 10 }} />
                </Button>
              </Grid>
            </Paper>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.card}>
            <Paper elevation={3} className={classes.paper}>
              <h5>Items</h5>
              <Table>
                <TableBody>
                  {localCart.map((url) => (
                    <Fragment key={url}>
                      <TableRow>
                        <TableCell
                          rowSpan={url.length + 1}
                          style={{
                            borderRight: "1px solid #d3d3d3",
                            padding: 0,
                            width: 80,
                          }}
                        >
                          <PDF url={url[0].url} width={70} />
                        </TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                      <>
                        {url.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell style={{ fontSize: "0.8rem" }}>
                              {item.name} {item.colorMenuItem}{" "}
                              {item.bg ? "Background" : "No Background"}
                            </TableCell>
                            <TableCell>{item.qty * ship.length}</TableCell>
                            <TableCell>
                              $
                              {(item.price * item.qty * ship.length).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    </Fragment>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell>Subtotal:</TableCell>
                    <TableCell>${cartSubtotal.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell>Shipping:</TableCell>
                    <TableCell>${shipTotal.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell>Total:</TableCell>
                    <TableCell>${cartTotal.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
          <div className={classes.card}>
            <Paper elevation={3} className={classes.paper}>
              <h5 style={{ marginBottom: 10 }}>Payment</h5>
              <CardElement
                className={classes.cardElement}
                MenuItems={{
                  style: {
                    base: {
                      fontSize: "16px",
                    },
                  },
                }}
              />
              <Grid container className={classes.row}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePay}
                style={{
                  margin: "20px auto",
                  pointerEvents: paymentProcessing ? "none" : "",
                }}
              >
                {paymentProcessing ? (
                  <CircularProgress size={20} style={{ color: "#c30017" }} />
                ) : (
                  `Pay $${cartTotal.toFixed(2)}`
                )}
              </Button>
              
              </Grid>
              <Grid container className={classes.row}>
              <small style={{color: 'red', display: globalErrors ? "" : "none"}}>One or more required fields is missing.</small>
              </Grid>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

const SuccessForm = ({ orderId }) => {
  const classes = useStyles()
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`${url}/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {order ? (
        <Container className="container">
          <Grid container className={classes.row}>
          <Grid item xs={12} className={classes.card}>
          <Paper className={classes.paper}>
            <h3>Your Order is Complete.</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>Order Number: #{order.orderNumber}</TableCell>
                </TableRow>
                {order.ship.map((addr) => (
                  <>
                    <TableRow>
                      <TableCell colSpan={4}>
                        Shipping To: <br />
                        {addr.street1} {addr.street2}
                        <br />
                        {addr.city}, {addr.state} {addr.zip}
                      </TableCell>
                    </TableRow>
                    {addr.items.map((url) => (
                      <>
                        <TableRow>
                          <TableCell
                            rowSpan={url.length + 1}
                            style={{ borderRight: "1px solid #d3d3d3" }}
                          >
                            <PDF url={url[0].url} width={70} />
                          </TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell style={{ width: 50 }}>Price</TableCell>
                        </TableRow>
                        <>
                          {url.map((item) => (
                            <TableRow key={item.name}>
                              <TableCell style={{ fontSize: "0.8rem" }}>
                                {item.name} {item.colorMenuItem}{" "}
                                {item.bg ? "Background" : "No Background"}
                              </TableCell>
                              <TableCell>{item.qty}</TableCell>
                              <TableCell style={{ width: 50 }}>
                                ${(item.price * item.qty).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      </>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
            </Paper>
          </Grid>
        </Grid>
        </Container>
      ) : (
        ""
      )}
    </>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC);

const Checkout = ({ cart, deleteCart }) => {
  const [orderId, setOrderId] = useState(null);

  const passOrderId = (id) => {
    setOrderId(id);
    deleteCart()
  };

  return (
    <Elements stripe={stripePromise}>
      {orderId ? (
        <SuccessForm orderId={orderId} />
      ) : (
        <CheckoutForm cart={cart} passOrderId={passOrderId} />
      )}
    </Elements>
  );
};

export default Checkout;
