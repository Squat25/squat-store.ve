"use client";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemsCount,
    drawerOpen,
    setDrawerOpen,
    isInCart,
    getCartItemQuantity,
  } = context;

  // Función helper para agregar producto con validación
  const addProductToCart = (product) => {
    if (!product.id || !product.name || !product.price) {
      console.error("Producto inválido:", product);
      return false;
    }

    if (!product.size || !product.color) {
      console.error("Producto sin talla o color:", product);
      return false;
    }

    return addToCart(product);
  };

  // Función helper para verificar si un producto está en el carrito
  const checkProductInCart = (productId, size, color) => {
    return isInCart(productId, size, color);
  };

  // Función helper para obtener la cantidad de un producto
  const getProductQuantity = (productId, size, color) => {
    return getCartItemQuantity(productId, size, color);
  };

  // Función helper para actualizar cantidad con validación
  const updateProductQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return true;
    }

    if (newQuantity > 100) {
      console.warn("Cantidad máxima excedida");
      return false;
    }

    updateQuantity(productId, size, color, newQuantity);
    return true;
  };

  // Función helper para vaciar carrito con confirmación
  const clearCartWithConfirmation = () => {
    if (cart.length === 0) return;

    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      clearCart();
      return true;
    }
    return false;
  };

  return {
    // Estado
    cart,
    cartTotal,
    cartItemsCount,
    drawerOpen,

    // Acciones básicas
    addToCart: addProductToCart,
    removeFromCart,
    updateQuantity: updateProductQuantity,
    clearCart: clearCartWithConfirmation,
    setDrawerOpen,

    // Helpers
    isInCart: checkProductInCart,
    getCartItemQuantity: getProductQuantity,

    // Utilidades
    isEmpty: cart.length === 0,
    hasItems: cart.length > 0,
    totalItems: cartItemsCount,
  };
};
