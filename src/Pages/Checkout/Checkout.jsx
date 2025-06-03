import React, { useState } from "react";
import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";
import axios from "axios";

const egyptGovernorates = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Monufia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];


const Checkout = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();

  const increaseQuantity = (productId) => {
    const item = cart.find((item) => (item._id || item.id) === productId);
    if (!item) return;
    const stock = item.inStock ?? item.instock ?? item.stock ?? Infinity;
    if ((item.quantity || 1) < stock) {
      updateQuantity(productId, (item.quantity || 1) + 1);
    }
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((item) => (item._id || item.id) === productId);
    if (!item) return;
    if ((item.quantity || 1) > 1) {
      updateQuantity(productId, (item.quantity || 1) - 1);
    }
  };

  const [form, setForm] = useState({
    email: "",
    country: "Egypt",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    governorate: "",
    postalCode: "",
    phone: "",
    paymentMethod: "Cash on Delivery",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address";
        return "";
      case "firstName":
        if (!value.trim()) return "First name is required";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        return "";
      case "address":
        if (!value.trim()) return "Address is required";
        return "";
      case "city":
        if (!value.trim()) return "City is required";
        return "";
      case "governorate":
        if (!value) return "Governorate is required";
        return "";
      case "postalCode":
        if (value.trim() && !/^\d{5}$/.test(value))
          return "Postal code must be 5 digits";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^01[0-9]{9}$/.test(value)) return "Invalid Egyptian phone number";
        return "";
      case "cardNumber":
        if (form.paymentMethod === "Card") {
          if (!value.trim()) return "Card number is required";
          if (!/^\d{13,19}$/.test(value.replace(/\s+/g, "")))
            return "Invalid card number";
        }
        return "";
      case "cardName":
        if (form.paymentMethod === "Card" && !value.trim())
          return "Cardholder name is required";
        return "";
      case "expiry":
        if (form.paymentMethod === "Card") {
          if (!value.trim()) return "Expiry date is required";
          if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value))
            return "Expiry date must be MM/YY";
          const [month, year] = value.split("/");
          const expiryDate = new Date(`20${year}`, month);
          const now = new Date();
          if (expiryDate < now) return "Card expiry date must be in the future";
        }
        return "";
      case "cvv":
        if (form.paymentMethod === "Card") {
          if (!value.trim()) return "CVV is required";
          if (!/^\d{3,4}$/.test(value)) return "CVV must be 3 or 4 digits";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const orderData = {
          shippingInfo: {
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            governorate: form.governorate,
            postalCode: form.postalCode,
            phone: form.phone,
            country: form.country,
          },
          paymentMethod: form.paymentMethod,
          totalPrice,
          items: cart.map(item => ({
            product: item._id || item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          status: "pending", // or "processing"
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
          orderData
        );


        alert("Order placed successfully!");
        navigate("/");
      } catch (error) {
        console.error("Order submission failed:", error);
        alert("Failed to place order. Please try again.");
      }
    } else {
      alert("Please fix the errors in the form before submitting.");
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <form onSubmit={handleSubmit} className={styles.checkoutForm} noValidate>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? styles.inputError : ""}
          />
          {errors.email && (
            <span className={styles.errorMsg}>{errors.email}</span>
          )}
        </div>

        <h2 className={styles.sectionTitle}>Delivery</h2>
        <div className={styles.formGroup}>
          <label>Country/Region:</label>
          <input type="text" name="country" value="Egypt" readOnly />
        </div>

        <div className={styles.formGroup}>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={errors.firstName ? styles.inputError : ""}
          />
          {errors.firstName && (
            <span className={styles.errorMsg}>{errors.firstName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={errors.lastName ? styles.inputError : ""}
          />
          {errors.lastName && (
            <span className={styles.errorMsg}>{errors.lastName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className={errors.address ? styles.inputError : ""}
          />
          {errors.address && (
            <span className={styles.errorMsg}>{errors.address}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Apartment (optional):</label>
          <input
            type="text"
            name="apartment"
            value={form.apartment}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className={errors.city ? styles.inputError : ""}
          />
          {errors.city && (
            <span className={styles.errorMsg}>{errors.city}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Governorate:</label>
          <select
            name="governorate"
            value={form.governorate}
            onChange={handleChange}
            className={`${styles.selectInput} ${errors.governorate ? styles.inputError : ""
              }`}
            aria-label="Select your governorate"
          >
            <option value="">Select Governorate</option>
            {egyptGovernorates.map((gov, idx) => (
              <option key={idx} value={gov}>
                {gov}
              </option>
            ))}
          </select>
          {errors.governorate && (
            <span className={styles.errorMsg}>{errors.governorate}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Postal Code (optional):</label>
          <input
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            className={errors.postalCode ? styles.inputError : ""}
          />
          {errors.postalCode && (
            <span className={styles.errorMsg}>{errors.postalCode}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={errors.phone ? styles.inputError : ""}
          />
          {errors.phone && (
            <span className={styles.errorMsg}>{errors.phone}</span>
          )}
        </div>

        <h2 className={styles.sectionTitle}>Payment</h2>

        <div className={styles.formGroup}>
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className={styles.selectInput}
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {form.paymentMethod === "Card" && (
          <>
            <div className={styles.formGroup}>
              <label>Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                className={errors.cardNumber ? styles.inputError : ""}
              />
              {errors.cardNumber && (
                <span className={styles.errorMsg}>{errors.cardNumber}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Cardholder Name:</label>
              <input
                type="text"
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                className={errors.cardName ? styles.inputError : ""}
              />
              {errors.cardName && (
                <span className={styles.errorMsg}>{errors.cardName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Expiry Date (MM/YY):</label>
              <input
                type="text"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                className={errors.expiry ? styles.inputError : ""}
              />
              {errors.expiry && (
                <span className={styles.errorMsg}>{errors.expiry}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>CVV:</label>
              <input
                type="password"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                className={errors.cvv ? styles.inputError : ""}
              />
              {errors.cvv && (
                <span className={styles.errorMsg}>{errors.cvv}</span>
              )}
            </div>
          </>
        )}

        <h2 className={styles.sectionTitle}>Order Summary</h2>
        <ul className={styles.orderSummary}>
          {cart.map((item) => {
            const productId = item._id || item.id;
            const stock =
              item.inStock ?? item.instock ?? item.stock ?? Infinity;
            const imageSrc = Array.isArray(item.images)
              ? item.images[0]
              : item.images || item.thumbnail;

            return (
              <li key={productId} className={styles.summaryItem}>
                <div className={styles.itemDetails}>
                  <img src={imageSrc} alt={item.title} />

                  <div className={styles.infoWrapper}>
                    <div className={styles.titleAndPrice}>
                      <span className={styles.productTitle}>{item.title}</span>
                      <span className={styles.productPrice}>
                        <span className={styles.priceContainer}>
                          {item.price.toFixed(2)}
                          <span className={styles.currency}>EGP</span>
                        </span>
                      </span>
                    </div>

                    <span className={styles.quantityNumber}>
                      {item.quantity}
                    </span>

                    <span className={styles.productTotalPrice}>
                      {(item.price * item.quantity).toFixed(2)}{" "}
                      <span className={styles.currency}>EGP</span>
                    </span>

                    <div className={styles.qtyControls}>
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity === 1
                            ? removeFromCart(productId)
                            : decreaseQuantity(productId)
                        }
                        className={styles.qtyButton}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(productId)}
                        className={styles.qtyButton}
                        disabled={item.quantity >= stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li className={styles.total}>
            <strong>Total</strong>{" "}
            <strong>
              <span className={styles.priceContainer}>
                {totalPrice.toFixed(2)}
                <span className={styles.currency}>EGP</span>
              </span>
            </strong>
          </li>
        </ul>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={Object.values(errors).some((e) => e) || cart.length === 0}
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;