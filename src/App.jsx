import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("irui_store_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("irui_store_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity, deliveryOptionId: "1" }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateDeliveryOption = (productId, optionId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, deliveryOptionId: optionId } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);
  const totalCartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <Header
        cartCount={totalCartQuantity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Routes>
        <Route
          path="/"
          element={<Home addToCart={addToCart} searchQuery={searchQuery} />}
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              removeFromCart={removeFromCart}
              updateDeliveryOption={updateDeliveryOption}
              clearCart={clearCart}
            />
          }
        />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}
