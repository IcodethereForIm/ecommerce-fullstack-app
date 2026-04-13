import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Card.module.css";

const ProductCard = ({ product, addToCart }) => {
  const  navigate = useNavigate();
  const [fullProduct, setFullProduct] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getImageUrls = (img) => {
  return img?.image_path
  ? `http://127.0.0.1:8000/storage/${img.image_path}`
  : "/placeholder.jpg";
  };

  const getPrimaryImage = (product) => {
    //const primary = product.images?.find(img => img.is_primary) || product.images?.[0];
    //return primary ? `http://127.0.0.1:8000/storage/${primary.image_path}` : "https://via.placeholder.com/300";
    return product.thumbnail
    ? `http://127.0.0.1:8000/storage/${product.thumbnail}`
    : "https://via.placeholder.com/300";
  };
  
  const handleOpenDrawer = async (e) => {
    e.preventDefault();
    setDrawerOpen(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${product.id}`);
      const data = await res.json();
      setFullProduct(data);
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <div className={styles.productCardWrapper}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className={styles.productCard}>
            <div className={styles.cardImage}>
              <img src={getPrimaryImage(product)} alt={product.name} />
              <button className={styles.addToCartBtn} onClick={handleOpenDrawer}>
                Add to Cart
              </button>
            </div>
            <div className={styles.cardInfo}>
              <h5>{product.name}</h5>
              <p>₹{product.price}</p>
            </div>
          </div>
        </Link>
      </div>

      {drawerOpen && (
        <>
        
        
          <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />
          <div className={styles.sidePanel} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setDrawerOpen(false)}>✕</button>
            
            <div className={styles.leftPanel}>
        {product?.images?.map((img, i) => (
          <img
            key={i}
            src={getImageUrls(img)}
            className={styles.drawerImage}
            alt="product"
          />
        ))}
      </div>
            <div className={styles.rightPanel}>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

            <div>
                  <h6>Select Size:</h6>
                  {(fullProduct?.sizes || []).map((sizeItem) => (
                    <button
                      key={sizeItem.id}
                      onClick={() => setSelectedSize(sizeItem.size)}
                      className={`${styles.sizeBtn} ${
                      selectedSize === sizeItem.size ?  styles.sizeBtnActive : ""
                            }`}
                    >
                      {sizeItem.size}
                    </button>
                  ))}
                </div>

        <div className={styles.quantityBox}>
          <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>
        <button className="btn btn-dark w-100 mt-3" onClick={() => {if (!selectedSize) return alert("Select size");
               addToCart({...product,selectedSize, quantity});  setDrawerOpen(false); navigate("/checkout"); }}>
              <FaShoppingCart className="me-2" /> Add to Cart & Buy Now
            </button>
        </div>
            
          </div>
        </>
      )}
    </>
  );
};

export default ProductCard;