import React from "react";
import { Link } from "react-router-dom";
import { getProducts,deleteProductById } from "../../services/ProductServices";
import { buildStorageUrl } from "../../config/api";

function FetchProducts() {
    const [products, setProducts] = React.useState([]);

    // fetch products
    const fetchProducts = async () => {
        try {
            const data = await getProducts()
            setProducts(data);
        } catch (err) {
            console.log("Error fetching products", err);
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    // delete product
    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        const token = localStorage.getItem("auth_token");

        try {
            await deleteProductById(id,token)
            // update UI
            setProducts(products.filter(p => p.id !== id));

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="card p-3">
            <h4>Products</h4>

            {products.length === 0 ? (
                <p>No products found</p>
            ) : (
                products.map((product) => {
                    

                    return(
                    
                    <div
                        key={product.id}
                        className="d-flex justify-content-between border-bottom py-2"
                    >
                        
                       <div className="d-flex align-items-center gap-3">
    
    <img
        src={buildStorageUrl(product.thumbnail)}
        alt={product.name}
        width="50"
        height="50"
        style={{ objectFit: "cover", borderRadius: "6px" }}
    />

    <div>
        <div>{product.name}</div>
        <small>₹{product.price}</small>
    </div>
</div>

                        <div className="d-flex gap-2">
                            <Link
                                to={`/admin/edit/${product.id}`}
                                className="btn btn-warning btn-sm"
                            >
                                Edit
                            </Link>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteProduct(product.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )})
            )}
        </div>
    );
}

export default FetchProducts;