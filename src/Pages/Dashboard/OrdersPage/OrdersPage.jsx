import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./OrdersPage.module.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/orders/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className={styles.ordersPageContainer}>
      <h2 className="mb-4">View Orders</h2>
      <table className={`table table-striped ${styles.customTable}`}>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Email</th>
            <th>Product(s)</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.user?.email}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.product._id}>{item.product.name}</div>
                  ))}
                </td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.product._id}>{item.quantity}</div>
                  ))}
                </td>
                <td>{order.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersPage;
