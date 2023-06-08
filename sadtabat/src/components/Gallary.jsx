import Menubra from './Menubra';
import Banner from './Banner';
import Menu from './Menu';
import Footer from './Footers';
import "../CSS/Search.css"
import { BiSearchAlt2 } from 'react-icons/bi';
import Search from './Search';
import { AiFillHeart } from "react-icons/ai";
import '../Home.css';
import '../CSS/Collection.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

export default function Gallary() {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkToken();
    getEnableCatalog();
  }, []);

  useEffect(() => {
    if (userId) {
      addCatalogIdToUserInfo();
    }
  }, [userId]);

  const getEnableCatalog = () => {
    fetch("http://localhost:5000/getEnableCatalog", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        const enabledData = data.data.filter((item) => item.status === "enable");
        setData(enabledData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const handleAddCatalog = (catalogId) => {
    if (userId) {
      addCatalogIdToUserInfo(catalogId)
        .then((data) => {
          if (data && data.status === "Catalog ID successfully added to UserInfo") {
            alert("Added collection");
            window.location.href = "/collection";
          } else if (data && data.status === "Catalog ID already exists in UserInfo") {
            window.location.href = "/gallary";
            alert("Collection already exists");
          } else {
            alert("Failed to add collection");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please login first");
    }
  };
  
  const addCatalogIdToUserInfo = (catalogId) => {
    if (!userId) {
      return Promise.resolve(null);
    }
  
    return fetch("http://localhost:5000/addCatalogIdToUserInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        catalogId: catalogId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const searchText = `${item.type} ${item.from} ${item.rate}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });
  

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
            <div className='animate__animated animate__fadeInDown'>
            <div id="main">
                <p className="top">คลังธนบัตร</p>
                <div className="bodys">
                  <div className="box">
                    <input
                      type="text"
                      name=""
                      id=""
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <i>
                      <BiSearchAlt2 size="100rem" className="icon" />
                    </i>
                  </div>
                </div>
                <div className="cardbody">
                  <div className="items">
                    {filteredData.map((item) => (
                      <Link to={`/gallary/${item._id}`} key={item._id}>
                        <div
                          className="card"
                          style={{ "--clr": "#009688" }}
                          key={item._id}
                        >
              
                          <div className="imgBsx">
                            <img
                              width={180}
                              height={126}
                              src={item.image}
                              alt={item.title}
                            />
                          </div>
                          <div className="content">
                            <h2>{item.title}</h2>
                            <p>{item.type}</p>
                            <p>เริ่มใช้ในสมัยราชกาลที่: {item.from}</p>
                            <p>ราคาธนบัตร: {item.rate} บาท</p>
                            <button
                              onClick={() => handleAddCatalog(item._id)}
                            >
                              Add to collection
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer/>
        </body>
      </html>
    </>
  );
}
