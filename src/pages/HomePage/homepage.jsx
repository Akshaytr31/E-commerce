// import React from 'react';
// import Navbar from "../../components/navbar";
// import "./homePage.css";
// import { useNavigate } from 'react-router-dom';

// function Homepage() {
//   const navigate = useNavigate();

//   return (
//     <div className='homePage'>
//       <div className='homePage-title'>
//         <h1>Where style meets comfort — and it’s all just a click away.</h1>
//         <div className='homePage-para'>
//           Dive into a universe where 
//           art meets attitude. Our T-shirts celebrate the stories,
//           heroes, and emotions that shape you. Whether it’s anime,
//           games, or pop culture, every design is crafted to help you
//           express your true self — boldly and unapologetically.
//         </div>
//         <button onClick={() => navigate('/products')}>
//           Shop Now
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Homepage;



import React from 'react'
import ProductPage from '../../components/product/product'

function homepage() {
  return (
    <div>
      <ProductPage/>
    </div>
  )
}

export default homepage
