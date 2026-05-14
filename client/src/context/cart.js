import { useState, useContext, createContext, useEffect } from "react";
import { normalizeCartLines } from "../utils/cartStock";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const existingCartItem = localStorage.getItem("cart");
    if (!existingCartItem) return;
    try {
      const parsed = JSON.parse(existingCartItem);
      const normalized = normalizeCartLines(parsed);
      setCart(normalized);
      localStorage.setItem("cart", JSON.stringify(normalized));
    } catch {
      setCart([]);
    }
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider }