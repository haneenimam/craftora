import React from 'react';
import { useCart } from '../../Context/CartContext';
import { Link } from 'react-router-dom';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { cart, removeFromCart, calculateTotal, updateQuantity } = useCart();

  const handleIncrease = (product) => {
    const stock = product.inStock ?? product.stock ?? product.quantity ?? Infinity;
    if (product.quantity < stock) {
      updateQuantity(product._id || product.id, product.quantity + 1);
    }
  };

  const handleDecrease = (product) => {
    if (product.quantity > 1) {
      updateQuantity(product._id || product.id, product.quantity - 1);
    }
  };

  return (
    <div className={styles.cartPage}>
      <h2 className={styles.title}>Your Cart</h2>

      {cart.length === 0 ? (
        <p className={styles.emptyMessage}>Your cart is empty.</p>
      ) : (
        <div>
          <div className={styles.cartItems}>
            {cart.map((product) => {
              const productId = product._id || product.id;
              const imgSrc = product.image || product.images?.[0] || product.thumbnail || '/default-product.jpg';
              const stock = product.inStock ?? product.stock ?? product.quantity ?? Infinity;

              return (
                <div key={productId} className={styles.cartItem}>
                  <div className={styles.itemDetails}>
                    <img
                      src={imgSrc}
                      alt={product.title}
                      className={styles.thumbnail}
                      onError={(e) => (e.target.src = '/default-product.jpg')}
                    />
                    <div className={styles.itemText}>
                      <p className={styles.productTitle}>{product.title}</p>

                      <p className={styles.productPrice}>
                        <span className={styles.priceContainer}>
                          {product.price}
                          <span className={styles.currency}>EGP</span>
                        </span>{' '}
                        x {product.quantity}
                      </p>

                      <p className={styles.productTotalPrice}>
                        Total:{' '}
                        <span className={styles.priceContainer}>
                          {(product.price * product.quantity).toFixed(2)}
                          <span className={styles.currency}>EGP</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Group quantity controls and remove button */}
                  <div className={styles.actionsGroup}>
                    <div className={styles.quantityControl}>
                      <button onClick={() => handleDecrease(product)} disabled={product.quantity <= 1}>-</button>
                      <span>{product.quantity}</span>
                      <button onClick={() => handleIncrease(product)} disabled={product.quantity >= stock}>+</button>
                    </div>

                    <button
                      className={styles.removeButton}
                      onClick={() => removeFromCart(productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cartSummary}>
            <h4 className={styles.totalPrice}>
              Total Price:{' '}
              <span className={styles.priceContainer}>
                {calculateTotal()}
                <span className={styles.totalCurrency}>EGP</span>
              </span>
            </h4>
            <div className={styles.actions}>
              <Link to="/product-list" className={styles.continueShopping}>
                Continue Shopping
              </Link>
              <Link to="/checkout" className={styles.checkoutButton}>
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
