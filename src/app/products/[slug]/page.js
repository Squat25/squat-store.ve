import { request } from "../../../lib/datocms";
import ProductDetailClient from "./ProductDetailClient";

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
    }
  }
`;

// generateStaticParams: Genera las rutas estáticas para cada producto en el build time
export async function generateStaticParams() {
  const { allProducts } = await request({ query: ALL_PRODUCTS_SLUGS_QUERY });
  return allProducts.map((product) => ({ slug: product.slug }));
}

export const revalidate = 259200; // 3 días

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { product } = await request({
    query: PRODUCT_BY_SLUG_QUERY,
    variables: { slug },
  });

  if (!product) {
    // Si el producto no se encuentra, mostramos una página 404 de Next.js
    const { notFound } = await import("next/navigation");
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
