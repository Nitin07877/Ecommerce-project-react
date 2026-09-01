import { useState } from 'react';
import { formatMoney } from '../../utils/money';
import CheckmarkIcon from '../../assets/images/icons/checkmark.png';
import api from '../../api/api';

export function Product({ product, loadCart }) {
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [adding, setAdding] = useState(false);

  const addToCart = async () => {
    try {
      setAdding(true);

      await api.post('/api/cart-items', {
        productId: product.id,
        quantity,
      });

      await loadCart();

      setShowAddedMessage(true);

      setTimeout(() => {
        setShowAddedMessage(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to add product to cart:', error);

      if (error.response?.status === 401) {
        alert('Please login to add products to your cart.');
      } else {
        alert('Unable to add product to cart. Please try again.');
      }
    } finally {
      setAdding(false);
    }
  };

  const selectQuantity = (event) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <div
      className="product-container"
      data-testid="product-container"
    >
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">
        {product.name}
      </div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`images/ratings/rating-${product.rating.stars * 10}.png`}
          alt={`${product.rating.stars} star rating`}
        />

        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">
        {formatMoney(product.priceCents)}
      </div>

      <div className="product-quantity-container">
        <select
          value={quantity}
          onChange={selectQuantity}
          data-testid="product-quantity-selector"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="product-spacer"></div>

      <div
        className="added-to-cart"
        style={{ opacity: showAddedMessage ? 1 : 0 }}
      >
        <img src={CheckmarkIcon} alt="" />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}
        disabled={adding}
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}