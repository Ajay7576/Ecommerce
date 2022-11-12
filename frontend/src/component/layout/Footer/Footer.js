import React from "react";
import playStore from "../../../component/layout/images/playstore.png";
import appStore from "../../../component/layout/images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        {/* <h1>--- Jayoti Jasrotia ---</h1> */}
        <h3>High Quality is our first priority</h3>

        <h3>Copyrights 2022 &copy; Jayoti Jasrotia </h3>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/jayoti_jasrotia/">Instagram</a>
        <a href="https://www.linkedin.com/in/jayoti-jasrotia-2690798a/">LinkedIn</a>
        <a href="http://youtube.com">Youtube</a>
        <a href="http://facebook.com">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
