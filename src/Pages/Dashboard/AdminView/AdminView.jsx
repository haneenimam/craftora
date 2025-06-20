import { useEffect, useState } from "react";
import axiosInstance from "../../../Apis/config.js";
import styles from "./AdminView.module.css";

function AdminView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    price: "",
    category: "",
  });
  const [page, setPage] = useState(1);

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
          throw new Error("Unexpected API response structure");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching products");
        setLoading(false);
        console.error("Error fetching products:", err);
      });
  }, [page]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const token = localStorage.getItem("token");

      axiosInstance
        .delete(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          const updated = products.filter((product) => product._id !== id);
          setProducts(updated);
        })
        .catch((err) => {
          console.error("Failed to delete product:", err);
          alert("Error deleting product");
        });
    }
  };



  const handleEdit = (product) => {
    setEditId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  const handleSave = (id) => {
    const token = localStorage.getItem("token");

    axiosInstance
      .put(
        `/api/products/${id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const updated = products.map((product) =>
          product._id === id ? res.data : product
        );

        setProducts(updated);
        setEditId(null);
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        alert("Failed to update product.");
      });
  };


  const handleCancel = () => {
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-danger">
        {error}
      </div>
    );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin - Products</h1>
      <table className={`table table-bordered table-hover table-striped ${styles.table}`}>
        <thead className={styles.tableHead}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className={styles.tableCell}>{product.id}</td>

              {editId === product._id ? (
                <>
                  <td className={styles.tableCell}>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className={`form-control ${styles.input}`}
                    />
                  </td>
                  <td className={styles.tableCell}>
                    <input
                      type="number"
                      name="price"
                      value={editData.price}
                      onChange={handleChange}
                      className={`form-control ${styles.input}`}
                    />
                  </td>
                  <td className={styles.tableCell}>
                    <input
                      type="text"
                      name="category"
                      value={editData.category}
                      onChange={handleChange}
                      className={`form-control ${styles.input}`}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className={styles.tableCell}>{product.name}</td>
                  <td className={styles.tableCell}>${product.price}</td>
                  <td className={styles.tableCell}>{product.category}</td>
                </>
              )}


              <td className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  {editId === product.id ? (
                    <>
                      <button
                        onClick={() => handleSave(product._id)}
                        className={`btn ${styles.btnSuccess}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className={`btn ${styles.btnWarning}`}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className={`btn btn-sm ${styles.btnWarning}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className={`btn btn-sm ${styles.btnDanger}`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminView;
