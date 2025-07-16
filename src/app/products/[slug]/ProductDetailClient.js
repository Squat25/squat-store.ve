"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { useToast } from "../../../components/Toast";
import ProductosRelacionados from "../../../components/ProductosRelacionados";
import NewsletterSquat from "../../../components/NewsletterSquat";
import Breadcrumb from "../../../components/Breadcrumb";
import Container from "../../../components/Container";
import Link from "next/link";

// Simulación de colores, tallas y reviews
const COLORS = [
  { name: "Olive", code: "#58593A" },
  { name: "Navy", code: "#22313F" },
  { name: "Green", code: "#2E4D3B" },
];
const SIZES = ["Small", "Medium", "Large", "X-Large"];
const REVIEWS = [
  {
    name: "Samantha D.",
    rating: 5,
    date: "August 18, 2023",
    text: "La camiseta es de gran calidad y se ajusta muy bien. Volvería a comprar sin dudarlo.",
  },
  {
    name: "Alex M.",
    rating: 4,
    date: "September 2, 2023",
    text: "Buen material, aunque el color es un poco diferente al de la foto.",
  },
  {
    name: "Ethan R.",
    rating: 5,
    date: "October 10, 2023",
    text: "Excelente compra, llegó rápido y el empaque muy bonito.",
  },
];

