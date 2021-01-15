import React, { useState, useEffect, Fragment } from "react";
import { FaPlusCircle } from "react-icons/fa";
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
  TextField,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { loadStripe } from "@stripe/stripe-js";
import { CircularProgress } from "@material-ui/core";
import * as emailjs from "emailjs-com";
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
    border: "1px solid #d3d3d3",
    padding: 10,
    borderRadius: 3,
  },
  formControl: {
    minWidth: 120,
  },
}));

require("dotenv").config();

const url = process.env.REACT_APP_URL;

const CheckoutForm = ({ cart, passOrderId }) => {
  // axios.get(`${url}/hello/`).then(res => console.log(res)).catch(err => console.log(err))
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const shippingOptions = [
    "fedex_express_saver",
    "fedex_2day",
    "fedex_standard_overnight",
  ];

  const [localCart, setLocalCart] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [shipTotal, setShipTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    errors: [],
  });
  const [multiAddress, setMultiAddress] = useState(false);
  const [ship, setShip] = useState([
    {
      firstName: "",
      lastName: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      errors: [],
      items: [],
      shipping: null,
      shippingError: false,
      calculating: false,
    },
  ]);
  const [globalErrors, setGlobalErrors] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shipError, setShipError] = useState([]);
  const [paymentError, setPaymentError] = useState(null);
  const [cardError, setCardError] = useState(null);

  const [states, setStates] = useState([
    {
      name: "Alabama",
      abbreviation: "AL",
    },
    {
      name: "Alaska",
      abbreviation: "AK",
    },
    {
      name: "American Samoa",
      abbreviation: "AS",
    },
    {
      name: "Arizona",
      abbreviation: "AZ",
    },
    {
      name: "Arkansas",
      abbreviation: "AR",
    },
    {
      name: "California",
      abbreviation: "CA",
    },
    {
      name: "Colorado",
      abbreviation: "CO",
    },
    {
      name: "Connecticut",
      abbreviation: "CT",
    },
    {
      name: "Delaware",
      abbreviation: "DE",
    },
    {
      name: "District Of Columbia",
      abbreviation: "DC",
    },
    {
      name: "Federated States Of Micronesia",
      abbreviation: "FM",
    },
    {
      name: "Florida",
      abbreviation: "FL",
    },
    {
      name: "Georgia",
      abbreviation: "GA",
    },
    {
      name: "Guam",
      abbreviation: "GU",
    },
    {
      name: "Hawaii",
      abbreviation: "HI",
    },
    {
      name: "Idaho",
      abbreviation: "ID",
    },
    {
      name: "Illinois",
      abbreviation: "IL",
    },
    {
      name: "Indiana",
      abbreviation: "IN",
    },
    {
      name: "Iowa",
      abbreviation: "IA",
    },
    {
      name: "Kansas",
      abbreviation: "KS",
    },
    {
      name: "Kentucky",
      abbreviation: "KY",
    },
    {
      name: "Louisiana",
      abbreviation: "LA",
    },
    {
      name: "Maine",
      abbreviation: "ME",
    },
    {
      name: "Marshall Islands",
      abbreviation: "MH",
    },
    {
      name: "Maryland",
      abbreviation: "MD",
    },
    {
      name: "Massachusetts",
      abbreviation: "MA",
    },
    {
      name: "Michigan",
      abbreviation: "MI",
    },
    {
      name: "Minnesota",
      abbreviation: "MN",
    },
    {
      name: "Mississippi",
      abbreviation: "MS",
    },
    {
      name: "Missouri",
      abbreviation: "MO",
    },
    {
      name: "Montana",
      abbreviation: "MT",
    },
    {
      name: "Nebraska",
      abbreviation: "NE",
    },
    {
      name: "Nevada",
      abbreviation: "NV",
    },
    {
      name: "New Hampshire",
      abbreviation: "NH",
    },
    {
      name: "New Jersey",
      abbreviation: "NJ",
    },
    {
      name: "New Mexico",
      abbreviation: "NM",
    },
    {
      name: "New York",
      abbreviation: "NY",
    },
    {
      name: "North Carolina",
      abbreviation: "NC",
    },
    {
      name: "North Dakota",
      abbreviation: "ND",
    },
    {
      name: "Northern Mariana Islands",
      abbreviation: "MP",
    },
    {
      name: "Ohio",
      abbreviation: "OH",
    },
    {
      name: "Oklahoma",
      abbreviation: "OK",
    },
    {
      name: "Oregon",
      abbreviation: "OR",
    },
    {
      name: "Palau",
      abbreviation: "PW",
    },
    {
      name: "Pennsylvania",
      abbreviation: "PA",
    },
    {
      name: "Puerto Rico",
      abbreviation: "PR",
    },
    {
      name: "Rhode Island",
      abbreviation: "RI",
    },
    {
      name: "South Carolina",
      abbreviation: "SC",
    },
    {
      name: "South Dakota",
      abbreviation: "SD",
    },
    {
      name: "Tennessee",
      abbreviation: "TN",
    },
    {
      name: "Texas",
      abbreviation: "TX",
    },
    {
      name: "Utah",
      abbreviation: "UT",
    },
    {
      name: "Vermont",
      abbreviation: "VT",
    },
    {
      name: "Virgin Islands",
      abbreviation: "VI",
    },
    {
      name: "Virginia",
      abbreviation: "VA",
    },
    {
      name: "Washington",
      abbreviation: "WA",
    },
    {
      name: "West Virginia",
      abbreviation: "WV",
    },
    {
      name: "Wisconsin",
      abbreviation: "WI",
    },
    {
      name: "Wyoming",
      abbreviation: "WY",
    },
  ]);

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
      if (addr.shipping) {
        const shipPrice =
          addr.shipping.find((op) => op.selected === true).price !== undefined
            ? addr.shipping.find((op) => op.selected === true).price
            : 0;
        shipTotal += shipPrice;
      }
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
    const shipClone = [...ship];
    shipClone[parseInt(name)].shipping.forEach((op) => {
      if (op.service_code === value) {
        op.selected = true;
      } else {
        op.selected = false;
      }
    });
    setShip(shipClone);
  };

  const calculateShipping = (index) => {
    let errors = shippingErrorCheck(index);
    if (errors.length > 0) {
      let shipClone = [...ship];
      shipClone[index].shippingError = true;
      setShip(shipClone);
      return;
    }

    const shipClone = [...ship];
    shipClone[index].calculating = true;
    setShip(shipClone);

    const headers = {
      "api-key": process.env.REACT_APP_SHIPENGINE_KEY,
      "Content-Type": "application/json",
    };

    const config = {
      headers,
      baseUrl: "https://api.shipengine.com",
      validateStatus() {
        return true;
      },
    };

    const data = {
      rate_options: {
        carrier_ids: [process.env.REACT_APP_CARRIER],
      },
      shipment: {
        validate_address: "validate_and_clean",
        ship_to: {
          name: ship[index].firstName + " " + ship[index].lastName,
          address_line1: ship[index].street1,
          address_line2: ship[index].street2,
          city_locality: ship[index].city,
          state_province: ship[index].state,
          postal_code: ship[index].zip,
          country_code: "US",
        },
        ship_from: {
          name: contact.firstName + " " + contact.lastName,
          phone: contact.tel,
          address_line1: contact.street1,
          address_line2: contact.street2,
          city_locality: contact.city,
          state_province: contact.state,
          postal_code: contact.zip,
          country_code: "US",
        },
        packages: [
          {
            weight: {
              value: 16.0,
              unit: "ounce",
            },
          },
        ],
      },
    };

    axios
      .post(
        "https://rocky-badlands-97307.herokuapp.com/https://api.shipengine.com/v1/rates",
        data,
        config
      )
      .then((res) => {
        let rates = res.data.rate_response.rates.filter((rate) =>
          shippingOptions.includes(rate.service_code)
        );
        let shipClone = [...ship];
        shipClone[index].shipping = [];
        rates.forEach((rate) => {
          shipClone[index].shipping.push({
            service_code: rate.service_code,
            service_type: rate.service_type,
            price: rate.shipping_amount.amount,
            selected: rate.service_code === shippingOptions[0],
          });
        });
        shipClone[index].calculating = false;
        setShip(shipClone);
      })
      .catch((err) => console.log(err));
  };

  const addAddress = (e) => {
    e.preventDefault();
    setShip([
      ...ship,
      {
        firstName: "",
        lastName: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        errors: [],
        items: [],
        shipping: null,
        shippingError: false,
        calculating: false,
      },
    ]);
  };

  const shippingErrorCheck = (index) => {
    let errors = [];
    let errorFields = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      street1: contact.street1,
      city: contact.city,
      state: contact.state,
      zip: contact.zip,
    };

    let contactErrors = contact.errors;

    Object.keys(errorFields).forEach((key) => {
      const name = key;
      const value = errorFields[key];
      if (value === "") {
        contactErrors.push(name);
        errors.push(name);
      }
    });

    setContact({ ...contact, errors: contactErrors });

    let shipErrorFields = {
      firstName: ship[index].firstName,
      lastName: ship[index].lastName,
      street1: ship[index].street1,
      city: ship[index].city,
      state: ship[index].state,
      zip: ship[index].zip,
    };

    let shipClone = [...ship];

    Object.keys(shipErrorFields).forEach((key) => {
      const name = key;
      const value = errorFields[key];
      if (value === "") {
        shipClone[index].errors.push(name);
      }
    });

    setShip(shipClone);

    return errors;
  };

  const errorCheck = () => {
    let errors = [];
    let errorFields = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      street1: contact.street1,
      city: contact.city,
      state: contact.state,
      zip: contact.zip,
    };

    let contactErrors = contact.errors;

    Object.keys(errorFields).forEach((key) => {
      const name = key;
      const value = errorFields[key];
      if (value === "") {
        contactErrors.push(name);
        errors.push(name);
      }
    });

    setContact({ ...contact, errors: contactErrors });

    let shipClone = [...ship];

    shipClone.forEach((addr, index) => {
      let errorFields = {
        firstName: addr.firstName,
        lastName: addr.lastName,
        street1: addr.street1,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        shipping: addr.shipping,
      };

      Object.keys(errorFields).forEach((key) => {
        const name = key;
        const value = errorFields[key];
        if (value === "" || !value) {
          addr.errors.push(name);
          errors.push(name + index);
        }
      });
    });

    setShip(shipClone);
    return errors;
  };

  const handleCardChange = (e) => {
    if (e.error) {
      setCardError(e.error.message);
    } else {
      setCardError(null);
    }
  };

  const handlePay = async () => {
    let errors = errorCheck();
    if (errors.length > 0) {
      setGlobalErrors(true);
      return;
    }

    if (cardError) return;

    if (!stripe || !elements) {
      return;
    }

    const billingDetails = {
      name: contact.firstName + " " + contact.lastName,
      email: contact.email,
      phone: contact.tel,
      address: {
        city: contact.city,
        line1: contact.street1,
        line2: contact.street2,
        state: contact.state,
        postal_code: contact.zip,
      },
    };

    setGlobalErrors(false);
    setPaymentProcessing(true);

    let amount = Math.round(cartTotal * 100);

    let { data: clientSecret } = await axios.post(`${url}/stripe/`, {
      amount,
    });

    const cardElement = elements.getElement(CardElement);

    const paymentMethodReq = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: billingDetails,
    });

    if (paymentMethodReq.error) {
      setCardError(paymentMethodReq.error.message);
      setPaymentProcessing(false);
      return;
    }

    if (paymentMethodReq === undefined) {
      setCardError(
        "There was an error. Please re-enter your card and try again."
      );
      return;
    }

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
        subtotal: cartSubtotal,
        shipTotal: shipTotal,
        total: cartTotal,
      };

      axios
        .post(`${url}/orders/new`, processedOrder)
        .then((res) => {
          let templateParams = {
            name: contact.firstName,
            email: contact.email,
            orderNumber: processedOrder.orderNumber,
          };

          emailjs
            .send(
              "remoteplot",
              process.env.REACT_APP_EMAIL_TEMPLATE,
              templateParams,
              process.env.REACT_APP_EMAIL_KEY
            )
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));

          passOrderId(res.data._id);
        })
        .catch((err) => {
          setPaymentError(err.data);
          setPaymentProcessing(false);
        });
    }
  };

  return (
    <Container className="container">
      <Grid container style={{ maxWidth: 1000, margin: "0 auto" }}>
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
                    error={
                      !contact.firstName.length &&
                      contact.errors.includes("firstName")
                    }
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
                    error={
                      !contact.lastName.length &&
                      contact.errors.includes("lastName")
                    }
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
                    error={
                      !contact.email.length && contact.errors.includes("email")
                    }
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
                <h5>Billing/Return Address</h5>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    name="street1"
                    error={
                      !contact.street1.length &&
                      contact.errors.includes("street1")
                    }
                    value={contact.street1}
                    onChange={handleContactChange}
                    label="Street Address"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    name="street2"
                    value={contact.street2}
                    onChange={handleContactChange}
                    label="Apt, Suite, etc."
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    name="city"
                    error={
                      !contact.city.length && contact.errors.includes("city")
                    }
                    value={contact.city}
                    onChange={handleContactChange}
                    label="City"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel>State</InputLabel>
                    <Select
                    type="text"
                    name="state"
                    error={
                      !contact.state.length && contact.errors.includes("state")
                    }
                    value={contact.state}
                    onChange={handleContactChange}
                    label="State"
                    fullWidth
                  >
                    <MenuItem value={null}>''</MenuItem>
                          {states.map((state) => (
                            <MenuItem value={state.abbreviation}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    name="zip"
                    error={
                      !contact.zip.length && contact.errors.includes("zip")
                    }
                    value={contact.zip}
                    onChange={handleContactChange}
                    label="ZIP Code"
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
                <div key={index}>
                  <Grid
                    container
                    style={{ display: multiAddress ? "" : "none" }}
                  >
                    <h3>Address {index + 1}</h3>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        type="text"
                        label="First Name"
                        error={
                          !ship[index].firstName.length &&
                          ship[index].errors.includes("firstName")
                        }
                        fullWidth
                        name={`${index} firstName`}
                        value={addr.firstName}
                        onChange={handleShipChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="text"
                        label="Last Name"
                        error={
                          !ship[index].lastName.length &&
                          ship[index].errors.includes("lastName")
                        }
                        fullWidth
                        name={`${index} lastName`}
                        value={addr.lastName}
                        onChange={handleShipChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        label="Street Address"
                        error={
                          !ship[index].street1.length &&
                          ship[index].errors.includes("street1")
                        }
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
                        error={
                          !ship[index].city.length &&
                          ship[index].errors.includes("city")
                        }
                        name={`${index} city`}
                        value={addr.city}
                        onChange={handleShipChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel>State</InputLabel>
                        <Select
                          type="text"
                          label="State"
                          error={
                            !ship[index].state.length &&
                            ship[index].errors.includes("state")
                          }
                          name={`${index} state`}
                          value={addr.state}
                          onChange={handleShipChange}
                          fullWidth
                        >
                          <MenuItem value={null}>''</MenuItem>
                          {states.map((state) => (
                            <MenuItem value={state.abbreviation}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        type="string"
                        label="ZIP Code"
                        error={
                          !ship[index].zip.length &&
                          ship[index].errors.includes("zip")
                        }
                        fullWidth
                        name={`${index} zip`}
                        value={addr.zip}
                        onChange={handleShipChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ marginTop: 10 }}
                    className={classes.row}
                  >
                    <h6>Shipping</h6>
                    <Grid
                      item
                      xs={12}
                      sm={10}
                      md={8}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {addr.shipping ? (
                        <>
                          <RadioGroup>
                            {addr.shipping.map((op) => (
                              <FormControlLabel
                                key={op.service_type}
                                control={
                                  <Radio
                                    checked={op.selected}
                                    name={index.toString()}
                                    value={op.service_code}
                                    onClick={handleShipSelected}
                                  />
                                }
                                label={`${op.service_type} $${op.price}`}
                              />
                            ))}
                          </RadioGroup>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outlined"
                            color={
                              !ship[index].shipping &&
                              ship[index].errors.includes("shipping")
                                ? "default"
                                : "primary"
                            }
                            onClick={() => calculateShipping(index)}
                          >
                            {ship[index].calculating ? (
                              <CircularProgress
                                size={20}
                                style={{ color: "#c30017" }}
                              />
                            ) : (
                              "Calculate Shipping"
                            )}
                          </Button>
                        </>
                      )}
                    </Grid>
                    <Grid container className={classes.row}>
                      <small
                        style={{
                          display:
                            !ship[index].shipping &&
                            ship[index].errors.includes("shipping")
                              ? ""
                              : "none",
                          color: "red",
                        }}
                      >
                        Please select shipping
                      </small>
                    </Grid>
                    <Grid container className={classes.row}>
                      <small
                        style={{
                          color: "red",
                          display: ship[index].shippingError ? "" : "none",
                        }}
                      >
                        One or more required fields is missing.
                      </small>
                    </Grid>
                  </Grid>
                  <Divider
                    style={{ display: multiAddress ? "" : "none", margin: 20 }}
                  />
                </div>
              ))}
              <Grid
                container
                className={classes.row}
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
                onChange={handleCardChange}
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
                <small
                  style={{ color: "red", display: globalErrors ? "" : "none" }}
                >
                  One or more required fields is missing.
                </small>
                <small
                  style={{ color: "red", display: shipError ? "" : "none" }}
                >
                  {shipError}
                </small>
                <small
                  style={{ color: "red", display: paymentError ? "" : "none" }}
                >
                  {paymentError}
                </small>
                <small
                  style={{ color: "red", display: cardError ? "" : "none" }}
                >
                  {cardError}
                </small>
              </Grid>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

const SuccessForm = ({ orderId }) => {
  const classes = useStyles();
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
                      <TableCell colSpan={4}>
                        Order Number: #{order.orderNumber}
                      </TableCell>
                    </TableRow>
                    {order.ship.map((addr) => (
                      <Fragment key={addr.street1}>
                        <TableRow>
                          <TableCell colSpan={4}>
                            Shipping To: <br />
                            {addr.firstName} {addr.lastName}
                            <br />
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
                        <TableRow>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell>Subtotal:</TableCell>
                          <TableCell>${order.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell>Shipping:</TableCell>
                          <TableCell>${order.shipTotal.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell>Total:</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      </Fragment>
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
    deleteCart();
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
