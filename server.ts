import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // We parse JSON for the webhook payload
  // In production, we'd want to verify the webhook HMAC signature using body-parser raw,
  // but for this integration we'll just parse the JSON for simplicity, assuming Shopify is sending it.
  app.use(express.json());

  // Webhook endpoint to receive Shopify's `orders/create` webhook
  app.post('/api/webhooks/shopify/orders/create', async (req, res) => {
    try {
      const shopifyOrder = req.body;
      console.log('Received Shopify Order Webhook:', shopifyOrder.id);

      // We need to write this to Firestore
      // Read firebase config dynamically (since this server might not have env vars if using the applet config)
      let firebaseConfig = null;
      try {
        const configStr = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8');
        firebaseConfig = JSON.parse(configStr).firebaseConfig;
      } catch (err) {
        console.warn('Could not load firebase-applet-config.json, falling back to env vars if available.');
        firebaseConfig = {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID
        };
      }

      // Initialize Firebase (or reuse)
      const fbApp = initializeApp(firebaseConfig, `webhook-app-${Date.now()}`);
      const db = getFirestore(fbApp);

      // Map Shopify Order to our Firestore Order format
      const orderId = shopifyOrder.name || `ORD-${shopifyOrder.id}`;
      const customerName = shopifyOrder.customer ? `${shopifyOrder.customer.first_name || ''} ${shopifyOrder.customer.last_name || ''}`.trim() : 'Unknown';
      
      const formattedItems = (shopifyOrder.line_items || []).map((item: any) => {
        // Try to infer tier from the product name
        const tier = item.title.toLowerCase().includes('multi') ? 'multi-use' : 'single-use';
        return {
          productId: item.variant_id?.toString() || item.product_id?.toString() || 'unknown',
          productName: item.title,
          tier: tier,
          quantity: item.quantity,
          pricePerItem: parseFloat(item.price || '0'),
        };
      });

      const orderTotal = parseFloat(shopifyOrder.total_price || '0');
      
      const address = shopifyOrder.shipping_address;
      const deliveryAddress = address 
        ? `${address.address1 || ''} ${address.address2 || ''}, ${address.city || ''}, ${address.province || ''}, ${address.zip || ''}`.trim()
        : '';

      const newOrder = {
        orderId,
        customerName,
        phone: shopifyOrder.phone || (shopifyOrder.customer?.phone) || '',
        email: shopifyOrder.email || '',
        deliveryAddress,
        items: formattedItems,
        orderTotal,
        orderStatus: 'Confirmed', // We mark it confirmed since it's checked out on Shopify
        createdAt: new Date().toISOString(),
        notes: `Imported from Shopify (ID: ${shopifyOrder.id})`,
      };

      await addDoc(collection(db, 'orders'), newOrder);
      console.log(`Saved order ${orderId} to Firestore.`);

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling Shopify webhook:', error);
      res.status(500).send('Webhook Error');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
