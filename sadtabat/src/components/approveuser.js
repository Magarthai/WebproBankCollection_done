import React, { Component, useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from 'react-paginate';
import { useRef } from "react";
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [rate, setRate] = useState("");
  const [image, setImage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(type, from, rate, image);
    fetch("http://localhost:5000/updateCatalogStatus", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
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
  const getEnableUser = () => {
    fetch("http://localhost:5000/getUnEnableCatalog", {
        method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data, "userData");
        const UnenableCatalogs = data.data.filter(item => item.status === "unenable");
        setData(UnenableCatalogs);
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
          getEnableUser();
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
    fetch(`http://localhost:5000/paginatedApproveCatalog?page=${currentPage.current}&limit=${limit}`, {
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
        type: editType,
        from: editFrom,
        rate: editRate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.data);
        setEditIndex(null);
        getPaginatedUsers();
      });
  };

  const approveItem = (id) => {
    fetch("http://localhost:5000/approveCatalog", {
      method: "PUT",
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
        alert("Approved");
        getPaginatedUsers();
      });
  };
  
    

  return (
    <div>
        <h3>Approve User</h3>
        <table style={{ width: 1000 }}>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Type</th>
            <th>From</th>
            <th>Price</th>
            <th>Approve</th>
            <th>Delete</th>
          </tr>
          {data.map((i, index) => {
            return (
                <tr key={index}>
                <td><img width={180} height={126} src={i.image} /></td>
                <td>{i.title}</td>
                <td>{i.type}</td>
                <td>{i.from}</td>
                <td>{i.rate}</td>
                <td>
                    <button onClick={() => approveItem(i._id)}>Approve</button>
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
        <button onClick={changeLimit}>Set Limit</button>
        <Link to="/userDetails"><button style={{margin:10}}><span>Manage user</span></button></Link>
        </div>

      





  );
}
