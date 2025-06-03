import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Apis/config';
import ProductCard from '../../Components/ProductCard/ProductCard';
import styles from './ProductList.module.css';
import { useLocation } from 'react-router-dom';

const ProductList = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset page to 1 if the user navigates from another route
  useEffect(() => {
    const previousPath = sessionStorage.getItem('previousPath');
    if (previousPath !== '/product-list') {
      localStorage.removeItem('productListPage');
      setPage(1);
    } else {
      const savedPage = localStorage.getItem('productListPage');
      if (savedPage) setPage(Number(savedPage));
    }
    sessionStorage.setItem('previousPath', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/products?page=${page}`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data.data && Array.isArray(data.data.products)) {
          setProducts(data.data.products);
        } else {
          throw new Error('Unexpected API response structure');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching products');
        setLoading(false);
        console.error('Error fetching products:', err);
      });
  }, [page]);

  useEffect(() => {
    localStorage.setItem('productListPage', page.toString());
  }, [page]);

  if (loading) return <div className={styles.loading}>Loading products...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            page={page}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>Page {page}</span>
        <button
          className={styles.pageButton}
          onClick={() => setPage((prev) => Math.min(prev + 1, 3))}
          disabled={page === 3}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
