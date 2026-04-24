import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import styles from "./NewArrival.module.css";
import ProductCard from "./ProductCard";
import { buildUrl,buildStorageUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Drawer state
  const scrollRef = useRef();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(api("/products/latest"))
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const getPrimaryImage = (product) => {
    const primary =
      product.images?.find((img) => img.is_primary) || product.images?.[0];

    return primary
      ? buildStorageUrl(primary.image_path)
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
            <div style={{ minWidth: "470px",marginRight: "16px" }} key={product.id}>
              <ProductCard
              product={product}
              addToCart={addToCart}
              />
  
</div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default NewArrivals;