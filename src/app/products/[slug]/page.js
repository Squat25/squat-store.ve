import { request } from "@/lib/datocms";
import Image from "next/image";
import { notFound } from "next/navigation"; // Para manejar productos no encontrados

// Query para obtener todos los slugs de productos para generateStaticParams
const ALL_PRODUCTS_SLUGS_QUERY = `
  query AllProductsSlugs {
    allProducts {
      slug
    }
  }
`;

// Query para obtener los detalles de un solo producto por su slug
const PRODUCT_BY_SLUG_QUERY = `
  query ProductBySlug($slug: String!) {
    product(filter: { slug: { eq: $slug } }) {
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
      # Aquí podrías añadir más campos si los creas después (ej. stock, color, talla, etc.)
    }
  }
`;

// generateStaticParams: Genera las rutas estáticas para cada producto en el build time
export async function generateStaticParams() {
  const { allProducts } = await request({
    query: ALL_PRODUCTS_SLUGS_QUERY,
  });

  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

// El componente de la página de detalle del producto
export default async function ProductPage({ params }) {
  const { slug } = params; // El slug viene de la URL

  const { product } = await request({
    query: PRODUCT_BY_SLUG_QUERY,
    variables: { slug }, // Pasamos el slug como variable a la consulta GraphQL
  });

  // Si el producto no se encuentra, mostramos una página 404 de Next.js
  if (!product) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden md:flex">
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center">
          {product.images && product.images.url ? (
            <Image
              src={product.images.url}
              alt={product.images.alt || product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover max-h-96 w-auto"
              priority
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              No Image Available
            </div>
          )}
          {/* Aquí podrías añadir una galería de miniaturas si hay varias imágenes */}
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {product.description}
          </p>
          <p className="text-4xl font-bold text-blue-600 mb-6">
            ${product.price.toFixed(2)}
          </p>

          {/* Botones de acción o selectores de talla/color aquí */}
          <div className="flex flex-col gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out">
              Añadir al Carrito
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out">
              Comprar Ahora
            </button>
          </div>

          {/* Puedes añadir una sección de productos relacionados o info adicional aquí */}
          <div className="mt-8 text-gray-500 text-sm">
            <p>ID de Producto: {product.id}</p>
            <p>Slug: {product.slug}</p>
          </div>
        </div>
      </div>

      <a
        href="/"
        className="mt-12 text-blue-600 hover:underline text-lg font-semibold"
      >
        &larr; Volver a todos los productos
      </a>
    </main>
  );
}
