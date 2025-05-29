import { request } from "@/lib/datocms";
import Image from "next/image";

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

export default async function Home() {
  const { allProducts } = await request({
    query: HOMEPAGE_QUERY,
  });

  console.log(allProducts);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Nuestros Productos Squat
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {allProducts.length > 0 ? (
          allProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 p-6 rounded-lg shadow-md bg-white flex flex-col items-center text-center"
            >
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
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-3">
                {product.description}
              </p>
              <p className="text-xl font-bold text-blue-600 mt-auto">
                ${product.price.toFixed(2)}
              </p>
              <a
                href={`/products/${product.slug}`}
                className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Ver Detalles
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No hay productos disponibles. ¡Añade algunos en DATO CMS!
          </p>
        )}
      </div>
    </main>
  );
}
