import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShopByCategory.module.css";

const categories = [
  { name: "Jewelry", image: "jewelry.jpeg" },
  { name: "Crochet", image: "crochet.jpeg" },
  { name: "Candles", image: "candles.jpeg" },
  { name: "Ceramics", image: "ceramic.jpeg" },
  { name: "Home Essentials", image: "homeess.jpeg" },
];

// Use exact backend category names to match backend expectations
const categoryMap = {
  jewelry: "Jewelry",
  crochet: "Crochet",
  candles: "Candles",
  ceramic: "Ceramics",
  "home essentials": "Home Essential", // singular as in your old code
};

const ShopByCategory = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 414);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 414);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShopNow = (categoryName) => {
    const backendCategory = categoryMap[categoryName.toLowerCase()] || categoryName;
    navigate(`/category-products?category=${encodeURIComponent(backendCategory)}`);
  };

  // Mobile: render all categories in one column
  if (isMobile) {
    return (
      <section className={styles["shop-by-category"]}>
        <h2 className={styles["section-title"]}>Shop by Category</h2>
        <div className={styles["category-row"]}>
          {categories.map((category, idx) => {
            return (
              <div
                key={idx}
                className={`${styles["category-card"]} ${styles["mobile-card"]}`}
                style={{ backgroundImage: `url(${category.image})` }}
                onClick={() => handleShopNow(category.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleShopNow(category.name);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className={styles.overlay}>
                  <h3 className={styles["category-name"]}>{category.name}</h3>
                  <button
                    className={styles["shop-button"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopNow(category.name);
                    }}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Desktop / Tablet: two rows, first row 2 large cards, second row 3 small cards
  return (
    <section className={styles["shop-by-category"]}>
      <h2 className={styles["section-title"]}>Shop by Category</h2>

      {/* First row - 2 larger cards */}
      <div className={`${styles["category-row"]} ${styles["large-row"]}`}>
        {categories.slice(0, 2).map((category, idx) => (
          <div
            key={idx}
            className={`${styles["category-card"]} ${styles["large-card"]}`}
            style={{ backgroundImage: `url(${category.image})` }}
            onClick={() => handleShopNow(category.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleShopNow(category.name);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.overlay}>
              <h3 className={styles["category-name"]}>{category.name}</h3>
              <button
                className={styles["shop-button"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopNow(category.name);
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Second row - 3 smaller cards */}
      <div className={`${styles["category-row"]} ${styles["small-row"]}`}>
        {categories.slice(2).map((category, idx) => (
          <div
            key={idx + 2}
            className={`${styles["category-card"]} ${styles["small-card"]}`}
            style={{ backgroundImage: `url(${category.image})` }}
            onClick={() => handleShopNow(category.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleShopNow(category.name);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.overlay}>
              <h3 className={styles["category-name"]}>{category.name}</h3>
              <button
                className={styles["shop-button"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopNow(category.name);
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;
