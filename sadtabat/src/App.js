import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import Addcatalog from "./components/checkrolecatalog";
import Banner from "./components/Banner";
import Collection from "./components/Collection";
import Footer from "./components/Footers";
import Gallery from "./components/Gallary";
import Approve from "./components/approveuser";
import UserRequest from "./components/Userequest";
import Vip from "./components/vip";
import Manual from "./components/Manual";
import Profile from "./components/Profile";
import GalleryId from "./components/Gallaryid";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserDetails />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/approve" element={<Approve />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/addcatalog" element={<Addcatalog />} />
          <Route path="/gallary/:id" element={<GalleryId />} />
          <Route path="/Banner" element={<Banner />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/gallary" element={<Gallery />} />
          <Route path="/vip" element={<Vip />} />
          <Route path="/Manual" element={<Manual />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/userrequest" element={<UserRequest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
