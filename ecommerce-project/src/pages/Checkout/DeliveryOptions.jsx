import { formatMoney } from '../../utils/money';
import dayjs from 'dayjs';
import api from '../../api/api';

export function DeliveryOptions({
  cartItem,
  deliveryOptions,
  loadCart,
}) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">
        Choose a delivery option:
      </div>

      {deliveryOptions.map((deliveryOption) => {
        let priceString = 'FREE Shipping';

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(
            deliveryOption.priceCents
          )} - Shipping`;
        }

        const updateDeliveryOptions = async () => {
          try {
            await api.put(
              `/api/cart-items/${cartItem.productId}`,
              {
                deliveryOptionId: deliveryOption.id,
              }
            );

            await loadCart();
          } catch (error) {
            console.error(
              'Failed to update delivery option:',
              error
            );

            if (error.response?.status === 401) {
              alert('Please login to manage your cart.');
            } else {
              alert(
                error.response?.data?.error ||
                'Unable to update delivery option.'
              );
            }
          }
        };

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={updateDeliveryOptions}
            data-testid="delivery-option"
          >
            <input
              type="radio"
              checked={
                deliveryOption.id ===
                cartItem.deliveryOptionId
              }
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
            />

            <div>
              <div className="delivery-option-date">
                {dayjs(
                  deliveryOption.estimatedDeliveryTimeMs
                ).format('dddd, MMMM, D')}
              </div>

              <div className="delivery-option-price">
                {priceString}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}