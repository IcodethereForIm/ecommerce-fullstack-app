import { useEffect } from "react";
import { useWishlist } from "../context/WishListContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/api";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/profile"); // redirect if not logged in
    }
  }, [token]);
  

  if (!wishlist.length) {
    return (
      <div className="text-center mt-10">
        <h2>Your wishlist is empty 💔</h2>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2>My Wishlist ❤️</h2>

      <div className="grid">
        {wishlist.map((item) => (
          <div key={item.id} className="card">
            
            <img
            src={item.thumbnail? `${BASE_URL}/storage/${item.thumbnail}`: "/placeholder.jpg"}
            width="80" style={{ border: "1px solid red" }}
            alt={item.name}
            />

            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            <button onClick={() => removeFromWishlist(item.id)}>
              Remove ❌
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;