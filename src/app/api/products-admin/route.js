import { request } from "../../../lib/datocms";

const ALL_PRODUCTS_QUERY = `
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
      categories {
        name
      }
    }
  }
`;

export async function GET(req) {
  try {
    const data = await request({ query: ALL_PRODUCTS_QUERY });
    return Response.json({ productos: data.allProducts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
