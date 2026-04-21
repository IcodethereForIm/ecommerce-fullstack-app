import React, { useState, useEffect} from "react";
import axios from "axios";
import { buildUrl } from "../../config/api";
const api = (path) => buildUrl(`/api${path}`);
import FetchCollection from "./FetchCollection";
import SlugSectionsPreview from "./SiteAssetShow";

const componentTypes = [
  "hero",
  "two-column",
  "promo-banner",
  "products"
];

const AdminCollectionForm = ({ existingCollection }) => {
  const [slug, setSlug] = useState(existingCollection?.slug || "");
  const [title, setTitle] = useState(existingCollection?.title || "");
  const [layout, setLayout] = useState(existingCollection?.layout || "default");
  const [showBanner, setShowBanner] = useState(existingCollection?.show_banner ?? true);
  const [showProducts, setShowProducts] = useState(existingCollection?.show_products ?? true);
  const [isActive, setIsActive] = useState(existingCollection?.is_active ?? true);

  const [components, setComponents] = useState(existingCollection?.components || []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (slug.length > 2) {
        const data = await FetchCollection(slug);

        if (data) {
          setTitle(data.title || "");
          setLayout(data.layout || "default");
          setShowBanner(data.show_banner ?? true);
          setShowProducts(data.show_products ?? true);
          setIsActive(data.is_active ?? true);
          setComponents(data.components || []);
        } else {
          setTitle("");
          setLayout("default");
          setShowBanner(true);
          setShowProducts(true);
          setIsActive(true);
          setComponents([]);
        }
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [slug]);

  // Add new component
  const addComponent = () => {
    setComponents([...components, { type: "hero", data: {} }]);
  };

  // Update component type
  const updateComponentType = (index, type) => {
    const copy = [...components];
    copy[index].type = type;
    copy[index].data = {}; // reset data when type changes
    setComponents(copy);
  };

  // Update component data
  const updateComponentData = (index, key, value) => {
    const copy = [...components];
    copy[index].data[key] = value;
    setComponents(copy);
  };

  // Remove a component
  const removeComponent = (index) => {
    const copy = [...components];
    copy.splice(index, 1);
    setComponents(copy);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    try {
      const payload = {
        slug,
        title,
        layout,
        show_banner: showBanner,
        show_products: showProducts,
        is_active: isActive,
        components
      };
      const res = await axios.post(api("/admin/collections/save"), payload,
        {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
      );
      alert("Collection saved!");
     
    } catch (err) {
      console.error(err);
      alert("Error saving collection");
    }
  };

  return (
    <div className="container py-4">
      <h2>Collection Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="mb-3">
          <label>Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="form-control" required />
        </div>

        <SlugSectionsPreview slug={slug} />
        <div className="mb-3">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Layout</label>
          <select value={layout} onChange={(e) => setLayout(e.target.value)} className="form-control">
            <option value="default">Default</option>
            <option value="two-column">Two Column</option>
            <option value="promo">Promo</option>
          </select>
        </div>
        <div className="form-check">
          <input type="checkbox" checked={showBanner} onChange={() => setShowBanner(!showBanner)} className="form-check-input" />
          <label className="form-check-label">Show Banner</label>
        </div>
        <div className="form-check">
          <input type="checkbox" checked={showProducts} onChange={() => setShowProducts(!showProducts)} className="form-check-input" />
          <label className="form-check-label">Show Products</label>
        </div>
        <div className="form-check">
          <input type="checkbox" checked={isActive} onChange={() => setIsActive(!isActive)} className="form-check-input" />
          <label className="form-check-label">Active</label>
        </div>

        <hr />
        <h4>Components</h4>
        {components.map((comp, index) => (
          <div key={index} className="border p-3 mb-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Component {index + 1}</strong>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeComponent(index)}>Remove</button>
            </div>
            <div className="mb-2">
              <label>Type</label>
              <select value={comp.type} onChange={(e) => updateComponentType(index, e.target.value)} className="form-control">
                {componentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Component-specific data inputs */}
            {comp.type === "hero" && (
  <>
    <div className="mb-2">
      <label>Banner Section</label>
      <select
        className="form-control"
        value={comp.data.item?.section || ""}
        onChange={(e) =>
          updateComponentData(index, "item", {
            ...comp.data.item,
            section: e.target.value,
          })
        }
      >
        <option value="">Select Banner</option>
        <option value="hero_banner">Hero Banner</option>
        <option value="category_banner">Category Banner</option>
        {/* add more if needed */}
      </select>
    </div>

    <div className="mb-2">
      <label>Asset Key</label>
      <select
        className="form-control"
        value={comp.data.item?.asset_key || ""}
        onChange={(e) =>
          updateComponentData(index, "item", {
            ...comp.data.item,
            asset_key: e.target.value,
          })
        }
      >
        <option value="">Select Asset Key</option>
        <option value="primary">Primary</option>
        <option value="secondary">Secondary</option>
      </select>
    </div>

    <div className="mb-2">
      <label>Redirect Slug</label>
      <input
        type="text"
        className="form-control"
        value={comp.data.item?.slug || ""}
        onChange={(e) =>
          updateComponentData(index, "item", {
            ...comp.data.item,
            slug: e.target.value,
          })
        }
        placeholder="e.g. /men, /women, /product/123"
      />
    </div>
  </>
)}

            {comp.type === "two-column" && (
              <>
          <div className="mb-2">
      <label>Left Section</label>
      <select
        className="form-control"
        value={comp.data.left?.section || ""}
        onChange={(e) =>
          updateComponentData(index, "left", {
            ...comp.data.left,
            section: e.target.value,
          })
        }
      >
        <option value="">Select Left Column Banner</option>
        <option value="home_left_column">Home Left Column</option>
        <option value="category_upper_banner">Category Upper</option>
      </select>
    </div>


    <div className="mb-2">
      <label>Left Asset Key</label>
      <select
    className="form-control"
    value={comp.data.left?.asset_key || ""}
    onChange={(e) =>
      updateComponentData(index, "left", {
        ...comp.data.left,
        asset_key: e.target.value,
      })
    }
  >
    <option value="">Select Asset Key</option>
    <option value="primary">Primary</option>
      <option value="secondary">Secondary</option>
    
  </select>
    </div>

    <div className="mb-2">
      <label>Left Slug</label>
      <input
        type="text"
        value={comp.data.left?.slug || ""}
        onChange={(e) =>
          updateComponentData(index, "left", {
            ...comp.data.left,
            slug: e.target.value,
          })
        }
        className="form-control"
        placeholder="left-slug,eg:men,men-upper"
      />
    </div>

    <div className="mb-2">
      <label>Right Section</label>
      <select
        className="form-control"
        value={comp.data.right?.section || ""}
        onChange={(e) =>
          updateComponentData(index, "right", {
            ...comp.data.right,
            section: e.target.value,
          })
        }
      >
        <option value="">Select Right Column Banner</option>
        <option value="home_right_column">Home Right Section</option>
        <option value="category_bottoms_banner">Category Bottoms</option>
      </select>
    </div>
    
    <div className="mb-2">
      <label>Right Asset Key</label>
      <select
    className="form-control"
    value={comp.data.right?.asset_key || ""}
    onChange={(e) =>
      updateComponentData(index, "right", {
        ...comp.data.right,
        asset_key: e.target.value,
      })
    }
  >
    <option value="">Select Asset Key</option>
    <option value="primary">Primary</option>
      <option value="secondary">Secondary</option>
    
  </select>
    </div>

    <div className="mb-2">
      <label>Right Slug</label>
      <input
        type="text"
        value={comp.data.right?.slug || ""}
        onChange={(e) =>
          updateComponentData(index, "right", {
            ...comp.data.right,
            slug: e.target.value,
          })
        }
        className="form-control"
        placeholder="right-slug,eg: women,women-bottom"
      />
    </div>
  </>
            )}

            {comp.type === "products" && (
  <>
    {/* 🔹 Gender */}
    <div className="mb-2">
      <label>Gender</label>
      <select
        className="form-control"
        value={comp.data.source?.gender || ""}
        onChange={(e) =>
          updateComponentData(index, "source", {
            gender: e.target.value || null,
            subcategory: null, // reset when gender changes
            type: comp.data.source?.type || null,
          })
        }
      >
        <option value="">All</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
      </select>
    </div>

    {/* 🔹 Product Type */}
    <div className="mb-2">
      <label>Product Type</label>
      <select
        className="form-control"
        value={comp.data.source?.type || ""}
        onChange={(e) =>
          updateComponentData(index, "source", {
            type: e.target.value || null,
            gender: comp.data.source?.gender || null,
            subcategory: comp.data.source?.subcategory || null,
          })
        }
      >
        <option value="">All</option>
        <option value="tshirt">T-Shirt</option>
        <option value="jeans">Jeans</option>
        <option value="trousers">Trousers</option>
      </select>
    </div>

    {/* 🔹 Subcategory (only if gender selected) */}
    {comp.data.source?.gender && (
      <div className="mb-2">
        <label>Subcategory</label>
        <select
          className="form-control"
          value={comp.data.source?.subcategory || ""}
          onChange={(e) =>
            updateComponentData(index, "source", {
              subcategory: e.target.value || null,
              gender: comp.data.source?.gender || null,
              type: comp.data.source?.type || null,
            })
          }
        >
          <option value="">All</option>

          {comp.data.source.gender === "men" && (
            <>
              <option value="men-upper">Men Upper</option>
              <option value="men-bottoms">Men Bottoms</option>
            </>
          )}

          {comp.data.source.gender === "women" && (
            <>
              <option value="women-upper">Women Upper</option>
              <option value="women-bottoms">Women Bottoms</option>
            </>
          )}
        </select>
      </div>
    )}
      <div className="mb-2">
      <label>Number of Products</label>
      <input
        type="number"
        className="form-control"
        placeholder="e.g. 5 or 10"
        value={comp.data.limit || ""}
        onChange={(e) =>
          updateComponentData(index, "limit", Number(e.target.value) || null)
        }
      />
    </div>
  </>
)}
          </div>
        ))}

        <button type="button" className="btn btn-secondary mb-3" onClick={addComponent}>Add Component</button>
        <br />
        <button type="submit" className="btn btn-primary">Save Collection</button>
      </form>
    </div>
  );
};

export default AdminCollectionForm;