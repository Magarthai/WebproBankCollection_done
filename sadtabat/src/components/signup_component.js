import React, { useState } from "react";
import Menubra from "./Menubra";
import Footer from "./Footers";
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMenu = () => setClick(false);
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };    

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fname, lname, email, password);
    fetch("http://localhost:5000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        email,
        lname,
        password,
        cpassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("Registration Successful");
          window.location.href = "./sign-in";
        } else if (data.status === "fpass") {
          alert("Password not matching");
          window.location.href = "./sign-up";
        } else if (data.status === "us") {
          alert("Email already exists");
          window.location.href = "./sign-up";
        } else {
          alert("Something went wrong");
          window.location.href = "./sign-up";
        }
      });
  };

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
          <h3>Sign Up</h3>
          <div>
          </div>
          <div className="mb-3">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

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
            <label>Confirm password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              onChange={(e) => setCpassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">sign in?</a>
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
