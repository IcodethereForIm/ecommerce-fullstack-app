import React, { useState } from "react";
import axios from "axios";
import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

function ImageLibrary() {
  const [image, setImage] = useState(null);
  const [altText, setAltText] = useState("");

  const handleUpload = async () => {
    const token = localStorage.getItem("auth_token");
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("alt_text", altText);
    
    try {
      const res = await axios.post(api("/admin/images"), formData, {
        headers: {
          "Content-Type": "multipart/form-data","Authorization": `Bearer ${token}`,
        },
      });

      alert("Image uploaded ✅");
      setImage(null);
      setAltText("");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  return (
    <div className="card p-3">
      <h4>Upload Image</h4>

      <input
        type="file"
        className="form-control mb-2"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <input
        type="text"
        placeholder="Alt text (optional)"
        className="form-control mb-2"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default ImageLibrary;