import Menubra from './Menubra'
import Banner from './Banner'
import Menu from './Menu'
import Footer from './Footers'
import "../CSS/Banner.css"
import { Link } from 'react-router-dom';
import Search from './Search'
import React, { Component, useEffect, useState } from "react";
import '../CSS/Profile.css'




function App() {

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsedToken = parseJwt(token);
      if (parsedToken) {
        setUserId(parsedToken.userId);
      } else {
        alert("Invalid token");
      }
    } else {
      alert("Login first");
      window.location.href = "/sign-in";
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };
  const [count, setCount] = useState(0)
  const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);


  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        if (data.data.userType == "Admin") {
          setAdmin(true);
        }

        setUserData(data.data);

        if (data.data == "token expired") {
          alert("Token expired login again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      });
  }, []);

  return (
    <>
      <html>
        <body>
          <header>
            <div className="app">
              <Menubra />
            </div>
          </header>
          <section class="main-content">
            <div className="wrapper" style={{backgroundColor: "#fff"}}>
                <div className="inner">
                <div className="imagearea">
                    <div className="inner-area">
                        <img src="https://cdn.discordapp.com/attachments/1072242135593648169/1107803549552885860/9.png" alt="" />
                    </div>
                </div>
                <div className="name">Name: {userData.fname}</div>
                <div className="name">Lastname: {userData.lname}</div>
                <div className="name">Email: {userData.email}</div>
                <Link to="/collection"><button style={{margin:10, width:200}} className='buttons'><span>Colelction</span></button></Link>
                </div>
            </div>

          </section>
          <Footer/>
        </body>
      </html>
    </>
  )
}


export default App
