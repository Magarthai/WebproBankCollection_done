import React from 'react'
import "/src/CSS/Menu.css"


function menu() {
  return (
    <div className="service">
        <a href="/collection"><img src="/src/img/3.png" /><span>คลังธนบัตร</span></a>
        <a href="/gallary"><img src="/src/img/4.png" /><span>สมุดสะสม</span></a>
        <a href="/vip"><img src="/src/img/5.png" /><span>VIP</span></a>
        <a href="/manual"><img src="/src/img/8.png" /><span>คู่มือการใช้งาน</span></a>
    </div>
  )
}

export default menu