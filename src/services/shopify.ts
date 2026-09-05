export const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || 'your-store.myshopify.com';
export const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'paste_your_token_here';

/**
 * Make a request to the Shopify Storefront API.
 */
export async function storefrontApi(query: string, variables = {}) {
  const url = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  return json.data;
}

/**
 * Look up a Shopify product by its exact title to get its first variant ID.
 * Falls back to searching if direct query doesn't work.
 */
export async function getVariantIdByProductTitle(title: string): Promise<string | null> {
  const SEARCH_QUERY = `
    query getProductByTitle($query: String!) {
      products(first: 1, query: $query) {
        edges {
          node {
            id
            title
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  // Search by exact title
  const data = await storefrontApi(SEARCH_QUERY, { query: `title:'${title}'` });
  
  const productNode = data?.products?.edges?.[0]?.node;
  if (productNode && productNode.variants?.edges?.length > 0) {
    return productNode.variants.edges[0].node.id;
  }
  
  // If not found, try a looser search without exact quotes
  const looseData = await storefrontApi(SEARCH_QUERY, { query: title });
  const looseNode = looseData?.products?.edges?.[0]?.node;
  if (looseNode && looseNode.variants?.edges?.length > 0) {
    return looseNode.variants.edges[0].node.id;
  }

  return null;
}

/**
 * Creates a Shopify Cart with the given line items and returns the Checkout URL.
 */
export async function createShopifyCartAndGetCheckoutUrl(
  items: Array<{ title: string; quantity: number }>
): Promise<string> {
  // 1. Resolve variant IDs for each product title
  const lines = [];
  
  for (const item of items) {
    const variantId = await getVariantIdByProductTitle(item.title);
    if (!variantId) {
      throw new Error(`Could not find Shopify product matching title: "${item.title}". Please ensure products are created in Shopify with identical titles.`);
    }
    lines.push({
      merchandiseId: variantId,
      quantity: item.quantity,
    });
  }

  // 2. Create the Cart
  const CART_CREATE_MUTATION = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await storefrontApi(CART_CREATE_MUTATION, {
    input: { lines }
  });

  if (data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(`Cart error: ${data.cartCreate.userErrors[0].message}`);
  }

  const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error('Failed to create Shopify cart checkout URL.');
  }

  return checkoutUrl;
}
