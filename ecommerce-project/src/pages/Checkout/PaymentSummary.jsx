import { formatMoney } from '../../utils/money';
import { useNavigate } from 'react-router';
import api from '../../api/api';

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate = useNavigate();

  const createOrder = async () => {
    try {
      await api.post('/api/orders');

      await loadCart();

      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);

      if (error.response?.status === 401) {
        alert('Please login to place your order.');
        navigate('/login');
      } else {
        alert(
          error.response?.data?.error ||
          'Unable to place your order. Please try again.'
        );
      }
    }
  };

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">
        Payment Summary
      </div>

      {paymentSummary && (
        <>
          <div
            className="payment-summary-row"
            data-testid="payment-summary-product-cost"
          >
            <div>
              Items ({paymentSummary.totalItems}):
            </div>

            <div className="payment-summary-money">
              {formatMoney(paymentSummary.productCostCents)}
            </div>
          </div>

          <div
            className="payment-summary-row"
            data-testid="payment-summary-shipping-cost"
          >
            <div>Shipping &amp; handling:</div>

            <div className="payment-summary-money">
              {formatMoney(paymentSummary.shippingCostCents)}
            </div>
          </div>

          <div
            className="payment-summary-row subtotal-row"
            data-testid="payment-summary-total-before-tax"
          >
            <div>Total before tax:</div>

            <div className="payment-summary-money">
              {formatMoney(
                paymentSummary.totalCostBeforeTaxCents
              )}
            </div>
          </div>

          <div
            className="payment-summary-row"
            data-testid="payment-summary-tax"
          >
            <div>Estimated tax (10%):</div>

            <div className="payment-summary-money">
              {formatMoney(paymentSummary.taxCents)}
            </div>
          </div>

          <div
            className="payment-summary-row total-row"
            data-testid="payment-summary-total"
          >
            <div>Order total:</div>

            <div className="payment-summary-money">
              {formatMoney(paymentSummary.totalCostCents)}
            </div>
          </div>

          <button
            className="place-order-button button-primary"
            data-testid="place-order-button"
            onClick={createOrder}
          >
            Place your order
          </button>
        </>
      )}
    </div>
  );
}