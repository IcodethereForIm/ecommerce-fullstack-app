import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import ShippingAddress from "../components/ShippingAdresses";



function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Function to dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fetch authenticated user info
  const fetchUser = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/info", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch user info");
    return await res.json();
  };

  // Handle Checkout & Payment
  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        alert("Cart is empty!");
        return;
      }

      const user = await fetchUser();

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Check your internet connection.");
        return;
      }

      // Create order on backend
      const res = await fetch("http://127.0.0.1:8000/api/create-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
     

      // Razorpay options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "My Shop",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        prefill: {
          name: user.name,
          email: user.email
          
        },
        handler: async (response) => {
          

          // Verify payment on backend
          const verifyRes = await fetch(
            "http://127.0.0.1:8000/api/verify-payment",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            }
          );

          if (!verifyRes.ok) throw new Error("Payment verification failed");

          clearCart(); // clear cart after successful payment
          alert("Payment Successful!");
          const verifiedData = await verifyRes.json();
          navigate(`/success/${verifiedData.order.id}`);
        },
        theme: { color: "#3399cc" },
      };

      

      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>

      {cartItems.map((item) => (
        <div key={item.id}>
          <p>
            {item.name} × {item.quantity} = ₹{item.price * item.quantity}
          </p>
        </div>
      ))}

      <h4>Total: ₹{total}</h4>

      <div>
        <ShippingAddress/>
      </div>

      <button className="btn btn-primary" onClick={handleCheckout}>
        Place Order
      </button>
    </div>
  );
}

export default Checkout;