import React, { createContext, useState, useEffect } from "react";
import BASE_URL from "../config/api";
import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getToken = () => localStorage.getItem("auth_token");

  const getFullImageURL = (product) => {
    const primaryImage =
      product.image ?? product.images?.[0]?.image_path ?? null;

    return primaryImage
      ? `${BASE_URL}/storage/${primaryImage}`
      : null;
  };

  //  include size here
  const normalizeCartItem = (backendItem) => {
    const product = backendItem.product;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: backendItem.quantity,
      selectedSize: backendItem.size, // 🔥 IMPORTANT
      image: getFullImageURL(product),
    };
  };

  // --------------------------
  // Load Cart
  // --------------------------
  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();

      // Guest
      if (!token) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(localCart);
        return;
      }

      // Logged-in
      try {
        const guestCart =
          JSON.parse(localStorage.getItem("cart")) || [];
        let data;

        if (guestCart.length > 0) {
          const res = await fetch(
            api("/cart/merge"),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ items: guestCart }),
            }
          );

          data = await res.json();
          localStorage.removeItem("cart");
        } else {
          const res = await fetch(
            api("/cart"),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          data = await res.json();
        }

        setCartItems(data.map(normalizeCartItem));
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, []);

  // --------------------------
  // Add to Cart
  // --------------------------
  const addToCart = async (product) => {
    const token = getToken();

    // Guest
    if (!token) {
      const localCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const exists = localCart.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize
      );

      if (exists) {
        exists.quantity += product.quantity || 1;
      } else {
        localCart.push({
          ...product,
          selectedSize: product.selectedSize,
          quantity: product.quantity || 1,
          image: getFullImageURL(product),
        });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      setCartItems(localCart);
      return;
    }

    // Logged-in
    try {
      const res = await fetch(
        api("/cart/add"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: product.quantity || 1,
            size: product.selectedSize,
          }),
        }
      );

      const data = await res.json();
      setCartItems(data.map(normalizeCartItem));
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // --------------------------
  // Remove Item
  // --------------------------
  const removeItem = async (id, size) => {
    const token = getToken();

    // Guest
    if (!token) {
      const updated = cartItems.filter(
        (item) =>
          !(item.id === id && item.selectedSize === size)
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      setCartItems(updated);
      return;
    }

    // Logged-in
    try {
      await fetch(
        api(`/cart/remove/${id}/${size}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(item.id === id && item.selectedSize === size)
        )
      );
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // --------------------------
  // Increase Quantity
  // --------------------------
  const incrsQnt = async (id, size) => {
    const token = getToken();

    // Guest
    if (!token) {
      const updated = cartItems.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      setCartItems(updated);
      return;
    }

    // Logged-in
    try {
      const item = cartItems.find(
        (i) => i.id === id && i.selectedSize === size
      );

      const res = await fetch(
        api(`/cart/update/${id}/${size}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: item.quantity + 1,
            size: size,
          }),
        }
      );

      const data = await res.json();
      setCartItems(data.map(normalizeCartItem));
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // --------------------------
  // Decrease Quantity
  // --------------------------
  const decrsQnt = async (id, size) => {
    const token = getToken();

    // Guest
    if (!token) {
      const updated = cartItems.map((item) =>
        item.id === id &&
        item.selectedSize === size &&
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      setCartItems(updated);
      return;
    }

    // Logged-in
    try {
      const item = cartItems.find(
        (i) => i.id === id && i.selectedSize === size
      );

      const res = await fetch(
        api(`/cart/update/${id}/${size}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: item.quantity - 1,
            size: size,
          }),
        }
      );

      const data = await res.json();
      setCartItems(data.map(normalizeCartItem));
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart"); // ✅ important
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        incrsQnt,
        decrsQnt,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};