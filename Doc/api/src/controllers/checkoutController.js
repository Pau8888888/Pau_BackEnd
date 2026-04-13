const Stripe = require('stripe');
const Order = require('../models/Order');
const Product = require('../models/Product');

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripeClient();

    if (!stripe) {
      return res.status(503).json({
        message: 'Stripe no configurat: falta STRIPE_SECRET_KEY al fitxer .env'
      });
    }

    const { products, shippingAddress } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "El carret està buit" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "L'adreça d'enviament és obligatòria" });
    }

    const lineItems = [];
    const orderProducts = [];
    let total = 0;

    // Validacions de productes, stock i preus
    for (const item of products) {
      const dbProduct = await Product.findById(item.productId);
      
      if (!dbProduct) {
        return res.status(404).json({ message: `Producte no trobat: ${item.name}` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ message: `No hi ha prou stock per a ${dbProduct.name}` });
      }

      // Utilitzem el preu de la DB, no el del frontend per seguretat
      const itemPrice = dbProduct.price;
      total += itemPrice * item.quantity;

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: dbProduct.name,
            description: dbProduct.description,
          },
          unit_amount: Math.round(itemPrice * 100), // Stripe usa cèntims
        },
        quantity: item.quantity,
      });

      orderProducts.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        price: itemPrice,
        quantity: item.quantity
      });
    }

    // Creem la comanda en estat "pendent"
    const order = new Order({
      user: req.user.userId,
      products: orderProducts,
      total: total,
      status: 'pending',
      shippingAddress: shippingAddress
    });

    await order.save();

    // Creem la sessió de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/cancel`,
      customer_email: req.user.email,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString()
      }
    });

    // Guardem el sessionId a la comanda
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ id: session.id });

  } catch (error) {
    console.error('Error en createCheckoutSession:', error);
    res.status(500).json({ message: "Error al crear la sessió de pagament", error: error.message });
  }
};

const stripeWebhook = async (req, res) => {
  const stripe = getStripeClient();

  if (!stripe) {
    return res.status(503).json({
      message: 'Stripe no configurat: falta STRIPE_SECRET_KEY al fitxer .env'
    });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Busquem la comanda
      const orderId = session.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order && order.status === 'pending') {
        order.status = 'paid';
        order.paymentIntentId = session.payment_intent;
        await order.save();

        // Actualitzem l'stock
        for (const item of order.products) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
          });
        }
        
        console.log(`Order ${orderId} marked as paid.`);
      }
    } catch (error) {
      console.error('Error updating order after webhook:', error);
    }
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  stripeWebhook
};
