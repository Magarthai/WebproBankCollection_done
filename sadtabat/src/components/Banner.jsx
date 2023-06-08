import React from 'react'
import "../CSS/Banner.css"
import { Link } from 'react-router-dom';
function Banner() {
  return (
    <section className="containerban">
          <div className="item">
          <h1 className="title">
          Let's keep your collection on our website.
          </h1>
          <p className="desc">
          Collect banknotes on our website. We have almost all Thai banknotes available in this website.
          </p>
          <Link to="/gallary"><button className='buttons'><span>Let's try</span></button></Link>
          </div>
        <div className="item">
          <img src="https://cdn.discordapp.com/attachments/445928139021877259/1115339134664454205/banknote.png" alt="" className="imgb" />
        </div>
        
    </section>
  )
}

export default Banner