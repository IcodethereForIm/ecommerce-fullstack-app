import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 pt-5 pb-3">
      <div className="container">
        <div className="row">

          {/* BRAND */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold">YourBrand</h4>
            <p className="small">
              Premium fashion for men & women. Designed for everyday style.
            </p>
          </div>

          {/* LINKS */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/collections/men" className="footer-link">Men</Link></li>
              <li><Link to="/collections/women" className="footer-link">Women</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-semibold">Contact</h6>
            <p className="small mb-1">Email: support@yourbrand.com</p>
            <p className="small mb-1">Phone: +91 9876543210</p>
            <p className="small">India</p>
          </div>

        </div>

        <hr className="border-light" />

        <div className="text-center small">
          © {new Date().getFullYear()} YourBrand. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;