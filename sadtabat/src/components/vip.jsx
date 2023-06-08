import Menubra from './Menubra'
import Banner from './Banner'
import Menu from './Menu'
import Footer from './Footers'
import Search from './Search'
import { useState } from 'react'
import '../Home.css'

import '../CSS/vip.css'

function App() {
  const [count, setCount] = useState(0)
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
            <p className='top'>สมัคร VIP</p>
            <div className="vipbox">
              <img src="https://cdn.discordapp.com/attachments/1072242135593648169/1107803548508491856/5.png" />
              <div className="vipinfo">
                <div className="viptext">
                <p>- <span>ได้รับมงกุฎบนโปรไฟล์</span></p>
                <p>- <span>เพิ่มสมุดสะสมขึ้นมา 1 เล่ม</span></p>
                <p>- <span>เปลี่ยนรูปโปรไฟล์ได้</span></p>
                </div>
                <button onClick={logOut} className="btn btn-primary">สมัครสมาชิก</button>
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
