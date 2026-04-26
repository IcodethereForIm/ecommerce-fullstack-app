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
  <nav className="navbar fixed-top">
  <div className="container-fluid d-flex align-items-center flex-nowrap">

    {/* LEFT SIDE */}
    <div className="d-flex align-items-center gap-3 flex-nowrap">

      <a className="navbar-brand mb-0" href="#">Brand</a>

      <Link className="nav-link" to="/">Home</Link>

      {user?.role === "admin" && (
    <div className="dropdown">
      <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
        Admin
      </a>
      <ul className="dropdown-menu">
        <li><Link className="dropdown-item" to="/register">New Register</Link></li>
        <li><Link className="dropdown-item" to="/signin">Sign In</Link></li>
        <li><hr className="dropdown-divider" /></li>
        <li><Link className="dropdown-item" to="/admin">Admin Pannel</Link></li>
      </ul>
    </div>
  )}

      <div className="dropdown">
        <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
          Categories
        </a>
        <ul className="dropdown-menu">
          <li><Link className="dropdown-item" to="/category/men">Men</Link></li>
          <li><Link className="dropdown-item" to="/category/women">Women</Link></li>
          <li><Link className="dropdown-item" to="/category/kids">Kids</Link></li>
        </ul>
      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="d-flex align-items-center gap-2 ms-auto flex-nowrap">

      <div className="d-none d-md-block">
        <SearchBar />
      </div>

      <Link to="/liked" className="btn btn-outline-dark">
        <i className="bi bi-heart"></i>
      </Link>

      <Link to="/account" className="btn btn-outline-dark">
        <i className="bi bi-person"></i>
      </Link>

      <Link to="/cart" className="btn btn-outline-dark position-relative">
        <i className="bi bi-cart"></i>
        {totalItems > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
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