"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { request } from "../lib/datocms";

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState({}); // { [productId]: { size, color, error } }

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await request({ query: HOMEPAGE_QUERY });
        setProducts(data?.allProducts || []);
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
    return <div className="text-center py-12">Cargando productos...</div>;
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
              };
              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  {product.images && product.images.url ? (
                    <Image
                      src={product.images.url}
                      alt={product.images.alt || product.name}
                      width={product.images.width || 300}
                      height={product.images.height || 300}
                      className="w-full h-auto rounded-md mb-4 object-cover"
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
                  <div className="flex gap-2 mb-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`px-3 py-1 rounded border ${
                          selectedSize === size
                            ? "bg-black text-white"
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
