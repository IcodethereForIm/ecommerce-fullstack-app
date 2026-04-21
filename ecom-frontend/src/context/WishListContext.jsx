import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) =>{

    const [wishlist, setWishlist] = useState([]);
    const {token} = useAuth()

     const fetchWishlist = async () => {
        if (!token) return;
    try {
      const res = await axios.get(api("/wishlist"),
        {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
      );
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  if (token) {
    fetchWishlist();
  } else {
    setWishlist([]); // clear on logout
  }
}, [token]);

    const toggleWishlist = async (product) => {
        if (!token) return;
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      setWishlist((prev) => [...prev, product]);
    }

    try {
      await axios.post(api(`/wishlist/${product.id}`),
        {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
    } catch (err) {
      console.error(err);

      // rollback if failed
      fetchWishlist();
    }

};
    const removeFromWishlist = async (productId) => {
        if (!token) return;
  const prevWishlist = wishlist;

  // Optimistic update
  setWishlist(prev => prev.filter(item => item.id !== productId));

  try {
    await axios.delete(api(`/wishlist/${productId}`),
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error(err);

    // rollback properly (not refetch)
    setWishlist(prevWishlist);
  }
};

   const isWishlisted = (id) => {
  return wishlist.some(item => item.id === id);
}; 

    return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );

}

export const useWishlist = () => useContext(WishlistContext);
