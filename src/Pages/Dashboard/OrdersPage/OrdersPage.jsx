// import React, { useEffect, useState } from "react";
// import styles from "./OrdersPage.module.css"; // ✅ import as module

// function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error] = useState(null);

//   useEffect(() => {
//     const dummyOrders = [
//       { id: 1, customer: "Alice Johnson", product: "Laptop", quantity: 1, status: "Shipped" },
//       { id: 2, customer: "Mohamed Ali", product: "Smartphone", quantity: 2, status: "Delivered" },
//       { id: 3, customer: "Sara Ahmed", product: "Headphones", quantity: 3, status: "Pending" },
//     ];
//     setTimeout(() => {
//       setOrders(dummyOrders);
//       setLoading(false);
//     }, 500);
//   }, []);

//   if (loading) return <div className="text-center mt-5">Loading...</div>;
//   if (error) return <div className="text-danger text-center">{error}</div>;

//   return (
//     <div className={styles.ordersPageContainer}>
//       <h2 className="mb-4">View Orders</h2>
//       <table className={`table table-striped ${styles.customTable}`}>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Customer</th>
//             <th>Product</th>
//             <th>Quantity</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.length > 0 ? (
//             orders.map((order, index) => (
//               <tr key={order.id}>
//                 <td>{index + 1}</td>
//                 <td>{order.customer}</td>
//                 <td>{order.product}</td>
//                 <td>{order.quantity}</td>
//                 <td>{order.status}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center">
//                 No orders found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default OrdersPage;
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
      <h2 className=""> Orders Overview</h2>
      <div className="table-responsive">
        <table className={`table ${styles.customTable}`}>
          <thead>
            <tr>
              <th>#</th>
              <th> Product</th>
              <th> Quantity</th>
              <th> Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) =>
                order.items.map((item, itemIndex) => (
                  <tr key={`${order._id}-${item.product._id}`}>
                    <td data-label="#">
                      {index + 1}
                      {itemIndex > 0 ? `.${itemIndex + 1}` : ""}
                    </td>
                    <td data-label="Product">
                      <span className={styles.productName}>{item.product.name}</span>
                    </td>
                    <td data-label="Quantity">
                      <span className={styles.quantity}>{item.quantity}</span>
                    </td>
                    {itemIndex === 0 ? (
                      <td data-label="Status" rowSpan={order.items.length} className={styles.statusCell}>
                        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                          {order.status}
                        </span>
                      </td>
                    ) : null}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersPage;
