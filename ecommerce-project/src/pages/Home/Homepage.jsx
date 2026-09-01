import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useSearchParams } from 'react-router';
import api from '../../api/api';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const urlPath = search
          ? `/api/products?search=${encodeURIComponent(search)}`
          : '/api/products';

        const response = await api.get(urlPath);

        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    getHomeData();
  }, [search]);

  return (
    <>
      <title>Ecommerce Project</title>

      <link
        rel="icon"
        type="image/svg+xml"
        href="home-favicon.png"
      />

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid
          products={products}
          loadCart={loadCart}
        />
      </div>
    </>
  );
}