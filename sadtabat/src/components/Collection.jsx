import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Menubra from './Menubra';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BiSearchAlt2 } from "react-icons/bi";
import Footer from './Footers';

export default function Collection() {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkToken();
    if (userId) {
      getCatalogFromUser();
    }
  }, [userId]);
  

  const getCatalogFromUser = () => {
    fetch(`http://localhost:5000/userCatalog/${userId}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "ok") {
          setData(result.data);
        }
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const searchText = `${item.type} ${item.from} ${item.rate}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  const removeCatalogIdFromUserInfo = (catalogId) => {
    if (!userId) {
      return Promise.resolve(null);
    }
  
    if (window.confirm("Are you sure you want to remove this catalog from your collection?")) {
      return fetch("http://localhost:5000/removeCatalogIdFromUserInfo", {
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
          alert("ได้นําออกจาก Collection แล้ว"); // แสดงผลการลบเป็นแจ้งเตือน
          console.log(data);
          window.location.href = "/collection";
          return data;
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  };
  
  return (
    <>
      <html>
        <body>
          <header>
            <div className="app">
              <Menubra />
            </div>
          </header>
          <section className="main-content">
            <div className="animate__animated animate__fadeInDown">
              <div id="main">
              <p className="top" style={{margin:0}}>Collection</p>
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
                  <Link to="/gallary"><button style={{margin:10, width:60, height:60}} className='buttons'><span style={{fontSize:15}}>+</span></button></Link>
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
                              className="btn btn-danger"
                              onClick={() =>
                                removeCatalogIdFromUserInfo(item._id)
                              }
                            >
                              Remove from collection
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
