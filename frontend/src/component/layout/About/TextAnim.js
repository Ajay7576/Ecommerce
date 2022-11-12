import React from 'react'

import "./textAnim.css"

const contact = () => {

  localStorage.setItem("refresh",false);

  return (
    
         <div className="i-title">
            <div className="i-title-wrapper">
            <div className="i-title-item">Project Estimation</div>
            <div className="i-title-item">Management</div>
            <div className="i-title-item">Landscape and irrigation</div>
            <div className="i-title-item">Web Developer</div>
            <div className="i-title-item">Artist</div>
            <div className="i-title-item">Photographer</div>
            </div>
          </div>
    
  )
}

export default contact;