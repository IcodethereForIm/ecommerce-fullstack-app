import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buildStorageUrl } from "../../config/api";
import { getProductById,updateProductById } from "../../services/ProductServices";
import CategoryDropdown from "./CategoryDropdown";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = React.useState({
        name: "",
        categoryId: "",
        product_type: "",
        price: "",
        sale_price: "",
        sku: "",
        description: "",
        images: [],
        sizes: [],
        is_active: true,
        is_featured: false
    });

    const [existingImages, setExistingImages] = React.useState([]);

    // Fetch product data
    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id) //api call

                setForm({
                    name: data.name || "",
                    categoryId: data.category_id || "",
                    product_type: data.product_type || "",
                    price: data.price || "",
                    sale_price: data.sale_price || "",
                    sku: data.sku || "",
                    description: data.description || "",
                    images: [],
                    sizes: data.sizes || [],
                    is_active: data.is_active == 1,
                    is_featured: data.is_featured == 1
                });

                setExistingImages(data.images || []);

            } catch (err) {
                console.log(err);
            }
        };

        fetchProduct();
    }, [id]);

    // Update product
    const updateProduct = async () => {
        const token = localStorage.getItem("auth_token");
        

        try {
            await updateProductById(id,form,token) //api call

            alert("Product updated!");
            navigate("/admin"); // redirect

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="card p-3">
            <h4>Edit Product</h4>
            <label>Name</label>
            <input
                type="text"
                className="form-control mb-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>SKU</label>
            <input
                type="text"
                className="form-control mb-2"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
            <label>Category</label>
            <CategoryDropdown
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            />
            <label>Product Type</label>
            <input
                type="text"
                className="form-control mb-2"
                value={form.product_type}
                onChange={(e) => setForm({ ...form, product_type: e.target.value })}
            />
            <label>Price</label>
            <input
                type="number"
                className="form-control mb-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <label>Sale Price</label>
            <input
                type="number"
                className="form-control mb-2"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
            />
            <label>Description</label>
            <textarea
                className="form-control mb-2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* Existing Images */}
            <div className="mb-3">
                <h6>Current Images</h6>
                <div className="d-flex gap-2">
                    {existingImages.map((img, i) => (
                        <img
                            key={i}
                            src={buildStorageUrl(img.image_path)}
                            width="80"
                            alt=""
                        />
                    ))}
                </div>
            </div>

            {/*Upload New Images */}
            <input
                type="file"
                className="form-control mb-2"
                multiple
                onChange={(e) =>
                    setForm({ ...form, images:[...form.images, ...Array.from(e.target.files)] })
                }
            />
            {form.images.length > 0 && (
    <ul>
        {form.images.map((file, i) => (
            <li key={i}>{file.name}</li>
        ))}
    </ul>
)}

            <button className="btn btn-success" onClick={updateProduct}>
                Update Product
            </button>
        </div>
    );
}

export default EditProduct;