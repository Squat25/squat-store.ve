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
        try {
          setCart(JSON.parse(storedCart));
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error);
          localStorage.removeItem("cart");
        }
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Función helper para generar ID único de variante
  const getVariantId = (product) => {
    return `${product.id}-${product.size}-${product.color}`;
  };

  // Añadir producto al carrito y abrir el drawer
  const addToCart = (product) => {
    if (!product.id || !product.size || !product.color) {
      console.error("Producto incompleto:", product);
      return;
    }

    setCart((prevCart) => {
      const variantId = getVariantId(product);
      const existingIndex = prevCart.findIndex(
        (item) => getVariantId(item) === variantId
      );

      if (existingIndex >= 0) {
        // Actualizar cantidad si ya existe
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1,
        };
        return updatedCart;
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
    setDrawerOpen(true);
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId, size, color) => {
    const variantId = `${productId}-${size}-${color}`;
    setCart((prevCart) =>
      prevCart.filter((item) => getVariantId(item) !== variantId)
    );
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const variantId = `${productId}-${size}-${color}`;
    setCart((prevCart) =>
      prevCart.map((item) =>
        getVariantId(item) === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  // Calcular total del carrito
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  // Calcular cantidad total de items
  const cartItemsCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
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
        cartItemsCount,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
