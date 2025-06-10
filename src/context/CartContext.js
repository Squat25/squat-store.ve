"use client";
import React, { createContext, useState, useEffect, useMemo } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Añadir producto al carrito y abrir el drawer
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Buscar si ya existe un ítem con la misma combinación de id, talla y color
      const existing = prevCart.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );
      if (existing) {
        // Sumar cantidad si ya existe
        return prevCart.map((item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Crear nuevo ítem
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.size,
            color: product.color,
            quantity: 1,
          },
        ];
      }
    });
    setDrawerOpen(true); // Abrir drawer automáticamente
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  // Calcular total del carrito
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
