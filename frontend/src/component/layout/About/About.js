import "./about.css";

import profile from "../images/jayoti.png";

import React from "react";

import MetaData from "../MetaData";

import TextAnim from "./TextAnim.js";



const About = () => {


  return (
    <div>
        <MetaData title="JAYOTI JASROTIA -- About"/>

        <div className="c">

            <div className="c-left">

                <div className="c-left-wrapper">
                     <br/>
                     <br/>
                    <h1 className="c-name">JAYOTI JASROTIA</h1>
                    <p className="c-para">Hey! I am a <span className="ro">Software Developer</span>. I've worked as a freelancer. 
                    I look forward to hearing from you to see how we might work together.</p>

                    <div className="c-title">
                      <TextAnim/>
                    </div>
                  
              <br/>
              <br/>
                    <div>
                        <h1 className="ex"><i>Experience</i></h1>
                        &nbsp;
                        <h3 >Process and Development Manager</h3>
                        <p><span className="ro">Edge Consultants Arizona</span></p>
                        <p>Jun 2016 - Feb 2019 · 2 yrs 9 month</p>
                        &nbsp;
                    <h3>Team Lead Manager</h3>
                    <p><span className="ro">Simsaw Inc.</span></p>
                     <p>July 2011 - May 2016 4 years 11 months  Mohali, India</p>   
                    </div>
                    <div>
                    <br/>
                    <h1 className="ex"><i>Education</i></h1>
                     <br/>
                     <h3>Punjab Technical University</h3>
                     <p>Bachelor of Science , Information Technology</p>
                      <>2012-2014</>
                       <br/>
                       <br/>
                    <h3>KC college of Polytechnic </h3>
                    <p>Diploma , Information Technology</p>
                    <>2006-2009</>
                  </div>
                </div>
            </div>
            <div className="c-right">
                <div className="c-bg">
               <img src={profile} className="c-img" alt="profile"/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default About;
