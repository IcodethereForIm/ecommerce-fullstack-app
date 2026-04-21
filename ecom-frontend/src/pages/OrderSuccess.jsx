import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

function OrderSuccessPage() {
  const { orderId } = useParams(); // order ID from URL
  //const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(api(`/orders/${orderId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch order");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading your order...</p>;
  if (!order) return <p>Order not found!</p>;

  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="text-success">Payment Successful!</h2>
      <p>
        <strong>Order ID:</strong> {order.id}
      </p>
      <p>
        <strong>Total Paid:</strong> ₹{totalAmount}
      </p>

      <h4>Items:</h4>
      <ul className="list-group">
        {order.items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <div>
              {item.product.name} × {item.quantity}
            </div>
            <div>₹{item.price * item.quantity}</div>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        <Link to="/" className="btn btn-primary me-2">
          Continue Shopping
        </Link>
        <Link to="/orders" className="btn btn-secondary">
          Go to My Orders
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccessPage;