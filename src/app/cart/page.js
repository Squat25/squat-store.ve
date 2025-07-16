"use client";

import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa"; // Asegúrate de haber instalado react-icons
import { useToast } from "../../components/Toast";
import Container from "../../components/Container";
import Breadcrumb from "../../components/Breadcrumb";
import NewsletterSquat from "../../components/NewsletterSquat";

const CartPage = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity } =
    useContext(CartContext);
  const { success } = useToast();

  const handleRemove = (id, size, color) => {
    removeFromCart(id, size, color);
    success("Producto eliminado del carrito");
  };

  return (
    <>
      <Container sectionClass="bg-[#fafbfc] min-h-screen">
        <div className="max-w-6xl lg:max-w-7xl mx-auto py-4 px-2 sm:py-6 sm:px-4">
          <Breadcrumb
            items={[{ label: "Inicio", href: "/" }, { label: "Carrito" }]}
          />
          <h1 className="text-3xl lg:text-4xl font-black uppercase text-left mb-6 lg:mb-10 text-gray-900 tracking-tight">
            Tu Carrito
          </h1>
          {cart.length === 0 ? (
            <div className="text-center p-8 lg:p-10 bg-white rounded-xl shadow-xl mt-6 lg:mt-8">
              <p className="text-lg lg:text-xl text-gray-700 mb-4 lg:mb-6">
                Tu carrito está vacío. ¡Empieza a comprar!
              </p>
              <Link
                href="/"
                className="inline-block bg-black text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full text-base lg:text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                Ir de Compras
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Productos en el Carrito */}
              <div className="flex-grow bg-transparent p-0 md:p-0 rounded-2xl shadow-none border-none">
                <div className="flex flex-col gap-4 lg:gap-6">
                  {cart.map((item) => (
                    <div
                      key={item.id + item.size + item.color}
                      className="relative flex flex-row items-center justify-between bg-white px-4 py-4 lg:px-8 lg:py-6 rounded-[16px] lg:rounded-[20px] shadow-[0_2px_16px_0_rgba(0,0,0,0.04)] border border-[#E5E5E5] gap-4 lg:gap-8 transition-all duration-200"
                    >
                      {/* Botón papelera arriba a la derecha */}
                      <button
                        onClick={() =>
                          handleRemove(item.id, item.size, item.color)
                        }
                        className="absolute top-3 right-3 lg:top-4 lg:right-4 p-1.5 lg:p-2 rounded-full transition-colors duration-200 hover:bg-[#ffeaea]"
                        aria-label="Eliminar producto"
                      >
                        <img
                          src="/papelera.svg"
                          width={16}
                          height={16}
                          alt="Eliminar"
                          className="w-4 h-4 lg:w-5 lg:h-5"
                        />
                      </button>
                      {/* Imagen y datos */}
                      <div className="flex items-center gap-3 lg:gap-8 flex-1">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg lg:rounded-xl object-cover border border-gray-100 bg-white w-[60px] h-[60px] lg:w-[120px] lg:h-[120px] flex-shrink-0"
                        />
                        <div className="flex flex-col gap-1 lg:gap-2 min-w-0 flex-1">
                          <Link
                            href={`/products/${item.id}`}
                            className="font-bold text-base lg:text-xl text-[#111] hover:underline text-left transition-colors duration-200 line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <div className="text-[#888] text-xs lg:text-base">
                            Size:{" "}
                            <span className="text-[#111] font-medium">
                              {item.size}
                            </span>
                          </div>
                          <div className="text-[#888] text-xs lg:text-base flex items-center gap-1 lg:gap-2">
                            Color:
                            <span
                              className="inline-block w-3 h-3 lg:w-4 lg:h-4 rounded-full border"
                              style={{
                                background: item.color,
                                borderColor: "#E5E5E5",
                              }}
                              title={item.color}
                            ></span>
                          </div>
                          <p className="font-bold text-lg lg:text-2xl text-[#111] mt-1 lg:mt-2 text-left">
                            ${item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-1 lg:gap-2 bg-[#F5F5F5] rounded-full px-2 py-1.5 lg:px-4 lg:py-2 border border-[#E5E5E5] self-center transition-all duration-200">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full border border-[#E5E5E5] transition-colors duration-200 disabled:opacity-50"
                          aria-label="Disminuir cantidad"
                          disabled={item.quantity <= 1}
                        >
                          <img
                            src="/menos-.svg"
                            width={12}
                            height={12}
                            alt="-"
                            className="w-3 h-3 lg:w-5 lg:h-5"
                          />
                        </button>
                        <span className="w-6 lg:w-8 text-center text-sm lg:text-lg font-medium text-[#111]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full border border-[#E5E5E5] transition-colors duration-200"
                          aria-label="Aumentar cantidad"
                        >
                          <img
                            src="/mas+.svg"
                            width={12}
                            height={12}
                            alt="+"
                            className="w-3 h-3 lg:w-5 lg:h-5"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 lg:mt-8 flex justify-center lg:justify-end">
                  <Link
                    href="/collections"
                    className="bg-black text-white px-5 lg:px-6 py-2.5 lg:py-3 rounded-full text-sm lg:text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
                    aria-label="Continuar Comprando"
                  >
                    Seguir Comprando
                  </Link>
                </div>
              </div>

              {/* Resumen del Carrito */}
              <div className="w-full lg:w-[400px] bg-white p-6 lg:p-8 rounded-[20px] shadow-[0_2px_16px_0_rgba(0,0,0,0.04)] border border-[#E5E5E5] h-fit">
                <h2 className="text-[24px] lg:text-[28px] font-black text-[#111] mb-6 lg:mb-8">
                  Resumen del Carrito
                </h2>
                {cart.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#888] text-base lg:text-lg">
                        Subtotal:
                      </span>
                      <span className="text-[#111] text-base lg:text-lg font-semibold">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#888] text-base lg:text-lg">
                        Descuento:
                      </span>
                      <span className="text-green-600 text-base lg:text-lg font-semibold">
                        -${(cartTotal * 0.2).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#888] text-base lg:text-lg">
                        Envío:
                      </span>
                      <span className="text-[#111] text-base lg:text-lg font-semibold">
                        $15.00
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[18px] lg:text-[20px] font-black text-[#111]">
                        Total:
                      </span>
                      <span className="text-[18px] lg:text-[20px] font-black text-[#111]">
                        ${(cartTotal * 0.8 + 15).toFixed(2)}
                      </span>
                    </div>
                    <form
                      className="flex items-center w-full mb-2 relative"
                      autoComplete="off"
                    >
                      <div className="relative flex-1">
                        <img
                          src="/cupon.svg"
                          alt="Cupón"
                          className="w-5 h-5 lg:w-6 lg:h-6 absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                        <input
                          type="text"
                          placeholder="Agregar código promocional"
                          className="w-full h-10 lg:h-12 pl-10 lg:pl-12 pr-3 lg:pr-4 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full focus:outline-none text-[#111] placeholder-[#BDBDBD] font-medium text-[13px] lg:text-[15px]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-black text-white rounded-full px-4 lg:px-6 h-10 lg:h-12 ml-2 font-bold text-[13px] lg:text-[15px] flex items-center justify-center transition-colors duration-200 hover:bg-[#222]"
                      >
                        Aplicar
                      </button>
                    </form>
                    <div className="flex flex-col gap-3 lg:gap-4 mt-6 lg:mt-8">
                      <Link
                        href="/checkout"
                        className="w-full bg-black text-white py-3 lg:py-4 rounded-full text-base lg:text-lg font-bold hover:bg-gray-800 transition-colors duration-200 text-center"
                        aria-label="Proceder al Checkout"
                      >
                        Proceder al Checkout
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg mb-4">
                      Tu carrito está vacío
                    </p>
                    <Link
                      href="/collections"
                      className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
                    >
                      Comenzar a Comprar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <NewsletterSquat sectionClass="lg:pt-0 lg:pb-0" />
      </Container>
    </>
  );
};

export default CartPage;
