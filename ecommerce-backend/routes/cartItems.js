import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get current user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    const expand = req.query.expand;

    let cartItems = await CartItem.findAll({
      where: {
        userId: req.user.id
      }
    });

    if (expand === 'product') {
      cartItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findByPk(item.productId);

          return {
            ...item.toJSON(),
            product
          };
        })
      );
    }

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to get cart'
    });
  }
});

// Add product to current user's cart
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }

    if (
      typeof quantity !== 'number' ||
      quantity < 1 ||
      quantity > 10
    ) {
      return res.status(400).json({
        error: 'Quantity must be a number between 1 and 10'
      });
    }

    let cartItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        userId: req.user.id,
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to add item to cart'
    });
  }
});

// Update current user's cart item
router.put('/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body;

    const cartItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart item not found'
      });
    }

    if (quantity !== undefined) {
      if (
        typeof quantity !== 'number' ||
        quantity < 1
      ) {
        return res.status(400).json({
          error: 'Quantity must be a number greater than 0'
        });
      }

      cartItem.quantity = quantity;
    }

    if (deliveryOptionId !== undefined) {
      const deliveryOption =
        await DeliveryOption.findByPk(deliveryOptionId);

      if (!deliveryOption) {
        return res.status(400).json({
          error: 'Invalid delivery option'
        });
      }

      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to update cart item'
    });
  }
});

// Delete current user's cart item
router.delete('/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;

    const cartItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to delete cart item'
    });
  }
});

export default router;