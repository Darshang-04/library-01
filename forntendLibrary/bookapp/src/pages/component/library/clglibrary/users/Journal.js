import React from 'react'
import Userlayout from '../../../../../u_layout';

export default function Journal() {
  return (
    <>
    <div>Journal</div>
    
    </>
  )
}

Journal.getLayout = function getLayout(page) {
    return <Userlayout>{page}</Userlayout>;
  };