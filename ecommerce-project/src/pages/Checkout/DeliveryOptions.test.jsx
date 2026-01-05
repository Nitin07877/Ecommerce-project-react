import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import dayjs from 'dayjs';
import { DeliveryOptions } from './DeliveryOptions';

vi.mock('axios');

describe('DeliveryOptions component', () => {
  let cartItem;
  let deliveryOptions;
  let loadCart;
  let user;

  beforeEach(() => {
    cartItem = {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '2',
    };

    deliveryOptions = [
      {
        id: '1',
        priceCents: 0,
        estimatedDeliveryTimeMs: 1747597994451,
      },
      {
        id: '2',
        priceCents: 499,
        estimatedDeliveryTimeMs: 1747252394451,
      },
      {
        id: '3',
        priceCents: 999,
        estimatedDeliveryTimeMs: 1747079594451,
      },
    ];

    loadCart = vi.fn();
    user = userEvent.setup();
  });

  it('renders delivery options correctly', () => {
    render(
      <DeliveryOptions
        cartItem={cartItem}
        deliveryOptions={deliveryOptions}
        loadCart={loadCart}
      />
    );

    expect(
      screen.getByText('Choose a delivery option:')
    ).toBeInTheDocument();

    const options = screen.getAllByTestId('delivery-option');
    expect(options.length).toBe(3);

    deliveryOptions.forEach((option, index) => {
      const expectedDate = dayjs(option.estimatedDeliveryTimeMs)
        .format('dddd, MMMM, D');

      expect(options[index]).toHaveTextContent(expectedDate);

      if (option.priceCents === 0) {
        expect(options[index]).toHaveTextContent('FREE Shipping');
      } else {
        expect(options[index]).toHaveTextContent(
          `$${(option.priceCents / 100).toFixed(2)} - Shipping`
        );
      }

      const radio = within(options[index]).getByRole('radio');

      if (option.id === cartItem.deliveryOptionId) {
        expect(radio.checked).toBe(true);
      } else {
        expect(radio.checked).toBe(false);
      }
    });
  });

  it('updates delivery option on click', async () => {
    render(
      <DeliveryOptions
        cartItem={cartItem}
        deliveryOptions={deliveryOptions}
        loadCart={loadCart}
      />
    );

    const options = screen.getAllByTestId('delivery-option');

    await user.click(options[2]);

    expect(axios.put).toHaveBeenCalledWith(
      '/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      { deliveryOptionId: '3' }
    );

    expect(loadCart).toHaveBeenCalledTimes(1);
  });
});
