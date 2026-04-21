import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImages,getAssets,uploadSiteAsset,deleteSiteAsset } from "../../services/SiteAssetService";
import { buildStorageUrl } from "../../config/api";

function SiteAset() {
  const [section, setSection] = useState("");
  const [key, setKey] = useState("");
  const [assetKey, setAssetKey] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [assets, setAssets] = useState({});

  // Fetch image library
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await getImages()
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch current assets for display
  const fetchAssets = async () => {
    if (!section || !key) return;
    try {
      
      const data = await getAssets(section,key)
      setAssets(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [section, key]);

  // Upload selected images
  const uploadAsset = async () => {
    const token = localStorage.getItem("auth_token");

    if (!section || !key || !assetKey || selectedImages.length === 0) {
      alert("Please select section, type, asset slot, and images");
      return;
    }

    try {
       await uploadSiteAsset({section,key,assetKey,selectedImages},token)
      alert("Assets uploaded successfully ✅");
      setSelectedImages([]);
      fetchAssets();
    } catch (err) {
      console.error(err);
      alert("Error uploading assets");
    }
  };

  //delete 
  const deleteAsset = async (id) => {
  const token = localStorage.getItem("auth_token");

  if (!window.confirm("Delete this asset?")) return;

  try {
    await deleteSiteAsset(id,token)
 
    //UI update 
    setAssets((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((a) => a.id !== id);
      });

      return updated;
    });

  } catch (err) {
    console.error(err);
    alert("Error deleting asset");
  }
};

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      {/* ---------------- SITE ASSET ---------------- */}
      <div className="card p-3 mb-4">
        <h4>Set Site Asset (From Library)</h4>

        {/* Section */}
        <select
          className="form-control mb-2"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="">Select Section</option>
          <option value="hero_banner">Hero Banner</option>
          <option value="home_left_column">Home Left Section</option>
          <option value="home_right_column">Home Right Section</option>
          <option value="category_banner">Category Banner</option>
          <option value="category_upper_banner">Category Upper</option>
          <option value="category_bottoms_banner">Category Bottoms</option>
          <option value="promo_banner">Promo Banner</option>
        </select>

        {/* Key / Type */}
        <select
          className="form-control mb-2"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="home">Home</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="men-upper">Men Upper</option>
          <option value="women-upper">Women Upper</option>
          <option value="men-bottoms">Men Bottoms</option>
          <option value="women-bottoms">Women Bottoms</option>
          <option value="men-collection">Men all collection</option>
          <option value="women-collection">Women all collection</option>
          <option value="t-shirt-collection">T-shirt all collection</option>
          <option value="t-shirt-men">T-shirt men collection</option>
          <option value="t-shirt-women">T-shirt women collection</option>
          <option value="shirt-collection">Shirt all collection</option>
          <option value="jeans-collection">Jeans all collection</option>
          <option value="jeans-women">Jeans women collection</option>
          <option value="top-collection">Top all collection</option>
        </select>

        {/* Asset Key */}
        <select
          className="form-control mb-2"
          value={assetKey}
          onChange={(e) => setAssetKey(e.target.value)}
        >
          <option value="">Select Asset Slot</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>

        {/* Select Images Button */}
        <button
          className="btn btn-dark mb-2"
          onClick={() => setShowGallery(true)}
        >
          Select Images
        </button>

        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <div className="mb-2 d-flex gap-2 flex-wrap">
            {selectedImages.map((img) => (
              <img
                key={img.id}
                src={buildStorageUrl(img.file_path)}
                alt=""
                width="80"
                style={{ border: "2px solid green" }}
              />
            ))}
          </div>
        )}

        {/* Save Asset Button */}
        <button
          className="btn btn-success"
          onClick={uploadAsset}
          disabled={!section || !key || !assetKey || selectedImages.length === 0}
        >
          Save Asset
        </button>

        {/* Display Current Assets */}
        {Object.keys(assets).length > 0 && (
          <div className="mt-3">
            <h5>Current Assets</h5>
            {Object.keys(assets).map((slot) => (
              <div key={slot} className="mt-3">
                <h6>{slot.toUpperCase()} Assets</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {assets[slot].map((asset) => (
                    <div key={asset.id} className="position-relative">
    
    <img
      src={buildStorageUrl(asset.image.file_path)}
      alt={asset.image.alt_text || ""}
      width="80"
      className="rounded border"
    />

    {/* DELETE BUTTON */}
    <button
      onClick={() => deleteAsset(asset.id)}
      className="btn btn-sm btn-danger position-absolute top-0 end-0"
      style={{ padding: "2px 6px", fontSize: "12px" }}
    >
      ✕
    </button>

  </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Go to Image Library */}
        <div className="mt-3">
          <Link to="/admin/images">Go to Image Library</Link>
        </div>
      </div>

      {/* ---------------- GALLERY MODAL ---------------- */}
      {showGallery && (
        <div className="card p-3 mt-3">
          <h5>Select Images</h5>
          <div className="row">
            {images.map((img) => (
              <div className="col-md-3 mb-3" key={img.id}>
                <img
                  src={buildStorageUrl(img.file_path)}
                  alt=""
                  className="img-fluid"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!selectedImages.find((i) => i.id === img.id)) {
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
}

export default SiteAset;