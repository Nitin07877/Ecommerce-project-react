import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { OrdersGrid } from './OrdersGrid';
import api from '../../api/api';

import './OrdersPage.css';

export function OrdersPage({ cart, loadCart }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          '/api/orders?expand=products'
        );

        setOrders(response.data);
      } catch (error) {
        console.error('Failed to load orders:', error);

        if (error.response?.status === 401) {
          setError('Please login to view your orders.');
        } else {
          setError('Unable to load your orders.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <>
      <title>Orders</title>

      <link
        rel="icon"
        type="image/svg+xml"
        href="orders-favicon.png"
      />

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">
          Your Orders
        </div>

        {loading && (
          <div className="orders-loading">
            Loading your orders...
          </div>
        )}

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <OrdersGrid
            orders={orders}
            loadCart={loadCart}
          />
        )}
      </div>
    </>
  );
}