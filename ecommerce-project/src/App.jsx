import { Routes, Route } from 'react-router';
import { HomePage } from './pages/Home/Homepage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useState, useEffect } from 'react';
import api from './api/api';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  const [cart, setcart] = useState([]);

  const loadCart = async () => {
    try {
      const response = await api.get('/api/cart-items?expand=product');
      setcart(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setcart([]);
      } else {
        console.error('Failed to load cart:', error);
      }
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>

      {/* Home */}
      <Route
        index
        element={
          <HomePage
            cart={cart}
            loadCart={loadCart}
          />
        }
      />

      {/* Authentication */}
      <Route
        path="login"
        element={<LoginPage />}
      />

      <Route
        path="register"
        element={<RegisterPage />}
      />

      {/* Protected Checkout */}
      <Route
        path="checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage
              cart={cart}
              loadCart={loadCart}
            />
          </ProtectedRoute>
        }
      />

      {/* Protected Orders */}
      <Route
        path="orders"
        element={
          <ProtectedRoute>
            <OrdersPage
              cart={cart}
              loadCart={loadCart}
            />
          </ProtectedRoute>
        }
      />

      {/* Tracking */}
      <Route
        path="tracking/:orderId/:productId"
        element={
          <TrackingPage
            cart={cart}
          />
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <NotFoundPage
            cart={cart}
          />
        }
      />

    </Routes>
  );
}

export default App;