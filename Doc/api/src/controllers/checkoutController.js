const Stripe = require('stripe');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const createCheckoutSession = async (req, res, next) => {
  try {
    const stripe = getStripeClient();

    if (!stripe) {
      return res.status(503).json({
        message: 'Stripe no configurat: falta STRIPE_SECRET_KEY al fitxer .env'
      });
    }

    const { products, shippingAddress } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'El carret esta buit' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "L'adreca d'enviament es obligatoria" });
    }

    const lineItems = [];
    const orderProducts = [];
    let total = 0;

    for (const item of products) {
      let dbProduct = null;
      const pid = item.productId;
      const fallbackName = typeof item.name === 'string' ? item.name.trim() : '';
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: `Quantitat invalida per a ${item.name || 'producte'}`
        });
      }

      req.log.debug({ productLookupId: pid, lookupType: typeof pid }, 'Looking up product');

      if (typeof pid === 'string' && pid.length === 24 && mongoose.Types.ObjectId.isValid(pid)) {
        dbProduct = await Product.findById(pid);
        req.log.debug({ strategy: 'objectId', found: Boolean(dbProduct) }, 'Product lookup attempted');
      }

      if (!dbProduct) {
        dbProduct = await Product.findOne({ id: pid });
        req.log.debug({ strategy: 'id', found: Boolean(dbProduct) }, 'Product lookup attempted');
      }

      if (!dbProduct) {
        dbProduct = await Product.findOne({ productId: pid });
        req.log.debug({ strategy: 'productId', found: Boolean(dbProduct) }, 'Product lookup attempted');
      }

      if (!dbProduct && fallbackName) {
        dbProduct = await Product.findOne({ name: fallbackName });
        req.log.debug({ strategy: 'name', fallbackName, found: Boolean(dbProduct) }, 'Product lookup attempted');
      }

      if (!dbProduct) {
        req.log.warn({ productLookupId: pid, fallbackName }, 'Product not found in checkout');
        return res.status(404).json({
          message: `Producte no trobat: ${item.name || 'Desconegut'} (ID: ${pid})`
        });
      }

      if (dbProduct.stock < quantity) {
        return res.status(400).json({ message: `No hi ha prou stock per a ${dbProduct.name}` });
      }

      const itemPrice = dbProduct.price;
      total += itemPrice * quantity;

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: dbProduct.name,
            description: dbProduct.description,
            images: dbProduct.images?.[0] ? [dbProduct.images[0]] : []
          },
          unit_amount: Math.round(itemPrice * 100)
        },
        quantity
      });

      orderProducts.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        price: itemPrice,
        quantity
      });
    }

    const order = new Order({
      user: req.user.id,
      products: orderProducts,
      total,
      status: 'pending',
      shippingAddress
    });

    await order.save();
    req.log.info({ orderId: order._id, userId: req.user.id, total: order.total }, 'Order created');

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

    order.stripeSessionId = session.id;
    await order.save();

    req.log.info({ orderId: order._id, stripeSessionId: session.id }, 'Stripe session created');

    res.json({
      id: session.id,
      url: session.url
    });
  } catch (error) {
    req.log.error({ error: error.message }, 'Payment failed');
    if (!error.statusCode) {
      if (error?.type === 'StripeInvalidRequestError' || error?.type === 'invalid_request_error') {
        error.statusCode = 400;
      } else if (error?.statusCode) {
        error.statusCode = error.statusCode;
      } else {
        error.statusCode = 500;
      }
    }
    next(error);
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
    req.log.error({ error: err.message }, 'Webhook signature validation failed');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const orderId = session.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order && order.status === 'pending') {
        order.status = 'paid';
        order.paymentIntentId = session.payment_intent;
        await order.save();

        for (const item of order.products) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
          });
        }

        req.log.info({ orderId, paymentIntentId: session.payment_intent }, 'Payment confirmed');
      }
    } catch (error) {
      req.log.error({ error: error.message }, 'Error updating order after webhook');
    }
  }

  res.json({ received: true });
};

const confirmCheckoutSession = async (req, res, next) => {
  try {
    const stripe = getStripeClient();

    if (!stripe) {
      return res.status(503).json({
        message: 'Stripe no configurat: falta STRIPE_SECRET_KEY al fitxer .env'
      });
    }

    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId es obligatori' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'La sessio encara no esta pagada' });
    }

    const orderId = session.metadata?.orderId || session.client_reference_id;
    if (!orderId) {
      return res.status(404).json({ message: 'No s ha trobat la comanda associada' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Comanda no trobada' });
    }

    if (order.status === 'pending') {
      order.status = 'paid';
      order.paymentIntentId = session.payment_intent;
      await order.save();

      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    return res.json({
      success: true,
      orderId: order._id,
      status: order.status
    });
  } catch (error) {
    req.log.error({ error: error.message }, 'Error confirming checkout session');
    return next(error);
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
  confirmCheckoutSession
};
