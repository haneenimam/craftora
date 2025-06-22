import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../Apis/config.js";
import styles from "./EditProducts.module.css";

const categories = [
  { key: "jewelry", image: "jewelry.jpeg" },
  { key: "crochet", image: "crochet.jpeg" },
  { key: "candles", image: "candles.jpeg" },
  { key: "ceramic", image: "ceramic.jpeg" },
  { key: "home_essential", image: "homeess.jpeg" },
];

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    title: "",
    price: "",
    description: "",
    category: "",
    stock: 0,
    image: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/products?page=${page}`);
      const data = res.data;

      const fetchedProducts = Array.isArray(data.products)
        ? data.products
        : Array.isArray(data)
        ? data
        : [];

      setProducts(fetchedProducts);
      setHasMore(fetchedProducts.length === 20);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error fetching products");
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");

    if (newProduct.name && newProduct.price) {
      try {
        const payload = {
          ...newProduct,
          title: newProduct.name,
        };

        const res = await axiosInstance.post("/api/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts([...products, res.data]);
        setNewProduct({
          name: "",
          title: "",
          price: "",
          description: "",
          category: "",
          stock: 0,
          image: "",
        });
      } catch (err) {
        console.error("Error adding product:", err);
        setError("Error adding product");
      }
    } else {
      setError("Name and price are required");
    }
  };

  const handleEdit = (index) => {
    setNewProduct(products[index]);
    setEditIndex(index);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const productToUpdate = products[editIndex];

    try {
      const payload = {
        ...newProduct,
        title: newProduct.name,
      };

      const res = await axiosInstance.put(
        `/api/products/${productToUpdate._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = [...products];
      updated[editIndex] = res.data;
      setProducts(updated);
      setNewProduct({
        name: "",
        title: "",
        price: "",
        description: "",
        category: "",
        stock: 0,
        image: "",
      });
      setEditIndex(null);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Error updating product");
    }
  };

  return (
    <div className={`container ${styles.productsPage}`}>
      <h2 className="text-center mb-4">Products Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading products...</div>}

      <div className={`p-3 mb-4 border rounded ${styles.formSection}`}>
        <h5 className="mb-3">
          {editIndex === null ? "Add New Product" : "Edit Product"}
        </h5>

        <input
          type="text"
          className={`form-control mb-2 ${styles.formControl}`}
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <input
          type="number"
          className={`form-control mb-2 ${styles.formControl}`}
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <input
          type="text"
          className={`form-control mb-2 ${styles.formControl}`}
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        <select
          className={`form-control mb-2 ${styles.formControl}`}
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.key.charAt(0).toUpperCase() +
                cat.key.slice(1).replace("_", " ")}
            </option>
          ))}
        </select>

        <input
          type="number"
          className={`form-control mb-2 ${styles.formControl}`}
          placeholder="Stock"
          min="0"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: Math.max(0, e.target.value) })
          }
        />

        <input
          type="text"
          className={`form-control mb-2 ${styles.formControl}`}
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />

        {editIndex === null ? (
          <button
            className={`btn w-100 ${styles.customAddBtn}`}
            onClick={handleAdd}
          >
            Add Product
          </button>
        ) : (
          <button
            className={`btn w-100 ${styles.btnWarning}`}
            onClick={handleUpdate}
          >
            Update Product
          </button>
        )}
      </div>

      <table
        className={`table table-hover table-bordered text-center ${styles.tableStyle}`}
      >
        <thead className={styles.tableHead}>
          <tr>
            <th>Name</th>
            <th>Price (EGP)</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tableHover}>
          {products.length > 0 ? (
            products.map((p, i) => (
              <tr key={p._id || i}>
                <td>{p.name || p.title}</td>
                <td>{p.price}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      width="50"
                      height="50"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${styles.btnWarning}`}
                    onClick={() => handleEdit(i)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-muted">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.paginationWrapper}>
        <button
          className={styles.paginationBtn}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className={styles.pageNumber}>Page {page}</span>

        <button
          className={styles.paginationBtn}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductsPage;
