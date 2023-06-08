import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Menubra from './Menubra';
import Banner from './Banner';
import Menu from './Menu';
import Footer from './Footers';
import { Link } from 'react-router-dom';

export default function GalleryId() {
  const { id } = useParams();
  const [catalog, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/getEnableCatalog/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setData(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  if (!catalog) {
    return <div>Loading...</div>;
  }

  return (
    <html>
        <body>
          <header>
            <div className="app">
              <Menubra />
            </div>
          </header>
          
          <section class="main-content" style={{paddingTop:150}}>
          <div className='animate__animated animate__fadeInDown'>
          <div id="mains">
          <div>
            <h1>{catalog.title}</h1>
            <img width={420} height={252} src={catalog.image} />
            <p>ชนิดธนบัตร: {catalog.type}</p>
            <p>สมัยราชกาลที่: {catalog.from}</p>
            <p>ราคา: {catalog.rate}</p>
          </div>
          </div>
          </div>
          <Link to="/gallary"><button style={{margin:10, width:200}} className='buttons'><span style={{fontSize:15}}>กลับไปหน้าคลังธนบัตร</span></button></Link>
    </section>
        
    <Footer/>
        </body>
      </html>
  );
  
  
}
