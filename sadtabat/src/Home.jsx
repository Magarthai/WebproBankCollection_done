import Menubra from './components/Menubra'
import Banner from './components/Banner'
import Menu from './components/Menu'
import Footer from './components/Footers'
import { useState } from 'react'
import 'animate.css';
import './Home.css'



export default function UserHome({ userData }) {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
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
          <section class="main-content">
          <div className='animate__animated animate__fadeInDown'>
            <div id="main">
              <Banner />
              <div className="Menu">
                <Menu />
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