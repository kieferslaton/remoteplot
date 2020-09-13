import React, { useState, useEffect } from "react";
import { FaRegTimesCircle, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from 'react-router-dom'

import PDF from './PDF'

const Cart = ({
  removeItemFromCart,
  decrementQuantity,
  incrementQuantity,
  cart,
}) => {
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

    organizedCart.forEach(url => {
      url.sort((a, b) => a.height > b.height ? 1 : -1)
    })

    setLocalCart(organizedCart);

    let sum = 0;

    cart.forEach((item) => {
      sum += item.price * item.qty;
    });

    setTotal(sum);
  }, [cart]);

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="row" style={{ paddingTop: 10 }}>
        <h2>Cart</h2>
      </div>
      <div className="row">
        <div className="cart-container card">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <table>
              <colgroup>
                <col style={{width: '20%'}} />
                <col style={{width: '30%'}} />
                <col style={{width: '20%'}} />
                <col style={{width: '10%'}} />
              </colgroup>
                <tbody>
              {localCart.map((url) => (
                <>
                  <tr>
                    <td colSpan="4">
                      <PDF url={url[0].url} width={200} />
                    </td>
                  </tr>
                  <tr className="header-row">
                    <td>Item</td>
                    <td style={{ textAlign: "center" }}>Qty</td>
                    <td style={{ textAlign: "center" }}>Price</td>
                    <td></td>
                  </tr>
                  <>
                    {url.map((item) => (
                      <tr key={item.name}>
                        <td>{item.name} {item.colorOption} {item.bg ? 'Background' : 'No Background'}</td>
                        <td
                          style={{
                            display: "flex",
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
                        </td>
                        <td style={{ textAlign: "center" }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <FaRegTimesCircle
                            size={20}
                            onClick={() => removeItemFromCart(item)}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                </>
              ))}
              <tr>
                <td colSpan={4}> </td>
              </tr>
              <tr className="footer-row">
                <td></td>
                <td style={{textAlign: 'center'}}>Total:</td>
                <td style={{textAlign: 'center'}}>${total.toFixed(2)}</td>
                <td></td>
              </tr>
              <tr>
                  <td colSpan={4}>
                      <Link to="/checkout" className="checkout-button"><button className="button">Checkout</button></Link>
                  </td>
              </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
