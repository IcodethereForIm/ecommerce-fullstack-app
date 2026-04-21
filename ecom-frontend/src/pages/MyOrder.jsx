import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { FaShoppingCart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  //const {id} = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(api("/user-orders-fku"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (!orders.length) return <p>You have no orders yet!</p>;

  return (
    <div className="container mt-5">
  <h2 className="mb-4 fw-bold">My Orders</h2>

  {orders.map((order) => {
    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return (
      <div
        key={order.id}
        className="card mb-4 border-0 shadow-sm rounded-4"
      >
        <div className="card-body p-4">

          {/* Top Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-semibold mb-1">Order #{order.id}</h5>
              <small className="text-muted">Placed recently</small>
            </div>

            <span
              className={`badge px-3 py-2 rounded-pill ${
                order.status === "delivered"
                  ? "bg-success"
                  : order.status === "pending"
                  ? "bg-warning text-dark"
                  : "bg-secondary"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Total */}
          <p className="fw-semibold mb-3">
            Total: <span className="text-primary">₹{total}</span>
          </p>

          {/* Divider */}
          <hr />

          {/* Items Section */}
          <h6 className="mb-3 fw-semibold">Items</h6>
          <div className="row">
            {order.items.map((item) => (
              <div key={item.id} className="col-md-3 mb-3">
                <ProductCard product={item.product} addToCart={() => {}} />
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="text-end">
            <button
              className="btn btn-dark rounded-pill px-4"
              onClick={() => navigate(`/success/${order.id}`)}
            >
              View Details →
            </button>
          </div>

        </div>
      </div>
    );
  })}
</div>
  );
  }

export default MyOrdersPage;