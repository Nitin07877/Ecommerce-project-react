import dayjs from 'dayjs';
import './Trackingpage.css';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import api from '../api/api';

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await api.get(
          `/api/orders/${orderId}?expand=products`
        );

        setOrder(response.data);
      } catch (error) {
        console.error('Failed to load tracking data:', error);

        if (error.response?.status === 401) {
          navigate('/login');
        } else if (error.response?.status === 404) {
          setError('Order not found.');
        } else {
          setError('Unable to load tracking information.');
        }
      }
    };

    fetchTrackingData();
  }, [orderId, navigate]);

  if (error) {
    return (
      <>
        <Header cart={cart} />

        <div className="tracking-page">
          <div className="order-tracking">
            <h2>{error}</h2>

            <Link
              className="back-to-orders-link link-primary"
              to="/orders"
            >
              View all orders
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return null;
  }

  const orderProduct = order.products.find(
    (orderProduct) => orderProduct.productId === productId
  );

  if (!orderProduct) {
    return (
      <>
        <Header cart={cart} />

        <div className="tracking-page">
          <div className="order-tracking">
            <h2>Product not found in this order.</h2>

            <Link
              className="back-to-orders-link link-primary"
              to="/orders"
            >
              View all orders
            </Link>
          </div>
        </div>
      </>
    );
  }

  const totalDeliveryTimeMs =
    orderProduct.estimatedDeliveryTimeMs -
    order.orderTimeMs;

  const timePassedMs =
    dayjs().valueOf() - order.orderTimeMs;

  let deliveryPercent =
    (timePassedMs / totalDeliveryTimeMs) * 100;

  if (deliveryPercent < 0) {
    deliveryPercent = 0;
  }

  if (deliveryPercent > 100) {
    deliveryPercent = 100;
  }

  const isPreparing = deliveryPercent < 33;

  const isShipped =
    deliveryPercent >= 33 &&
    deliveryPercent < 100;

  const isDelivered =
    deliveryPercent >= 100;

  return (
    <>
      <link
        rel="icon"
        type="image/svg+xml"
        href="tracking-favicon.png"
      />

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">

          <Link
            className="back-to-orders-link link-primary"
            to="/orders"
          >
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryPercent >= 100
              ? 'Delivered on '
              : 'Arriving on '}

            {dayjs(
              orderProduct.estimatedDeliveryTimeMs
            ).format('dddd, MMMM D')}
          </div>

          <div className="product-info">
            {orderProduct.product.name}
          </div>

          <div className="product-info">
            Quantity: {orderProduct.quantity}
          </div>

          <img
            className="product-image"
            src={orderProduct.product.image}
            alt={orderProduct.product.name}
          />

          <div className="progress-labels-container">

            <div
              className={`progress-label ${
                isPreparing ? 'current-status' : ''
              }`}
            >
              Preparing
            </div>

            <div
              className={`progress-label ${
                isShipped ? 'current-status' : ''
              }`}
            >
              Shipped
            </div>

            <div
              className={`progress-label ${
                isDelivered ? 'current-status' : ''
              }`}
            >
              Delivered
            </div>

          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${deliveryPercent}%`,
              }}
            />
          </div>

        </div>
      </div>
    </>
  );
}