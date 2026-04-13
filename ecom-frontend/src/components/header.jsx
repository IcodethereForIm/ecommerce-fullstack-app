import { Link } from "react-router-dom"
import React,{ useState,useEffect } from "react"
import { CartContext } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import "./Header.css"
import SearchBar from "./SearchBar";
function Header(){

  const { cartItems } = React.useContext(CartContext);
  const {user} = useAuth()
  

const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
);


    return(

        <main>
  <nav className="navbar navbar-expand-lg fixed-top">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">Brand Icon</a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {/* Left side menu */}
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link active" to="/">Home</Link>
          </li>

          {user?.role === "admin" &&(
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to="/account"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Account
            </Link>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><Link className="dropdown-item" to="/register">New Register</Link></li>
              <li><Link className="dropdown-item" to="/signin">Sign In</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="/admin">Admin</Link></li>
            </ul>
          </li>
          )}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Categories
            </a>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/category/men">Men</Link></li>
              <li><Link className="dropdown-item" to="/category/women">Women</Link></li>
              <li><Link className="dropdown-item" to="/categories/kids">Kids</Link></li>
              <li><Link className="dropdown-item" to="/others">Collections</Link></li>
            </ul>
          </li>
        </ul>

        {/* Right side menu */}
        <div className="d-flex align-items-center gap-3">
          <div className="search-bar">
            <SearchBar/>
          </div>
          {/* New icons */}
          <Link to="/liked" className="btn btn-outline-dark position-relative">
            <i className="bi bi-heart fs-5"></i>
            {/* Optionally, add badge for liked items */}
            {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span> */}
          </Link>

          <Link to="/account" className="btn btn-outline-dark">
            <i className="bi bi-person fs-5"></i>
          </Link>

          <Link to="/cart" className="btn btn-outline-dark position-relative">
            <i className="bi bi-cart fs-5"></i>
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  </nav>
</main>
    )
        }
        export default Header