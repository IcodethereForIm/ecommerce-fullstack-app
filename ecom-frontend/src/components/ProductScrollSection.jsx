import React, { useRef } from "react";
import styles from "./ProductScrollSection.module.css";
import ProductCard from "./ProductCard";



function ProductScrollSection({ products = [], addToCart, title }) {
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  const formatTitle = (type) => {
  if (!type) return null;

  return type.charAt(0).toUpperCase() + type.slice(1);
};

const formattedTitle = formatTitle(title)
  

  return (
    <div className="container-fluid px-0 position-relative my-4">
      
      {/* Title (optional) */}
      {formattedTitle && (
  
    <h2 className={styles.title}>| {formattedTitle}</h2>
      
    )}

      {/* Arrows */}
      <button
        className={`${styles.arrow} ${styles.left}`}
        onClick={scrollLeft}
      >
        ‹
      </button>

      <button
        className={`${styles.arrow} ${styles.right}`}
        onClick={scrollRight}
      >
        ›
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className={`d-flex gap-3 ${styles.scrollContainer}`}
      >
        {products.map((product) => (
          <div key={product.id} className={styles.cardWrapper}>
            <ProductCard product={product} addToCart={addToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductScrollSection;