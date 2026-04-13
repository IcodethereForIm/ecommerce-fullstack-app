import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import styles from "./NewArrival.module.css";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Drawer state
  const scrollRef = useRef();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/latest")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const getPrimaryImage = (product) => {
    const primary =
      product.images?.find((img) => img.is_primary) || product.images?.[0];

    return primary
      ? `http://127.0.0.1:8000/storage/${primary.image_path}`
      : "https://via.placeholder.com/300";
  };

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="container-fluid my-5 px-3">
      <h2 className="mb-2">New In</h2>
      <p>Upgrade your closet with everything trendy</p>

      <div className="position-relative">

        {/* Arrows */}
        <button className={styles.arrowbtn +" "+ styles.left} onClick={scrollLeft}><FaChevronLeft /></button>
        <button className={styles.arrowbtn+" "+styles.right} onClick={scrollRight}><FaChevronRight /></button>

        {/* Scroll Container */}
        <div className={`${styles.scrollcontainer} d-flex gap-3 pb-3`} ref={scrollRef}>
          {products.map((product) => (
            <div style={{ minWidth: "420px",marginRight: "16px" }} key={product.id}>
  <Link
    to={`/product/${product.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div className={`card h-100 shadow-sm ${styles.productCard}`}>
  {/* IMAGE SECTION */}
  <div className={styles.cardimage} style={{ height: "600px" }}>
    <img
      src={getPrimaryImage(product)}
      alt={product.name}
    />
    {/* Add to Cart button inside image container */}
    <button
      className={styles.addToCartBn}
      onClick={(e) => {
        e.preventDefault(); // stop navigation
        setSelectedProduct(product); // open drawer
      }}
    >
      Add to Cart
    </button>
  </div>

  {/* INFO SECTION */}
  <div className={styles.cardinfo}>
    <h5>{product.name}</h5>
    <p>₹{product.price}</p>
  </div>
</div>
  </Link>
</div>
          ))}
        </div>
      </div>

      {/* Side Drawer */}
      {selectedProduct && (
        <>
          {/* Overlay */}
          <div className={styles.overlay} onClick={() => setSelectedProduct(null)}></div>

          {/* Drawer Panel */}
          <div className={styles.sidepanel} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closebtn} onClick={() => setSelectedProduct(null)}>✕</button>

            <img
              src={getPrimaryImage(selectedProduct)}
              style={{ width: "100%", borderRadius: "10px" }}
              alt={selectedProduct.name}
            />
            <h3 className="mt-3">{selectedProduct.name}</h3>
            <p>₹{selectedProduct.price}</p>

            <button
              className="btn btn-dark w-100 mt-3"
              onClick={() => {
                addToCart(selectedProduct);  // Add to cart
                setSelectedProduct(null);    // Close drawer
              }}
            >
              <FaShoppingCart className="me-2" />
              Add to Cart
              Buy now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NewArrivals;