//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'
import { Route,Routes } from "react-router-dom"
import Header from "./components/header"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Signin from "./pages/Signin"
import Admin from "./pages/Admin"
import ProductDetails from "./pages/ProductDetails"
import CategoryProducts from "./pages/ProdCategory"
import Cart from "./pages/Cart"
import LoginSignup from "./pages/LoginSignup"
import Checkout from "./pages/CheckOut"
import OrderSuccessPage from "./pages/OrderSuccess"
import MyOrdersPage from "./pages/MyOrder"
import ImageLibrary from "./components/ImageLibary"
import EditProduct from "./components/Admin/EditProduct"
import CollectionPage from "./pages/Collections"
import SearchPage from "./pages/SearchPage"
import Footer from "./components/Footer"



function App() {

  return(
    <main>
      <Header/>
      <div className="main-content">
  

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/admin/edit/:id" element={<EditProduct/>}/>
        <Route path="/category/:slug" element={<CategoryProducts/>}/>
        <Route path="/collections/:slug" element={<CollectionPage/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/account" element={<LoginSignup/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/success/:orderId" element={<OrderSuccessPage/>}/>
        <Route path="/orders" element={<MyOrdersPage/>}/>
        <Route path="/admin/images" element={<ImageLibrary/>}/>
        <Route path="/search" element={<SearchPage />} />

      </Routes>

      
      </div>
      <Footer/>
    </main>
  )

}

export default App