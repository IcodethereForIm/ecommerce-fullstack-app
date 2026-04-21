import React from "react"
import { Link } from "react-router-dom"
import { createProduct } from "../../services/ProductServices"
import CategoryDropdown from "./CategoryDropdown"
import FetchProducts from "./FetchProducts"
function ProductController(){
    const initialFormstate = { name: "", category: "", categoryId: "", price: "", sale_price: "",
                                sku: "", description: "", images: [], sizes: [],is_active: true, is_featured: false }

    const availableSizes = ["xs", "s", "m", "l", "xl", "xxl"]
    const [form, setForm] = React.useState(initialFormstate)

    const addProduct = async () => {
        const token = localStorage.getItem("auth_token");
        

        try {
            await createProduct(form,token)
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