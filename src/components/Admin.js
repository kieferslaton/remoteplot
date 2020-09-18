import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Login from "./Login";
import Ship from "./Ship";

const url = process.env.REACT_APP_URL;

const Admin = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    if (Cookies.get("token")) {
      const token = Cookies.get("token");
      const payload = { headers: { authorization: token } };
      axios
        .post(`${url}/users/accounts`, {}, payload)
        .then((res) => setUser(res.data))
        .catch((err) => console.log(err.status));
    }
  }, []);

  const handleLogin = (username, password) => {
    console.log("running");
    axios
      .post(`${url}/users/login`, {
        username,
        password,
      })
      .then((res) => {
        const token = res.data;
        Cookies.set("token", token);
        const payload = { headers: { authorization: token } };
        axios
          .post(`${url}/users/accounts`, {}, payload)
          .then((res) => setUser(res.data))
          .catch((err) => console.log(err.status));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {user ? (
        <>
          {user.admin === true ? (
            <Ship />
          ) : (
            "Sorry, you don't have access to this page"
          )}
        </>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </>
  );
};

export default Admin;
