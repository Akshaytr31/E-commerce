import React from 'react'
import Favorites from '../components/favorites/favorites'
import ResentlyViewed from '../components/resentlyViewed/ResentlyViewed'

function favorite() {
  return (
    <div>
        <Favorites/>
        <ResentlyViewed/>
    </div>
  )
}

export default favorite