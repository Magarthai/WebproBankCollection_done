import React from 'react'
import '../Home.css'
import { BsFacebook } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { GiSmartphone } from 'react-icons/gi';
function footer() {
  return (
    <footer>
          <div className="contract">
              <p><GiSmartphone className='icon'/>097-224-7631</p>
              <p><MdEmail className='icon'/>Magargame@gmail.com</p>
              <p><BsFacebook className='icon'/>ทัศมาพล บุญจันทึก</p>
            </div>
            <p className='year'>©2023 สธบัตร</p>
    </footer>
  )
}

export default footer