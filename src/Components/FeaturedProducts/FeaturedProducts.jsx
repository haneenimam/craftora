import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Apis/config';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../../Context/CartContext'; // if you have a cart context
import styles from './FeaturedProducts.module.css';

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Cart context hook

  useEffect(() => {
    axiosInstance.get('/api/products?limit=9&page=1')
      .then((response) => {
        const data = response.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data.data && Array.isArray(data.data.products)) {
          setProducts(data.data.products);
        } else {
          throw new Error('Unexpected API response structure');
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    navigate('/checkout');
  };

  if (loading) return <p className={styles.statusMessage}>Loading featured products...</p>;
  if (error) return <p className={styles.statusMessage}>{error}</p>;

  return (
    <div className={styles['featured-product-sidebar']}>
      <h2 className={styles.title}>Featured Products</h2>
      <div className={styles['product-list']}>
        {products.map((product) => {
          const id = product.id || product._id;
          const titleFirstWord = product.title?.split(' ')[0] || 'Product';
          const imgSrc = product.image || product.images?.[0] || product.thumbnail || '/default-product.jpg';

          return (
            <div
              key={id}
              className={styles['product-card']}
              onClick={() => navigate(`/product/${id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${id}`)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={imgSrc}
                  alt={product.title || 'Product'}
                  className={styles['product-image']}
                  width="240"
                  height="160"
                  onError={(e) => (e.target.src = '/default-product.jpg')}
                />
                <div className={styles.hoverActions}>
                  <button
                    className={styles.iconButton}
                    onClick={(e) => handleAddToCart(product, e)}
                    aria-label={`Add to cart: ${product.title}`}
                    title="Add to Cart"
                  >
                    <FiShoppingCart />
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={(e) => handleBuyNow(product, e)}
                    aria-label={`Buy now: ${product.title}`}
                    title="Buy Now"
                  >
                    <FiCreditCard />
                  </button>
                </div>
              </div>
              <p className={styles['product-title']}>{titleFirstWord}</p>
              <div className={styles.priceContainer}>
                <p className={styles['product-price']}>{product.price}</p>
                <span className={styles.currency}>EGP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(FeaturedProduct);
