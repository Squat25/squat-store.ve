import { GraphQLClient } from "graphql-request";

const memoryCache = {};

console.log("Test variable:", process.env.NEXT_PUBLIC_TEST);
console.log("DatoCMS API Token:", process.env.NEXT_PUBLIC_DATO_CMS_API_TOKEN);

export async function request({ query, variables, preview }) {
  const cacheKey = JSON.stringify({ query, variables, preview });
  // Solo cachear en desarrollo
  if (process.env.NODE_ENV === "development" && memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }
  const endpoint = preview
    ? `https://graphql.datocms.com/preview`
    : `https://graphql.datocms.com/`;

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_DATO_CMS_API_TOKEN}`,
    },
  });

  const data = await client.request(query, variables);
  if (process.env.NODE_ENV === "development") {
    memoryCache[cacheKey] = data;
  }
  return data;
}
