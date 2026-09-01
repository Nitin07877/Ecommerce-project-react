import { formatMoney } from '../../utils/money';
import { useState } from 'react';
import api from '../../api/api';

export function CartItemDetails({ cartItem, loadCart }) {
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const deleteCartItems = async () => {
    try {
      await api.delete(
        `/api/cart-items/${cartItem.productId}`
      );

      await loadCart();
    } catch (error) {
      console.error('Failed to delete cart item:', error);

      if (error.response?.status === 401) {
        alert('Please login to manage your cart.');
      } else {
        alert(
          error.response?.data?.error ||
          'Unable to delete item.'
        );
      }
    }
  };

  const updateQuantity = async () => {
    if (!isUpdatingQuantity) {
      setIsUpdatingQuantity(true);
      return;
    }

    const newQuantity = Number(quantity);

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1 ||
      newQuantity > 10
    ) {
      alert('Quantity must be between 1 and 10.');
      return;
    }

    try {
      await api.put(
        `/api/cart-items/${cartItem.productId}`,
        {
          quantity: newQuantity,
        }
      );

      await loadCart();

      setIsUpdatingQuantity(false);
    } catch (error) {
      console.error('Failed to update quantity:', error);

      if (error.response?.status === 401) {
        alert('Please login to manage your cart.');
      } else {
        alert(
          error.response?.data?.error ||
          'Unable to update quantity.'
        );
      }
    }
  };

  const updateQuantityInput = (event) => {
    setQuantity(event.target.value);
  };

  const handleQuantityKeyDown = (event) => {
    if (event.key === 'Enter') {
      updateQuantity();
    } else if (event.key === 'Escape') {
      setQuantity(cartItem.quantity);
      setIsUpdatingQuantity(false);
    }
  };

  return (
    <>
      <img
        className="product-image"
        src={cartItem.product.image}
        alt={cartItem.product.name}
      />

      <div className="cart-item-details">

        <div className="product-name">
          {cartItem.product.name}
        </div>

        <div className="product-price">
          {formatMoney(cartItem.product.priceCents)}
        </div>

        <div className="product-quantity">

          <span>
            Quantity:

            {isUpdatingQuantity ? (
              <input
                value={quantity}
                onChange={updateQuantityInput}
                type="text"
                className="quantity-textbox"
                onKeyDown={handleQuantityKeyDown}
              />
            ) : (
              <span className="quantity-label">
                {cartItem.quantity}
              </span>
            )}
          </span>

          <span
            className="update-quantity-link link-primary"
            onClick={updateQuantity}
          >
            {isUpdatingQuantity ? 'Save' : 'Update'}
          </span>

          <span
            className="delete-quantity-link link-primary"
            onClick={deleteCartItems}
          >
            Delete
          </span>

        </div>
      </div>
    </>
  );
}