export const revalidate = 259200; // 3 días
import { request } from "../lib/datocms";
import HomeClient from "../components/HomeClient";

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
  if (process.env.NODE_ENV !== "development") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Modo demo</h1>
          <p className="text-gray-600">
            El sitio está en modo demo. No se muestran productos reales para
            evitar consumir la API de DatoCMS.
          </p>
        </div>
      </div>
    );
  }
  const data = await request({ query: HOMEPAGE_QUERY });
  const allProducts = data?.allProducts || [];
  return <HomeClient products={allProducts} />;
}
