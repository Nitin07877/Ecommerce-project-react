import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/*
  GET /api/orders

  Returns only orders belonging to
  the currently logged-in user.
*/
router.get('/', authenticate, async (req, res) => {
  try {
    const expand = req.query.expand;

    let orders = await Order.unscoped().findAll({
      where: {
        userId: req.user.id,
      },
      order: [['orderTimeMs', 'DESC']],
    });

    if (expand === 'products') {
      orders = await Promise.all(
        orders.map(async (order) => {
          const products = await Promise.all(
            order.products.map(async (product) => {
              const productDetails = await Product.findByPk(
                product.productId
              );

              return {
                ...product,
                product: productDetails,
              };
            })
          );

          return {
            ...order.toJSON(),
            products,
          };
        })
      );
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);

    res.status(500).json({
      error: 'Failed to fetch orders',
    });
  }
});


/*
  POST /api/orders

  Creates an order for the currently
  logged-in user.
*/
router.post('/', authenticate, async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: {
        userId: req.user.id,
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        error: 'Cart is empty',
      });
    }

    let totalCostCents = 0;

    const products = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findByPk(item.productId);

        if (!product) {
          throw new Error(
            `Product not found: ${item.productId}`
          );
        }

        const deliveryOption = await DeliveryOption.findByPk(
          item.deliveryOptionId
        );

        if (!deliveryOption) {
          throw new Error(
            `Invalid delivery option: ${item.deliveryOptionId}`
          );
        }

        const productCost =
          product.priceCents * item.quantity;

        const shippingCost =
          deliveryOption.priceCents;

        totalCostCents +=
          productCost + shippingCost;

        const estimatedDeliveryTimeMs =
          Date.now() +
          deliveryOption.deliveryDays *
            24 *
            60 *
            60 *
            1000;

        return {
          productId: item.productId,
          quantity: item.quantity,
          estimatedDeliveryTimeMs,
        };
      })
    );

    // 10% tax
    totalCostCents = Math.round(
      totalCostCents * 1.1
    );

    const order = await Order.create({
      userId: req.user.id,
      orderTimeMs: Date.now(),
      totalCostCents,
      products,
    });

    // Delete only this user's cart
    await CartItem.destroy({
      where: {
        userId: req.user.id,
      },
    });

    res.status(201).json(order);

  } catch (error) {
    console.error('Create order error:', error);

    res.status(500).json({
      error: 'Failed to create order',
    });
  }
});


/*
  GET /api/orders/:orderId

  Returns a specific order only if
  it belongs to the logged-in user.
*/
router.get('/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const expand = req.query.expand;

    let order = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    if (expand === 'products') {
      const products = await Promise.all(
        order.products.map(async (product) => {
          const productDetails =
            await Product.findByPk(
              product.productId
            );

          return {
            ...product,
            product: productDetails,
          };
        })
      );

      order = {
        ...order.toJSON(),
        products,
      };
    }

    res.json(order);

  } catch (error) {
    console.error('Get order error:', error);

    res.status(500).json({
      error: 'Failed to fetch order',
    });
  }
});

export default router;