export async function fetchShopifyProducts() {
  const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    console.warn('Shopify environment variables are not set.');
    return [];
  }

  const query = `
    {
      products(first: 250) {
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

  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { data } = await response.json();
    return data.products.edges.map((edge: any) => ({
      title: edge.node.title,
      variantId: edge.node.variants.edges[0]?.node.id,
    }));
  } catch (error) {
    console.warn('Error fetching Shopify products:', error);
    return [];
  }
}

export async function createShopifyCheckout(items: { variantId: string; quantity: number }[]) {
  const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error('Shopify environment variables are not set.');
  }

  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      })),
    },
  };

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Shopify cart');
  }

  const { data } = await response.json();
  
  if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart.checkoutUrl;
}
