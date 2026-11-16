import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/products"; // apne backend ka URL

/* ---------------- ADD PRODUCT FORM ---------------- */
function AddProduct({ onAdd }) {
  const [form, setForm] = useState({
    productId: "",
    name: "",
    price: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ productId: "", name: "", price: "", category: "" });
  };

  return (
    <div style={s.page}>
      <form onSubmit={handleSubmit} style={s.card}>
        <h2 style={s.title}>Add New Product</h2>
        <p style={s.subtitle}>Enter your product details below</p>

        <label style={s.label}>Product ID</label>
        <input style={s.input} name="productId" value={form.productId}
          onChange={handleChange} placeholder="Enter product ID" required />

        <label style={s.label}>Product Name</label>
        <input style={s.input} name="name" value={form.name}
          onChange={handleChange} placeholder="Enter product name" required />

        <label style={s.label}>Price</label>
        <input style={s.input} name="price" type="number" value={form.price}
          onChange={handleChange} placeholder="Enter product price" required />

        <label style={s.label}>Category</label>
        <input style={s.input} name="category" value={form.category}
          onChange={handleChange} placeholder="Enter product category" required />

        <button type="submit" style={s.button}>Add Product</button>
      </form>
    </div>
  );
}

/* ---------------- PRODUCT LIST ---------------- */
function ProductList({ products }) {
  return (
    <div style={s.page}>
      <div style={{ ...s.card, maxWidth: "900px" }}>
        <h2 style={s.title}>Product List</h2>

        {products.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            Abhi koi product nahi hai.
          </p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Price</th>
                <th style={s.th}>Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id || p.productId || i}>
                  <td style={s.td}>{p.productId}</td>
                  <td style={s.td}>{p.name}</td>
                  <td style={s.td}>{p.price}</td>
                  <td style={s.td}>{p.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
function App() {
  const [page, setPage] = useState("add");
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct) => {
    try {
      await axios.post(API, newProduct);
      await fetchProducts();
      setPage("list");
    } catch (err) {
      console.error("Add error:", err);
      alert("Product add nahi hua, console (F12) check karo");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1effa" }}>
      <nav style={s.nav}>
        <h2 style={{ margin: 0, color: "#fff" }}>Product Manager</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={page === "add" ? s.navBtnActive : s.navBtn}
            onClick={() => setPage("add")}
          >
            Add Product
          </button>
          <button
            style={page === "list" ? s.navBtnActive : s.navBtn}
            onClick={() => setPage("list")}
          >
            Product List
          </button>
        </div>
      </nav>

      {page === "add" ? (
        <AddProduct onAdd={handleAddProduct} />
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const s = {
  nav: {
    background: "#222244", padding: "18px 60px", display: "flex",
    justifyContent: "space-between", alignItems: "center",
  },
  navBtn: {
    background: "#3b3d5c", color: "#fff", border: "none",
    padding: "12px 22px", borderRadius: "8px", cursor: "pointer", fontSize: "15px",
  },
  navBtnActive: {
    background: "#6c5ce7", color: "#fff", border: "none",
    padding: "12px 22px", borderRadius: "8px", cursor: "pointer", fontSize: "15px",
  },
  page: { display: "flex", justifyContent: "center", padding: "60px 20px" },
  card: {
    background: "#fff", width: "100%", maxWidth: "540px", padding: "40px",
    borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column", boxSizing: "border-box",
  },
  title: { textAlign: "center", margin: 0, color: "#1f1d3d" },
  subtitle: { textAlign: "center", color: "#666", fontSize: "14px", marginBottom: "24px" },
  label: { fontWeight: "600", fontSize: "14px", marginTop: "14px", marginBottom: "6px", color: "#1f1d3d" },
  input: { padding: "14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none" },
  button: {
    marginTop: "24px", padding: "14px", background: "#7452d6", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "24px" },
  th: { textAlign: "left", padding: "12px", background: "#f1effa", color: "#1f1d3d", borderBottom: "2px solid #ddd" },
  td: { padding: "12px", borderBottom: "1px solid #eee" },
};

export default App;