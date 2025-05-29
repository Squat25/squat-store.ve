import { GraphQLClient } from "graphql-request";

console.log("Test variable:", process.env.NEXT_PUBLIC_TEST);
console.log("DatoCMS API Token:", process.env.NEXT_PUBLIC_DATO_CMS_API_TOKEN);

export function request({ query, variables, preview }) {
  const endpoint = preview
    ? `https://graphql.datocms.com/preview`
    : `https://graphql.datocms.com/`;

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_DATO_CMS_API_TOKEN}`,
    },
  });

  return client.request(query, variables);
}
