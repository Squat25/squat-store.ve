"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { request } from "../lib/datocms";
import { getBestSellers } from "../lib/datocms";
import { useToast } from "./Toast";

const HOMEPAGE_QUERY = `
  query AllProducts {
    allProducts {
      id
      name
      slug
      price
      description
      images {
        url
        alt
        width
        height
      }
    }
  }
`;

export default function HomeClient() {
  const { data: session } = useSession();
  const { addToCart } = useContext(CartContext);
  const { success, warning } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState({}); // { [productId]: { size, color, error } }

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Trae todos los productos
        const data = await request({ query: HOMEPAGE_QUERY });
        // Trae los best sellers
        const bestSellers = await getBestSellers();
        // Saca los slugs de los best sellers
        const bestSellerSlugs = bestSellers.map((p) => p.slug);
        // Filtra los productos que NO están en best sellers
        const productosSinRepetidos = (data?.allProducts || []).filter(
          (p) => !bestSellerSlugs.includes(p.slug)
        );
        setProducts(productosSinRepetidos);
      } catch (err) {
        setError("Error cargando productos");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Depuración: mostrar los productos y sus imágenes
  console.log("PRODUCTS:", products);

  if (loading) {
    return (
      <section className="py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Nuestros Productos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center animate-pulse"
            >
              <div className="w-full h-60 bg-gray-200 rounded-md mb-4" />
              <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
              <div className="flex gap-2 mb-4 w-full justify-center">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="w-10 h-6 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="flex gap-2 mb-4 w-full justify-center">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="w-6 h-6 bg-gray-200 rounded-full" />
                ))}
              </div>
              <div className="h-8 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  return (
    <>
      {/* Hero Section */}
      {/* Eliminado: Hero antiguo con imagen y mensaje de bienvenida */}

      {/* Productos Destacados */}
      <section className="py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Nuestros Productos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => {
              const sizes = ["S", "M", "L", "XL"];
              const colors = [
                { name: "Negro", value: "#000" },
                { name: "Blanco", value: "#fff" },
                { name: "Azul", value: "#2563eb" },
                { name: "Rosa", value: "#e11d48" },
                { name: "Verde", value: "#22c55e" },
              ];
              const selectedSize = selection[product.id]?.size || "";
              const selectedColor = selection[product.id]?.color || "";
              const error = selection[product.id]?.error || "";
              const handleAdd = () => {
                if (!selectedSize || !selectedColor) {
                  setSelection((prev) => ({
                    ...prev,
                    [product.id]: {
                      ...prev[product.id],
                      error: "Selecciona talla y color",
                    },
                  }));
                  warning("Debes seleccionar talla y color");
                  return;
                }
                setSelection((prev) => ({
                  ...prev,
                  [product.id]: {
                    ...prev[product.id],
                    error: "",
                  },
                }));
                addToCart({
                  ...product,
                  image: product.images?.url || "",
                  size: selectedSize,
                  color: selectedColor,
                });
                success("Producto añadido al carrito");
              };
              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group"
                >
                  {product.images && product.images.url ? (
                    <Image
                      src={product.images.url}
                      alt={product.images.alt || product.name}
                      width={product.images.width || 300}
                      height={product.images.height || 300}
                      className="w-full h-auto rounded-md mb-4 object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-2xl mb-4">
                      No Image Available
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-lg font-bold mb-2">
                    ${product.price.toFixed(2)}
                  </p>
                  {/* Selector de tallas */}
                  <div className="flex gap-2 mb-4 w-full justify-center">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`px-3 py-1 rounded border text-sm font-semibold transition-colors duration-200 ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300"
                        }`}
                        onClick={() =>
                          setSelection((prev) => ({
                            ...prev,
                            [product.id]: {
                              ...prev[product.id],
                              size,
                              error: "",
                            },
                          }))
                        }
                        type="button"
                        aria-label={size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {/* Selector de colores */}
                  <div className="flex gap-2 mb-4">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedColor === color.value
                            ? "border-black scale-110"
                            : "border-gray-300"
                        }`}
                        style={{ background: color.value }}
                        onClick={() =>
                          setSelection((prev) => ({
                            ...prev,
                            [product.id]: {
                              ...prev[product.id],
                              color: color.value,
                              error: "",
                            },
                          }))
                        }
                        type="button"
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                  {error && (
                    <div className="text-red-500 text-xs mb-2">{error}</div>
                  )}
                  <button
                    className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition-colors duration-200"
                    onClick={handleAdd}
                    type="button"
                  >
                    Añadir al carrito
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No hay productos disponibles. ¡Añade algunos en DATO CMS!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
