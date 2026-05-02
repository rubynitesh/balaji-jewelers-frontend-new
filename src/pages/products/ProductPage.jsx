import { useEffect, useState } from "react";
import "./product.css";
import axios from "axios";

const ProductPage = () => {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    description: "",
    weight: "",
    pricePerGram: "",
    makingCharge: "",
    gstPercentage: "",
    stockQuantity: "",
    active: true,
    categoryId: ""
  });

  // 🔹 Load Categories
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3939/api/categories");
    setCategories(res.data);
  };

  // 🔹 Load Products
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3939/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // 🔹 Handle Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : type === "number"
        ? Number(value)
        : value
    }));
  };

  // 🔹 Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditing) {
        await axios.put(
          `http://localhost:3939/api/products/${editId}`,
          formData
        );
      } else {
        await axios.post(
          "http://localhost:3939/api/products",
          formData
        );
      }

      fetchProducts();
      resetForm();

    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit
  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setEditId(product.id);
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      await axios.delete(`http://localhost:3939/api/products/${id}`);
      fetchProducts();
    }
  };

  // 🔹 Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      productCode: "",
      description: "",
      weight: "",
      pricePerGram: "",
      makingCharge: "",
      gstPercentage: "",
      stockQuantity: "",
      active: true,
      categoryId: ""
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="product-container">

      <h2>💎 Product Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="product-form">

        <input name="name" value={formData.name} placeholder="Product Name" onChange={handleChange} required />
        <input name="productCode" value={formData.productCode} placeholder="Product Code" onChange={handleChange} required />
        <input name="description" value={formData.description} placeholder="Description" onChange={handleChange} />

        <input type="number" name="weight" value={formData.weight} placeholder="Weight (grams)" onChange={handleChange} />
        <input type="number" name="pricePerGram" value={formData.pricePerGram} placeholder="Price Per Gram" onChange={handleChange} />
        <input type="number" name="makingCharge" value={formData.makingCharge} placeholder="Making Charge" onChange={handleChange} />
        <input type="number" name="gstPercentage" value={formData.gstPercentage} placeholder="GST %" onChange={handleChange} />
        <input type="number" name="stockQuantity" value={formData.stockQuantity} placeholder="Stock Quantity" onChange={handleChange} />

        {/* Category Dropdown */}
        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
          Active
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
        </button>

        {isEditing && (
          <button type="button" onClick={resetForm} className="cancel-btn">
            Cancel
          </button>
        )}

      </form>

      {/* PRODUCT TABLE */}
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Code</th>
              <th>Weight</th>
              <th>Price/Gram</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9">No Products Found</td>
              </tr>
            ) : (
              products.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.productCode}</td>
                  <td>{p.weight}</td>
                  <td>{p.pricePerGram}</td>
                  <td>{p.stockQuantity}</td>
                  <td>
                    {categories.find(c => c.id === p.categoryId)?.name || "-"}
                  </td>
                  <td>{p.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default ProductPage;
