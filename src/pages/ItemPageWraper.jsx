import React, { useEffect } from 'react'
import ItemPage from '../components/item/item'
import { useParams } from "react-router-dom";
import RecentlyViewed from '../components/resentlyViewed/ResentlyViewed';

function ItemPageWraper() {
  const { id } = useParams();

  
  
useEffect(() => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
}, [id]);

  return (
    <div>
        <ItemPage/>
        <RecentlyViewed/>
    </div>
  )
}

export default ItemPageWraper