import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },

  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  deliveryOptionId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'DeliveryOptions',
      key: 'id',
    },
  },

  createdAt: {
    type: DataTypes.DATE(3),
  },

  updatedAt: {
    type: DataTypes.DATE(3),
  },
}, {
  defaultScope: {
    order: [['createdAt', 'ASC']],
  },
});