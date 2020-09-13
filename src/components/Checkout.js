import React, { useState, useEffect, Fragment } from "react";
import { FaPlusCircle } from "react-icons/fa";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import PDF from "./PDF";

require('dotenv').config()

const url = process.env.REACT_APP_URL

const CheckoutForm = ({ cart, passOrderId }) => {
  // axios.get(`${url}/hello/`).then(res => console.log(res)).catch(err => console.log(err))

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
  });
  const [multiAddress, setMultiAddress] = useState(false);
  const [ship, setShip] = useState([
    {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      items: [],
      shipOption: {
        name: "ground",
        price: 9.99,
      },
    },
  ]);
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
      shipTotal += addr.shipOption.price;
    });

    let total = 0;
    total += subtotal;
    total += shipTotal;

    setCartSubtotal(subtotal);
    setShipTotal(shipTotal)
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
    shipClone[name].shipOption = {
        name: value,
        price: value === "ground" ? 9.99 : 42.99
    }
    setShip(shipClone);
  }

  const addAddress = (e) => {
    e.preventDefault();
    setShip([
      ...ship,
      {
        street1: "",
        street2: "",
        zip: "",
        items: [],
        shipOption: {
          name: "ground",
          price: 9.99,
        },
      },
    ]);
  };

  const handlePay = async () => {
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
        .then((res) => passOrderId(res.data._id))
        .catch((err) => console.log(err));
    }

    console.log(confirmed);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="checkout-column">
            <div className="checkout-form card" style={{ display: "none" }}>
              <p>Have an Account?</p>
              <button className="button" style={{ marginLeft: 10 }}>
                Sign In
              </button>
            </div>
            <div className="checkout-form card">
              <div className="row">
                <h5>Contact</h5>
              </div>
                <div className="row-no-wrap">
                  <input
                    type="text"
                    name="firstName"
                    value={contact.firstName}
                    onChange={handleContactChange}
                    placeholder="First Name"
                    style={{ width: "50%" }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={contact.lastName}
                    onChange={handleContactChange}
                    placeholder="Last Name"
                    style={{ width: "50%" }}
                  />
                </div>
                <div className="row-no-wrap">
                  <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleContactChange}
                    placeholder="Email"
                  />
                </div>
                <div className="row-no-wrap">
                  <input
                    type="tel"
                    name="tel"
                    value={contact.tel}
                    onChange={handleContactChange}
                    placeholder="Phone"
                  />
                </div>
            </div>
            <div className="checkout-form card">
              <div className="row">
                <h5>Shipping Address</h5>
              </div>
                <div className="row-no-wrap">
                  <label htmlFor="multiple-address">
                    <input
                      type="checkbox"
                      id="multiple-address"
                      style={{ display: "inline" }}
                      onChange={() => setMultiAddress(!multiAddress)}
                    />
                    I need to ship to multiple addresses.
                  </label>
                </div>
                {ship.map((addr, index) => (
                  <div key={addr}>
                    <div
                      className="row-no-wrap"
                      style={{ display: multiAddress ? "" : "none" }}
                    >
                      <h3>Address {index + 1}</h3>
                    </div>
                    <div className="row-no-wrap">
                      <input
                        type="text"
                        placeholder="Street Address"
                        name={`${index} street1`}
                        value={addr.street1}
                        onChange={handleShipChange}
                      />
                    </div>
                    <div className="row-no-wrap">
                      <input
                        type="text"
                        placeholder="Apt, Suite, etc."
                        name={`${index} street2`}
                        value={addr.street2}
                        onChange={handleShipChange}
                      />
                    </div>
                    <div className="row-no-wrap">
                      <input
                        type="text"
                        placeholder="City"
                        name={`${index} city`}
                        value={addr.city}
                        onChange={handleShipChange}
                        style={{width: "50%"}}
                      />
                      <select
                        name={`${index} state`}
                        style={{width: "20%"}}
                        value={addr.state}
                        onChange={handleShipChange}
                      >
                        <option value="">State</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select>
                    </div>
                    <div className="row-no-wrap">
                      <input
                        type="string"
                        placeholder="ZIP Code"
                        name={`${index} zip`}
                        value={addr.zip}
                        onChange={handleShipChange}
                      />
                    </div>
                    <div className="row">
                      <h6>Shipping</h6>
                      <label>
                        <input
                          type="radio"
                          name={index}
                          value="ground"
                          onClick={handleShipSelected}
                          checked={
                            addr.shipOption.name === "ground" ? true : false
                          }
                        />
                        Fedex 2-3 Day Ground $9.99
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={index}
                          value="next-day"
                          onClick={handleShipSelected}
                          checked={
                            addr.shipOption.name === "next-day" ? true : false
                          }
                        />
                        Fedex Next Day Air $42.99
                      </label>
                    </div>
                    <div
                      className="row divider"
                      style={{ display: multiAddress ? "" : "none" }}
                    ></div>
                  </div>
                ))}
                <div
                  className="row-no-wrap"
                  style={{ display: multiAddress ? "" : "none" }}
                >
                  <button className="button" onClick={addAddress}>
                    Add Another Address
                    <FaPlusCircle style={{ marginLeft: 10 }} />
                  </button>
                </div>
            </div>
          </div>
        <div className="checkout-column">
          <div className="checkout-form card">
            <h5>Items</h5>
            <table className="checkout-items">
              <colgroup>
                  <col span='1' style={{width: '20%'}}/>
                  <col span='1' style={{width: '20%'}}/>   
                  <col span='1' style={{width: '10%'}}/>   
                  <col span='1' style={{width: '20%'}}/>         
              </colgroup>
              <tbody>
                {localCart.map((url) => (
                  <Fragment key={url}>
                    <tr>
                      <th
                        rowSpan={url.length + 1}
                        style={{ borderRight: "1px solid #d3d3d3", padding: 0, width: 80 }}
                      >
                        <PDF url={url[0].url} width={70} />
                      </th>
                      <th className="type">Type</th>
                      <th className="qty">Qty</th>
                      <th className="price">Price</th>
                    </tr>
                    <>
                      {url.map((item) => (
                        <tr key={item.name}>
                          <td style={{ fontSize: "0.8rem" }} className="type">
                            {item.name} {item.colorOption}{" "}
                            {item.bg ? "Background" : "No Background"}
                          </td>
                          <td className="qty">{item.qty * ship.length}</td>
                          <td className="price">
                            ${(item.price * item.qty * ship.length).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </>
                  </Fragment>
                ))}
                <tr>
                  <td colSpan={2}></td>
                  <td>Subtotal:</td>
                  <td>${cartSubtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td>Shipping:</td>
                  <td>${shipTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td>Total:</td>
                  <td>${cartTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card payment-form">
            <h5 style={{ marginBottom: 10 }}>Payment</h5>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                  },
                },
              }}
            />
            <button
              className="button"
              onClick={handlePay}
              style={{
                margin: '20px auto',
                pointerEvents: paymentProcessing ? "none" : "",
              }}
            >
              {paymentProcessing ? (
                <CircularProgress size={20} style={{ color: "#c30017" }} />
              ) : (
                `Pay $${cartTotal.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessForm = ({ orderId }) => {
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
        <div className="container">
          <div className="card checkout-form">
            <h3>Your Order is Complete.</h3>
            <table className="checkout-items">
            <colgroup>
                  <col span='1' style={{width: '20%'}}/>
                  <col span='1' style={{width: '20%'}}/>   
                  <col span='1' style={{width: '10%'}}/>   
                  <col span='1' style={{width: '20%'}}/>         
              </colgroup>
              <tbody>
                <tr>
                  <td colSpan={4}>Order Number: #{order.orderNumber}</td>
                </tr>
                {order.ship.map((addr) => (
                  <>
                    <tr>
                      <td colSpan={4}>
                        Shipping To: <br />
                        {addr.street1} {addr.street2}
                        <br />
                        {addr.city}, {addr.state} {addr.zip}
                      </td>
                    </tr>
                    {addr.items.map((url) => (
                      <>
                        <tr>
                          <th
                            rowSpan={url.length + 1}
                            style={{ borderRight: "1px solid #d3d3d3" }}
                          >
                            <PDF url={url[0].url} width={70} />
                          </th>
                          <th>Type</th>
                          <th>Qty</th>
                          <th style={{width: 50}}>Price</th>
                        </tr>
                        <>
                          {url.map((item) => (
                            <tr key={item.name}>
                              <td style={{ fontSize: "0.8rem" }}>
                                {item.name} {item.colorOption}{" "}
                                {item.bg ? "Background" : "No Background"}
                              </td>
                              <td>{item.qty}</td>
                              <td style={{width: 50}}>${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                          ))}
                        </>
                      </>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC
);

const Checkout = ({ cart }) => {
  const [orderId, setOrderId] = useState(null);

  const passOrderId = (id) => {
    setOrderId(id);
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