function StarRating({ rating, className = "" }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-yellow-400 ${className}`}
        style={{ fontSize: "inherit" }}
      >
        ★
      </span>
    );
  }
  return <span className={className}>{stars}</span>;
}

export default function ProductDetailClient({ product }) {
  const { addToCart, isInCart, getCartItemQuantity } = useContext(CartContext);
  const { success, error } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(2); // Large por defecto
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("reviews");

  // Verificar si el producto ya está en el carrito
  const isProductInCart = isInCart(
    product.id,
    SIZES[selectedSize],
    COLORS[selectedColor].name
  );
  const cartQuantity = getCartItemQuantity(
    product.id,
    SIZES[selectedSize],
    COLORS[selectedColor].name
  );

  // Actualizar cantidad cuando cambie la selección del carrito
  useEffect(() => {
    if (isProductInCart && cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [isProductInCart, cartQuantity]);

  // Simulación de descuento
  const originalPrice = product.price * 1.5;
  const discount = Math.round(100 - (product.price / originalPrice) * 100);

  // Galería de imágenes (simular varias si solo hay una)
  const images = product.images?.url
    ? [
        product.images,
        { ...product.images, url: product.images.url },
        { ...product.images, url: product.images.url },
      ]
    : product.images
    ? [product.images]
    : [
        {
          url: "/slide1.png", // Imagen de placeholder
          alt: product.name || "Product image",
        },
        {
          url: "/slide2.png",
          alt: product.name || "Product image",
        },
        {
          url: "/slide3.png",
          alt: product.name || "Product image",
        },
      ];

  // Breadcrumb items
  const categoria = product.categories?.[0]?.name || "";
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/collections" },
    { label: categoria, href: `/collections/${categoria.toLowerCase()}` },
    { label: product.name, isCurrent: true },
  ];

  const handleAddToCart = () => {
    if (
      !product.id ||
      !SIZES[selectedSize] ||
      !COLORS[selectedColor] ||
      !product.name ||
      !product.price
    ) {
      error("Faltan datos del producto. No se puede añadir al carrito.");
      return;
    }

    const success = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[selectedImage]?.url || "",
      color: COLORS[selectedColor].name,
      size: SIZES[selectedSize],
      quantity: quantity, // Usar la cantidad seleccionada
    });

    if (success) {
      success("Producto añadido al carrito");
    } else {
      error("Error al agregar el producto al carrito");
    }
  };

  return (
    <Container sectionClass="bg-white lg:px-[90px] px-[16px]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-[40px] w-full justify-center lg:justify-start max-w-7xl overflow-hidden">
        {/* Galería de imágenes */}
        <div className="flex flex-col lg:flex-row items-start gap-[14px] w-full lg:w-[50%]">
          {/* Miniaturas a la izquierda */}
          <div className="hidden lg:flex flex-col gap-[14px] w-[152px]">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <button
                  key={idx}
                  className={`w-[152px] h-[167px] rounded-[20px] overflow-hidden transition-all duration-200 shadow-md focus:outline-none bg-[#F0EEED] ${
                    selectedImage === idx
                      ? "border border-black"
                      : "border border-transparent"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`Ver imagen ${idx + 1}`}
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name || "Imagen de producto"}
                    width={152}
                    height={167}
                    className="object-cover w-[152px] h-[167px] rounded-[20px]"
                  />
                </button>
              ))
            ) : (
              <div className="w-[152px] h-[167px] rounded-[20px] bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          {/* Imagen principal */}
          <div className="w-full lg:w-[444px] flex items-start justify-center mb-4 md:mb-4 lg:mb-0">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage].url}
                alt={
                  images[selectedImage].alt ||
                  product.name ||
                  "Imagen de producto"
                }
                width={444}
                height={530}
                className="rounded-2xl shadow-lg object-cover w-full h-[400px] md:h-[500px] lg:w-[444px] lg:h-[530px] max-w-[444px] md:max-w-[600px] lg:max-w-[444px] bg-white"
                priority
              />
            ) : (
              <div className="w-full h-[400px] md:h-[500px] lg:h-[530px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-2xl">
                No Image Available
              </div>
            )}
          </div>
          {/* Miniaturas abajo en mobile/tablet */}
          <div className="flex lg:hidden flex-row gap-4 w-full justify-center">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <button
                  key={idx}
                  className={`w-[111px] h-[106px] md:w-[152px] md:h-[167px] rounded-[20px] overflow-hidden transition-all duration-200 shadow-md focus:outline-none active:outline-none bg-[#F0EEED] ${
                    selectedImage === idx
                      ? "border border-black"
                      : "border border-transparent"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`Ver imagen ${idx + 1}`}
                  style={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name || "Imagen de producto"}
                    width={152}
                    height={167}
                    className="object-cover w-full h-full rounded-[20px]"
                  />
                </button>
              ))
            ) : (
              <div className="w-[152px] h-[167px] rounded-[20px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Detalles del producto */}
        <div className="flex-1 flex flex-col justify-start mt-0 md:mt-0 min-w-0 w-full lg:w-[50%] max-w-full lg:min-h-[530px]">
          <h1 className="font-display text-5xl md:text-5xl lg:text-[40px] font-black mb-[14px] text-gray-900 tracking-tight leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-[20px]">
            <StarRating
              rating={4.5}
              className="text-2xl md:text-2xl lg:text-3xl"
            />
            <span className="text-gray-600 text-lg md:text-base lg:text-lg">
              4.5/5
            </span>
            <span className="ml-2 text-gray-400 text-base md:text-sm lg:text-base">
              (451 reviews)
            </span>
          </div>
          <div className="flex items-center gap-4 mb-[20px] flex-wrap">
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-4xl lg:text-[40px] font-black text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl line-through text-gray-400">
                ${originalPrice.toFixed(2)}
              </span>
            </div>
            <span className="bg-red-100 text-red-600 text-lg font-semibold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          </div>
          <p className="text-gray-600 mb-[48px] text-lg md:text-xl leading-relaxed">
            95% poliéster + 5% elastano.
          </p>

          {/* Separador */}
          <hr className="my-0 border-gray-200" />

          {/* Colores */}
          <div className="mb-[48px]">
            <div className="text-gray-700 text-xl font-semibold mb-2">
              Select Colors
            </div>
            <div className="flex gap-4">
              {COLORS.map((color, idx) => (
                <button
                  key={color.name}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center focus:outline-none transition-all duration-150 shadow-sm ${
                    selectedColor === idx
                      ? "border-black ring-2 ring-black scale-110"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => setSelectedColor(idx)}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Tallas */}
          <div className="mb-[27px]">
            <div className="text-gray-700 text-xl font-semibold mb-2">
              Choose Size
            </div>
            <div className="flex gap-3 flex-wrap">
              {SIZES.map((size, idx) => (
                <button
                  key={size}
                  className={`px-5 py-2 rounded-full border-2 text-base font-semibold focus:outline-none transition-all duration-150 shadow-sm ${
                    selectedSize === idx
                      ? "bg-black text-white border-black scale-105"
                      : "bg-white text-gray-800 border-gray-300 hover:border-black"
                  }`}
                  onClick={() => setSelectedSize(idx)}
                  aria-label={size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Cantidad y botón */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden shadow-sm bg-white">
              <button
                className="px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="px-5 py-2 text-lg font-semibold">
                {quantity}
              </span>
              <button
                className="px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              className="flex-1 bg-black text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-gray-800 transition-colors duration-200 shadow-md"
              onClick={handleAddToCart}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mt-10 bg-white rounded-2xl shadow p-6">
        <div className="flex gap-8 border-b mb-6">
          <button
            className={`pb-2 text-lg font-semibold border-b-2 transition-all ${
              tab === "details"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setTab("details")}
          >
            Product Details
          </button>
          <button
            className={`pb-2 text-lg font-semibold border-b-2 transition-all ${
              tab === "reviews"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setTab("reviews")}
          >
            Rating & Reviews
          </button>
          <button
            className={`pb-2 text-lg font-semibold border-b-2 transition-all ${
              tab === "faqs"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setTab("faqs")}
          >
            FAQs
          </button>
        </div>
        {/* Contenido de los tabs */}
        {tab === "details" && (
          <div>
            <h3 className="text-xl font-bold mb-2">Product Details</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}
        {tab === "reviews" && (
          <div>
            <h3 className="text-xl font-bold mb-4">
              All Reviews ({REVIEWS.length})
            </h3>
            <div className="space-y-6">
              {REVIEWS.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={review.rating} />
                    <span className="text-gray-800 font-semibold text-sm">
                      {review.name}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-gray-700 text-base">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "faqs" && (
          <div>
            <h3 className="text-xl font-bold mb-2">FAQs</h3>
            <p className="text-gray-700">
              ¿Tienes preguntas? Contáctanos para más información.
            </p>
          </div>
        )}
      </div>

      {/* Productos Relacionados */}
      <ProductosRelacionados
        categoria={product.categories?.[0]?.name}
        actualSlug={product.slug}
      />

      {/* Newsletter Squat */}
      <NewsletterSquat />
    </Container>
  );
}
