import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Apis/config';
import ProductCard from '../../Components/ProductCard/ProductCard';
import styles from './ProductList.module.css';
import { useLocation } from 'react-router-dom';
import ReactSlider from 'react-slider';

const ProductList = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // Filter state
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Reset page if navigated from elsewhere
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

  // Debounce search input (800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = {
      page,
      ...(category && category !== 'All Products' && { category }),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      ...(debouncedSearch && { search: debouncedSearch }),
    };

    axiosInstance
      .get('/api/products', { params })
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
  }, [page, category, priceRange, debouncedSearch]);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem('productListPage', page.toString());
  }, [page]);

  // Reset page to 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [category, priceRange, debouncedSearch]);

  if (loading) return <div className={styles.loading}>Loading products...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.filterInput}
        />

        <div className={styles.dropdownWrapper}>
          <div
            className={styles.customDropdown}
            onClick={() => setOpen(!open)}
            tabIndex={0}
            onBlur={() => setOpen(false)}
          >
            <span>{category || 'All Products'}</span>
            <ul className={`${styles.dropdownMenu} ${open ? styles.show : ''}`}>
              {['All Products', 'Jewelry', 'Candles', 'Crochet', 'Ceramics', 'Home Essentials'].map((option) => (
                <li
                  key={option}
                  className={`${styles.dropdownOption} ${category === option ? styles.active : ''}`}
                  onClick={() => {
                    setCategory(option);
                    setOpen(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>



        <div className={styles.sliderWrapper}>
          <label className={styles.sliderLabel}>
            Price Range: EGP{tempPriceRange[0]} – EGP{tempPriceRange[1]}
          </label>
          <ReactSlider
            className={styles.dualSlider}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            min={0}
            max={3000}
            step={50}
            value={tempPriceRange}
            onChange={(value) => setTempPriceRange(value)}
            onAfterChange={(value) => setPriceRange(value)}
            minDistance={50}
            pearling
            withTracks
          />
        </div>
      </div>

      {/* Products */}
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            page={page}
          />
        ))}
      </div>

      {/* Pagination */}
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
          onClick={() => setPage((prev) => prev + 1)}
          disabled={products.length < 20}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
