import dayjs from 'dayjs';
import { Fragment } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

export function OrderDetailsGrid({ order,loadCart }) {
   
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
         const addToCart= async()=>{
            await axios.post('/api/cart-items',{
                productId:orderProduct.product.id,
                quantity:1
            });
            await loadCart();
        };
        return (
          <Fragment key={orderProduct.product.id}>
            <div className="product-image-container">
              <img src={orderProduct.product.image} />
            </div>

            <div className="product-details">
              <div className="product-name">
                {orderProduct.product.name}
              </div>
              <div className="product-delivery-date">
                Arriving on: {dayjs(orderProduct.estimatedDeliveryTimeMs).format('MMMM D')}
              </div>
              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>
              <button className="buy-again-button button-primary" onClick={addToCart} >
                <img className="buy-again-icon" src="images/icons/buy-again.png" />
                <span className="buy-again-message"  >Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
            <Link to={`/tracking/${order.id}/${orderProduct.product.id}`}>
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