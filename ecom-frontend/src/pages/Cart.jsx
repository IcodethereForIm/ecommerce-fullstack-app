import React from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart(){
    const {cartItems,removeItem,incrsQnt,decrsQnt}=React.useContext(CartContext)
    const navigate = useNavigate()

    
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );


    return(
         <div className="container mt-4">
            <h2>Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={`${item.id}-${item.selectedSize}`} className="card mb-3 p-3 d-flex flex-row align-items-center">
                            <img src={item.image} alt={item.name} width="80" style={{ border: "1px solid red" }}/>

                            <div className="ms-3 flex-grow-1">
                                <h5>{item.name}</h5>
                                <p className="mb-1">Size: {item.selectedSize}</p>
                                <p>₹{item.price}</p>

                                <div>
                                    <button className="btn btn-sm btn-secondary me-2" onClick={() => decrsQnt(item.id,item.selectedSize)}>-</button>
                                    {item.quantity}
                                    <button className="btn btn-sm btn-secondary ms-2" onClick={() => incrsQnt(item.id,item.selectedSize)}>+</button>
                                </div>
                            </div>

                            <div>
                                <p>₹{item.price * item.quantity}</p>
                                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id,item.selectedSize)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <h4>Total: ₹{totalPrice}</h4>
                    <button className="btn btn-success" onClick={()=>navigate("/checkout")}>Checkout</button>
                </>
            )}
        </div>
    )
}
export default Cart