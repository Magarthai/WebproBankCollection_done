import React, { useEffect, useState } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import '../auth.css'
import Menubra from "./Menubra";
import Footer from "./Footers";
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleClick = () => setClick(!click);
  const closeMenu = () => setClick(false);
  const [click, setClick] = useState(false);
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };  

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);
    fetch("http://localhost:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);

          window.location.href = "./userDetails";
        }
        if (data.status === "error") {
          alert("Invalid password");
          window.localStorage.setItem("loggedIn", false);

          window.location.href = "./sign-in";
        }
        if (data.status === "noacc") {
          alert("Invalid email");
          window.localStorage.setItem("loggedIn", false);

          window.location.href = "./sign-in";
        }
      });
  }

  return (
    <html>
    <body>
      <header>
        <div className="app">
        <header className="header">
      <section className="container">
        <div className="menu-con">

          <div className="webname">
            <Link to="/">Sadtabat</Link>
          </div>
          <ul className={click ? 'menu active' : 'menu'}>
            <li className="menulink" onClick={closeMenu}>
              <Link to="/sign-in">ล็อคอิน</Link>
            </li>
                </ul>

                <div className="menumobile" onClick={handleClick}>
                    {click ? (
                        <FiX />
                    ) : (
                        <FiMenu />
                    )}
                </div>
            </div>
        </section>
    </header>
        </div>
      </header>
      <section class="main-content">
    <div className="auth-wrapper" style={{backgroundColor: "#fff",marginTop: 50}}>
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            <a href="/sign-up">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
    </section>
        
        <Footer/>
            </body>
          </html>
  );
}
