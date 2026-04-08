const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Ecommerce Pau Alchapar',
      version: '1.0.0',
      description: 'API Ecommerce con Node.js, Express y MongoDB',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor Local',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
            password: { type: 'string', description: 'Password (min 6 characters)' },
            role: { type: 'string', enum: ['client', 'admin'], default: 'client', description: 'User role' },
            refreshToken: { type: 'string', description: 'JWT refresh token' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Update date' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Product ID' },
            name: { type: 'string', description: 'Product name' },
            description: { type: 'string', description: 'Product description' },
            price: { type: 'number', minimum: 0, description: 'Product price' },
            stock: { type: 'integer', minimum: 0, default: 0, description: 'Available stock' },
            category: { type: 'string', description: 'Product category' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Update date' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Category ID' },
            name: { type: 'string', description: 'Category name' },
            description: { type: 'string', description: 'Category description' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Update date' },
          },
        },
        CartProduct: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
            name: { type: 'string', description: 'Product name' },
            price: { type: 'number', description: 'Unit price' },
            quantity: { type: 'integer', default: 1, description: 'Quantity' },
            image: { type: 'string', description: 'Image URL' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Cart ID' },
            user: { type: 'string', description: 'User ID (ref User)' },
            products: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartProduct' },
              description: 'List of products in cart',
            },
            total: { type: 'number', default: 0, description: 'Cart total' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Update date' },
          },
        },

        OrderProduct: {
          type: 'object',
          properties: {
            product: { type: 'string', description: 'Product ID (ref Product)' },
            quantity: { type: 'integer', minimum: 1, description: 'Quantity' },
            unitPrice: { type: 'number', minimum: 0, description: 'Unit price' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Order ID' },
            user: { type: 'string', description: 'User ID (ref User)' },
            products: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderProduct' },
              description: 'List of products in the order',
            },
            total: { type: 'number', minimum: 0, description: 'Order total' },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              default: 'pending',
              description: 'Order status',
            },
            shippingAddress: { type: 'string', description: 'Shipping address' },
            paymentMethod: {
              type: 'string',
              enum: ['card', 'paypal', 'transfer'],
              default: 'card',
              description: 'Payment method',
            },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Update date' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
