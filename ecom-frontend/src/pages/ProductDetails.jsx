import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

function ProductDetails() {
  const navigate = useNavigate();
  const { addToCart } = React.useContext(CartContext);

  const { id } = useParams();

  const [product, setProduct] = React.useState(null);
  const [releated, setReleated] = React.useState([]);
  const [mainImage, setMainImage] = React.useState(null);

  // NEW STATES
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [openSection, setOpenSection] = React.useState(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        const data = await res.json();

        setProduct(data);
        setMainImage(data?.images?.[0]?.image_path || null);

        const relateRes = await fetch(
          "http://127.0.0.1:8000/api/products"
        );
        const releateData = await relateRes.json();

        setReleated(releateData.filter((p) => p.id !== parseInt(id)));
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);
  

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          {/* LEFT: IMAGES */}
          <div className="col-md-6">
            {mainImage ? (
              <img
                src={`http://127.0.0.1:8000/storage/${mainImage}`}
                className="img-fluid mb-2 main-img"
                alt={product?.name}
              />
            ) : (
              <img
                src="/placeholder.jpg"
                className="img-fluid mb-2 main-img"
                alt="No image"
              />
            )}

            <div className="d-flex">
              {product?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                  className="img-thumbnail me-2"
                  style={{ width: "80px", cursor: "pointer" }}
                  onClick={() => setMainImage(img.image_path)}
                  alt="thumb"
                />
              ))}
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div className="col-md-6">
            <h2>{product?.name || "Loading..."}</h2>
            <p className="text-muted">₹{product?.price || "-"}</p>

            {/*  SIZE */}
            <div className="mt-3">
              <h6>Select Size:</h6>
              <div className="d-flex gap-2">
                {(product?.sizes || []).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedSize(product.size)}
                    className={`btn ${selectedSize === product.size
                        ? "btn-dark"
                        : "btn-outline-dark"
                      }`}
                  >
                    {product.size}
                  </button>
                ))}
              </div>
            </div>

            {/*  QUANTITY */}
            <div className="mt-3 d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-dark"
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                className="btn btn-outline-dark"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            {/* ADD TO CART */}
            <button
              className="btn btn-primary mt-3"
              disabled={!selectedSize}
              onClick={() => {
                addToCart({
                  ...product,
                  selectedSize,
                  quantity,
                });
              }}
            >
              Add to Cart
            </button>

            {/* DESCRIPTION */}
            <div className="mt-4">
              <h5>Description</h5>
              <p>
                {product?.description || "No description available"}
              </p>
            </div>

            {/* ACCORDION */}
            <div className="mt-4">
              {/* SHIPPING */}
              <div className="border p-2 mb-2">
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setOpenSection(
                      openSection === "shipping" ? null : "shipping"
                    )
                  }
                >
                  <strong>+ Shipping Policy</strong>
                </div>

                {openSection === "shipping" && (
                  <p className="mt-2">
                    Delivery in 5-7 days. Cash on delivery available.
                  </p>
                )}
              </div>

              {/* RETURN */}
              <div className="border p-2 mb-2">
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setOpenSection(
                      openSection === "return" ? null : "return"
                    )
                  }
                >
                  <strong>+ Return & Exchange</strong>
                </div>

                {openSection === "return" && (
                  <p className="mt-2">
                    7-day return and exchange policy available.
                  </p>
                )}
              </div>

              {/* DETAILS */}
              <div className="border p-2">
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setOpenSection(
                      openSection === "info" ? null : "info"
                    )
                  }
                >
                  <strong>+ Product Details</strong>
                </div>

                {openSection === "info" && (
                  <p className="mt-2">
                    100% cotton, breathable fabric, perfect for daily wear.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <h4 className="mt-5">More Products</h4>
        <div className="row">
  {releated?.map((p) => (
    <div className="col-md-3 mb-4" key={p.id}>
      <ProductCard product={p} addToCart={addToCart} />
    </div>
  ))}
</div>
      </div>
    </>
  );
}

export default ProductDetails;