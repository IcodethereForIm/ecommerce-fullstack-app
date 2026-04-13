import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Card.css";

const demoProductCard = ({ product, addToCart }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getPrimaryImage = (product) => {
    const primary = product.images?.find((img) => img.is_primary) || product.images?.[0];
    return primary ? `http://127.0.0.1:8000/storage/${primary.image_path}` : "https://via.placeholder.com/300";
  };

  return (
    <>
      <div className="product-card-wrapper">
        <Link
          to={`/product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="card product-card">
            {/* IMAGE SECTION */}
            <div className="card-image">
              <img src={getPrimaryImage(product)} alt={product.name} />
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.preventDefault(); // prevent link navigation
                  setDrawerOpen(true); // open drawer
                }}
              >
                Add to Cart
              </button>
            </div>

            {/* INFO SECTION */}
            <div className="card-info">
              <h5>{product.name}</h5>
              <p>₹{product.price}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Drawer Section */}
      {drawerOpen && (
        <>
          <div className="overlay" onClick={() => setDrawerOpen(false)}></div>

          <div className="side-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setDrawerOpen(false)}>✕</button>
            <img
              src={getPrimaryImage(product)}
              alt={product.name}
              style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
            />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

            <button
              className="btn btn-dark w-100 mt-3"
              onClick={() => {
                addToCart(product);
                setDrawerOpen(false);
              }}
            >
              <FaShoppingCart className="me-2" /> Add to Cart & Buy Now
            </button>
          </div>
        </>
      )}
    </>
  );
};

import React from "react"
import { Link } from "react-router-dom";
function Admin() {

    const initialFormstate = { name: "", category: "", price: "", description: "", images: [], sizes: [] }
    const availableSizes = ["xs", "s", "m", "l", "xl", "xxl"]
    const [form, setForm] = React.useState(initialFormstate)
    const [section, setSection] = React.useState("");
    const [key, setKey] = React.useState("");
    const [assetImages, setAssetImages] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [showGallery, setShowGallery] = React.useState(false);
    const [selectedImages, setSelectedImages] = React.useState([]);


    const addProduct = async () => {

        const formData = new FormData()
        formData.append("name", form.name)
        formData.append("category", form.category)
        formData.append("price", form.price)
        formData.append("description", form.description)
        //if(form.image)formData.append("image",form.image)
        for (let i = 0; i < form.images.length; i++) {
            formData.append("images[]", form.images[i])
        }

        form.sizes.forEach((item, index) => {
            formData.append(`sizes[${index}][size]`, item.size);
            formData.append(`sizes[${index}][stock]`, item.stock);
        })
        try {
            const res = await fetch("http://127.0.0.1:8000/api/product", {
                method: "POST",
                credentials: "include",

                body: formData
            })
            const data = await res.json()
            setForm(initialFormstate)
        } catch (error) {
            console.log("Backend ERROR", error)
        }
    }

    const uploadAsset = async () => {
    const formData = new FormData();

    formData.append("section", section);
    formData.append("key", key);

    selectedImages.forEach((img, index) => {
            formData.append(`image_ids[${index}]`, img.id);
        });

    try {
        const res = await fetch("http://127.0.0.1:8000/api/site-assets", {
            method: "POST",
            body: formData
        });

        setSection("");
            setKey("");
            setSelectedImages([]);

            alert("Banner set from library ✅");
    } catch (err) {
        console.error(err);
    }
};

    React.useEffect(() => {
    fetchImages();
}, []);

const fetchImages = async () => {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/images");
        const data = await res.json();
        setImages(data);
    } catch (err) {
        console.error(err);
    }
};
    return (
        
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>

            {/* Add Product Form */}
            <div className="card p-3 mb-4">
                <h4>Add Product</h4>

                <input
                    type="text"
                    placeholder="Product Name"
                    className="form-control mb-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}

                />

                <input
                    type="text"
                    placeholder="Category"
                    className="form-control mb-2"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Price"
                    className="form-control mb-2"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    className="form-control mb-2"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                {/*SIZE BUTTONS */}
                <div className="mb-3">
                    <h5>Sizes & Stock</h5>

                    {availableSizes.map((size) => {
                        // check if this size is selected
                        const selected = form.sizes.find(s => s.size === size);

                        return (
                            <div key={size} className="d-flex align-items-center gap-2 mb-2">

                                {/* SIZE BUTTON */}
                                <button
                                    type="button"
                                    className={`btn ${selected ? "btn-dark" : "btn-outline-dark"}`}
                                    onClick={() => {
                                        if (selected) {
                                            // remove size if clicked again
                                            setForm({
                                                ...form,
                                                sizes: form.sizes.filter(s => s.size !== size)
                                            });
                                        } else {
                                            // size with empty stock
                                            setForm({
                                                ...form,
                                                sizes: [...form.sizes, { size, stock: "" }]
                                            });
                                        }
                                    }}
                                >
                                    {size}
                                </button>

                                {/* STOCK INPUT, only visible if size is selected */}
                                {selected && (
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        className="form-control w-25"
                                        value={selected.stock}
                                        onChange={(e) => {
                                            const updated = form.sizes.map(s =>
                                                s.size === size ? { ...s, stock: e.target.value } : s
                                            );
                                            setForm({ ...form, sizes: updated });
                                        }}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>


                <input
                    type="file"
                    className="form-control mb-2"
                    multiple
                    onChange={(e) => setForm({ ...form, images: [...form.images, ...Array.from(e.target.files)] })}
                />
                {form.images.length > 0 && (
                    <ul className="mb-2">
                        {form.images.map((file, idx) => (
                            <li key={idx}>{file.name}</li>
                        ))}
                    </ul>
                )}

                <button className="btn btn-primary" onClick={addProduct}>Add Product</button>
            </div>

            {/* Product List */}
            <div className="card p-3">
                <h4>Products</h4>

                <div className="d-flex justify-content-between border-bottom py-2">
                    <span>Sample Product</span>
                    <button className="btn btn-danger btn-sm">Delete</button>
                </div>
            </div>

            {/* site asset */}
<div className="card p-3 mb-4">
    <h4>Upload Banner / Site Asset</h4>

    {/* Section */}
    <select
        className="form-control mb-2"
        value={section}
        onChange={(e) => setSection(e.target.value)}
    >
        <option value="">Select Section</option>
        <option value="hero_banner">Hero Banner</option>
        <option value="home_two_column">Home Men/Women</option>
        <option value="category_banner">Category Banner</option>
        <option value="category_upper_banner">Category Upper</option>
        <option value="category_bottoms_banner">Category Bottoms</option>
    </select>

    {/* Key */}
    <select
        className="form-control mb-2"
        value={key}
        onChange={(e) => setKey(e.target.value)}
    >
        <option value="">Select Type</option>
        <option value="home">Home</option>
        <option value="women">Women</option>
        <option value="men">Men</option>
    </select>

    {/* Images */}
    {/* 🔥 SELECT IMAGE BUTTON */}
                <button
                    className="btn btn-dark mb-2"
                    onClick={() => setShowGallery(true)}
                >
                    Select Images
                </button>

                {/* 🔥 SELECTED IMAGES */}
                {selectedImages.length > 0 && (
                    <div className="mb-2 d-flex gap-2 flex-wrap">
                        {selectedImages.map((img) => (
                            <img
                                key={img.id}
                                src={`http://127.0.0.1:8000/storage/${img.file_path}`}
                                alt=""
                                width="80"
                                style={{ border: "2px solid green" }}
                            />
                        ))}
                    </div>
                )}

                <button className="btn btn-success" onClick={uploadAsset}>
                    Save Asset
                </button>

                {/* 🔗 GO TO IMAGE LIBRARY */}
                <div className="mt-3">
                    <Link to="/admin/images">Go to Image Library</Link>
                </div>
            </div>


        {showGallery && (
                <div className="card p-3 mt-3">
                    <h5>Select Images</h5>

                    <div className="row">
                        {images.map((img) => (
                            <div className="col-md-3 mb-3" key={img.id}>
                                <img
                                    src={`http://127.0.0.1:8000/storage/${img.file_path}`}
                                    alt=""
                                    className="img-fluid"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        // prevent duplicates
                                        if (!selectedImages.find(i => i.id === img.id)) {
                                            setSelectedImages([...selectedImages, img]);
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-success mt-2"
                        onClick={() => setShowGallery(false)}
                    >
                        Done
                    </button>
                </div>
            )}

        </div>



                
        


                
                    

        
        

        

    );
};



export default Admin

const addProduct = async () => {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("category", form.category);
        formData.append("categoryId", form.categoryId);
        formData.append("price", form.price);
        formData.append("description", form.description);

        for (let i = 0; i < form.images.length; i++) {
            formData.append("images[]", form.images[i]);
        }

        form.sizes.forEach((item, index) => {
            formData.append(`sizes[${index}][size]`, item.size);
            formData.append(`sizes[${index}][stock]`, item.stock);
        });

        try {
            await fetch("http://127.0.0.1:8000/api/product", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            setForm(initialFormstate);
        } catch (error) {
            console.log("Backend ERROR", error);
        }
    };

    React.useEffect(() => {
        const fetchProducts = async () => {
          try {
            const res = await fetch(`http://127.0.0.1:8000/api/products/category/${slug}`);
            const data = await res.json();
            setProducts(data);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
      }, [slug]);
    
      console.log(collection)