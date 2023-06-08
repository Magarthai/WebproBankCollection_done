import Menubra from './Menubra'
import Banner from './Banner'
import Menu from './Menu'
import Footer from './Footers'
import Search from './Search'
import { useState } from 'react'
import '../Home.css'



function App() {
  const [count, setCount] = useState(0)

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
          </section>
          <Footer/>
        </body>
      </html>
    </>
  )
}


export default App
