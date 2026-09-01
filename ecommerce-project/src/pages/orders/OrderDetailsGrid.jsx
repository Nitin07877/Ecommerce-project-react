import dayjs from 'dayjs';
import { Fragment } from 'react';
import { Link } from 'react-router';
import api from '../../api/api';

export function OrderDetailsGrid({ order, loadCart }) {
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {

        const addToCart = async () => {
          try {
            await api.post('/api/cart-items', {
              productId: orderProduct.product.id,
              quantity: 1,
            });

            await loadCart();
          } catch (error) {
            console.error('Failed to add product to cart:', error);

            if (error.response?.status === 401) {
              alert('Please login to add items to cart.');
            } else {
              alert(
                error.response?.data?.error ||
                'Unable to add product to cart.'
              );
            }
          }
        };

        return (
          <Fragment key={orderProduct.product.id}>

            <div className="product-image-container">
              <img
                src={orderProduct.product.image}
                alt={orderProduct.product.name}
              />
            </div>

            <div className="product-details">

              <div className="product-name">
                {orderProduct.product.name}
              </div>

              <div className="product-delivery-date">
                Arriving on:{' '}
                {dayjs(
                  orderProduct.estimatedDeliveryTimeMs
                ).format('MMMM D')}
              </div>

              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>

              <button
                className="buy-again-button button-primary"
                onClick={addToCart}
              >
                <img
                  className="buy-again-icon"
                  src="images/icons/buy-again.png"
                  alt=""
                />

                <span className="buy-again-message">
                  Add to Cart
                </span>
              </button>

            </div>

            <div className="product-actions">

              <Link
                to={`/tracking/${order.id}/${orderProduct.product.id}`}
              >
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>

            </div>

          </Fragment>
        );
      })}
    </div>
  );
}