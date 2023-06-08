import React, { Component, useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menubra from "./Menubra";
import Footer from "./Footers";
import ReactPaginate from 'react-paginate';
import { useRef } from "react";
import { Link } from 'react-router-dom';
import '../CSS/userrequest.css'
export default function UserRequest() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [rate, setRate] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("unenable");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(type, from, rate, image, status);
    fetch("http://localhost:5000/userrequest", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        type,
        from,
        rate,
        base64: image,
        status,
        userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "Added catalog") {
          alert("Added collection");
          window.location.href = "./userrequest";
        } else {
          alert("Something went wrong");
          window.location.href = "./userrequest";
        }
      });
  };

  function covertToBase64(e) {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  }

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      const parsedToken = parseJwt(token);
      if (parsedToken) {
        setUserId(parsedToken.userId);
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

  const [data, setData] = useState([]);
  const [limit,setLimit]=useState(5);
  const [pageCount,setPageCount]=useState(1);
  const currentPage=useRef();

  function handlePageClick(e) {
    console.log(e);
   currentPage.current=e.selected+1;
    getPaginatedUsers();
   

  }
  function changeLimit(){
    currentPage.current=1;
    getPaginatedUsers();
  }

  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      fetch("http://localhost:5000/deleteCatalog", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
        catalogid: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          window.location.href = "/userrequest";
        });
    } else {
    }
  };

  function getPaginatedUsers() {
    const token = window.localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split(".")[1])).userId;
  
    fetch(`http://localhost:5000/paginatedUserCatalog?page=${currentPage.current}&limit=${limit}&userId=${userId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setPageCount(data.pageCount);
        setData(data.result);
      });
  }

  
  

  useEffect(() => {
    currentPage.current=1;
    checkToken();
    getPaginatedUsers();
  }, []);

  return (
    <html>
        <body>
          <header>
            <div className="app">
              <Menubra />
            </div>
          </header>
          <section class="main-content">
          <div id="mains">
      <h3>Request</h3>
        <form className="form" onSubmit={handleSubmit}>
          <h3>Add catalog</h3>
          <div className="from-bg">

          <div className="mb-4">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Type</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type"
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>From</label>
            <input
              type="text"
              className="form-control"
              placeholder="From"
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Rate</label>
            <input
              type="text"
              className="form-control"
              placeholder="Rate"
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Image</label>
            <input accept="image/*" type="file" onChange={covertToBase64} />
            {image == "" || image == null ? (
              ""
            ) : (
              <img width={100} height={100} src={image} alt="Preview" />
            )}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          
          </div>
        </form>
        <div className="main-contain2">
        <h3>Request log</h3>
        <table style={{ width: 1000 }}>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Type</th>
            <th>From</th>
            <th>Price</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
          {data.map((i) => {
            return (
              <tr>
                <td><img width={180} height={126} src={i.image}></img></td>
                <td>{i.title}</td>
                <td>{i.type}</td>
                <td>{i.from}</td>
                <td>{i.rate}</td>
                <td>{i.status}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteUser(i._id, i.type)}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage.current-1}
        />
        <input placeholder="Limit" onChange={e=>setLimit(e.target.value)}/>
        </div>
        </div>
        </section>
        
    <Footer/>
        </body>
      </html>
        
  );
}
