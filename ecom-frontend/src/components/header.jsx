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

      {/* Brand */}
      <a className="navbar-brand" href="#">Brand Icon</a>

      {/* LEFT SIDE (NO COLLAPSE NOW) */}
      <div className="navbar-collapse">
        <ul className="navbar-nav me-auto">

          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>

          {user?.role === "admin" && (
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/account"
                data-bs-toggle="dropdown"
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
            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              Categories
            </a>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/category/men">Men</Link></li>
              <li><Link className="dropdown-item" to="/category/women">Women</Link></li>
              <li><Link className="dropdown-item" to="/category/kids">Kids</Link></li>
              <li><Link className="dropdown-item" to="/others">Collections</Link></li>
            </ul>
          </li>

        </ul>
      </div>

      {/* RIGHT SIDE (UNCHANGED) */}
      <div className="d-flex align-items-center gap-3 ms-auto">

        <div className="d-none d-md-block">
          <SearchBar />
        </div>

        <Link to="/liked" className="btn btn-outline-dark position-relative">
          <i className="bi bi-heart fs-5"></i>
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
  </nav>
</main>
    )
        }
        export default Header