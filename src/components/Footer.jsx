import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} All Rights Reserved by Shree Balaji Jewellers.
      </div>
    </footer>
  );
};

export default Footer;