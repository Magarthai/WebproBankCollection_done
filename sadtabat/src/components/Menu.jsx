import React from 'react'
import "../CSS/Menu.css"


function menu() {
  return (
    <div className="service">
        <a href="/gallary"><img src="https://cdn.discordapp.com/attachments/1072242135593648169/1107803548038742078/3.png" /><span>คลังธนบัตร</span></a>
        <a href="/collection"><img src="https://cdn.discordapp.com/attachments/1072242135593648169/1107803548290396370/4.png" /><span>สมุดสะสม</span></a>
        <a href="/userrequest"><img src="https://cdn.discordapp.com/attachments/445928139021877259/1116075471625523260/2.png" /><span>เพิ่มธนบัตร</span></a>
        <a href="/Profile"><img src="https://cdn.discordapp.com/attachments/445928139021877259/1116223504283602985/5.png" /><span>Profile</span></a>
    </div>
  )
}

export default menu