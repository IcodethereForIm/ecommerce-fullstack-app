import React from "react"
import { Link } from "react-router-dom"
import CategoryDropdown from "./CategoryDropdown"
import FetchProducts from "./FetchProducts"
function ProductController(){
    const initialFormstate = { name: "", category: "", categoryId: "", price: "", sale_price: "",
                                sku: "", description: "", images: [], sizes: [],is_active: true, is_featured: false }

    const availableSizes = ["xs", "s", "m", "l", "xl", "xxl"]
    const [form, setForm] = React.useState(initialFormstate)

    const addProduct = async () => {
        const token = localStorage.getItem("auth_token");
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("product_type", form.product_type);
        formData.append("categoryId", form.categoryId);
        formData.append("price", form.price);
        formData.append("description", form.description);
        formData.append("sku", form.sku);
        formData.append("sale_price", form.sale_price);
        formData.append("is_active", form.is_active ? 1 : 0);
        formData.append("is_featured", form.is_featured ? 1 : 0);

        for (let i = 0; i < form.images.length; i++) {
            formData.append("images[]", form.images[i]);
        }

        form.sizes.forEach((item, index) => {
            formData.append(`sizes[${index}][size]`, item.size);
            formData.append(`sizes[${index}][stock]`, item.stock);
        });

        try {
            await fetch("http://127.0.0.1:8000/api/admin/product", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                credentials: "include",
                body: formData
            });

            setForm(initialFormstate);
        } catch (error) {
            console.log("Backend ERROR", error);
        }
    };

    return(
        <>
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
                    placeholder="SKU"
                    className="form-control mb-2"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="product_type"
                    className="form-control mb-2"
                    value={form.product_type}
                    onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                />

                <div className="mb-2">
                    <CategoryDropdown
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                />
                </div>

                <input
                    type="number"
                    placeholder="Price"
                    className="form-control mb-2"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <input
                type="number"
                placeholder="Sale Price"
                className="form-control mb-2"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
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

                <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <label>Active</label>
                </div>

<div className="form-check">
  <input
    type="checkbox"
    className="form-check-input"
    checked={form.is_featured}
    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
  />
  <label>Featured</label>
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
            <FetchProducts/>
            </>
    )
}
export default ProductController