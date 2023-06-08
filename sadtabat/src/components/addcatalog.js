import React, { Component, useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menubra from "./Menubra";
import Footer from "./Footers";
import ReactPaginate from 'react-paginate';
import { useRef } from "react";
import Approve from "./approveuser";
import { Link } from 'react-router-dom';
import '../CSS/userrequest.css'
export default function SignUp() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [rate, setRate] = useState("");
  const [image, setImage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(title,type, from, rate, image);
    fetch("http://localhost:5000/addcatalog", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        title,
        type,
        from,
        rate,
        base64: image
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "Added catalog") {
          alert("Added collection");
          window.location.href = "./addcatalog";
        } else {
          alert("Something went wrong");
          window.location.href = "./addcatalog";
        }
      });
  };
  

  function covertToBase64(e) {
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result); //base64encoded string  
            setImage(reader.result);
        };
        reader.onerror = error => {
            console.log("Error: ", error);
        };
    }

    const [data, setData] = useState([]);
  const [limit,setLimit]=useState(5);
  const [pageCount,setPageCount]=useState(1);
  const currentPage=useRef();



  useEffect(() => {
    currentPage.current=1;
    // getAllUser();
    getPaginatedUsers();
  }, []);


  //fetching all user
  const getAllUser = () => {
    fetch("http://localhost:5000/getEnableCatalog", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setData(data.data);
      });
  };



//logout
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };


  //deleting user
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
          getAllUser();
        });
    } else {
    }
  };

  //pagination
  function handlePageClick(e) {
    console.log(e);
   currentPage.current=e.selected+1;
    getPaginatedUsers();
   

  }
  function changeLimit(){
    currentPage.current=1;
    getPaginatedUsers();
  }

  function getPaginatedUsers(){
    fetch(`http://localhost:5000/paginatedCatalog?page=${currentPage.current}&limit=${limit}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setPageCount(data.pageCount);
        setData(data.result)
        
       
      });

  }

  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("");
  const [editFrom, setEditFrom] = useState("");
  const [editRate, setEditRate] = useState("");

  // ...

  // updating user
  const updateUser = (id) => {
    fetch("http://localhost:5000/updateCatalog", {
      method: "PUT",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        catalogid: id,
        title: editTitle,
        type: editType,
        from: editFrom,
        rate: editRate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Update successful!");
        setEditIndex(null);
        getPaginatedUsers();
      });
  };

    
    

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
      <h3>Catalog Management</h3>
        <form className="form" onSubmit={handleSubmit}>
          <h3>Add catalog</h3>
          <div className="from-bg">
          <div>
          </div>
          <div className="mb-4">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
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
            <label>Price</label>
            <input
              type="text"
              className="form-control"
              placeholder="Price"
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Image</label>
            <input
                    accept="image/*"
                    type="file"
                    onChange={covertToBase64}
                />
                {image == "" || image == null ? "" : <img width={100} height={100} src={image} />}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Add item
            </button>
          </div>
          </div>
        </form>
        <div className="xd">
        <h3>All Of Catalog</h3>
        <table style={{ width: 1000 }}>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Type</th>
            <th>From</th>
            <th>Rate</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {data.map((i, index) => {
            return (
              <tr key={index}>
                <td><img width={180} height={126} src={i.image} /></td>
                <td>
                    {editIndex === index ? (
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    ) : (
                      i.title
                    )}
                  </td>
                <td>
                  {editIndex === index ? (
                    <input value={editType} onChange={(e) => setEditType(e.target.value)} />
                  ) : (
                    i.type
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input value={editFrom} onChange={(e) => setEditFrom(e.target.value)} />
                  ) : (
                    i.from
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input value={editRate} onChange={(e) => setEditRate(e.target.value)} />
                  ) : (
                    i.rate
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <button onClick={() => updateUser(i._id)}>Save</button>
                  ) : (
                    <button
                        onClick={() => {
                          setEditIndex(index);
                          setEditTitle(i.title);
                          setEditType(i.type);
                          setEditFrom(i.from);
                          setEditRate(i.rate);
                        }}
                      >
                        Edit
                      </button>

                  )}
                </td>
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
        <button style={{margin:10}} onClick={changeLimit}>Set Limit</button>
    
        </div>
        <Approve/>
        </div>
        <button onClick={logOut} className="btn btn-danger" style={{ marginTop: 10 }}>
          Log Out
        </button>

        </section>
    <Footer/>
        </body>
      </html>
  );
}
