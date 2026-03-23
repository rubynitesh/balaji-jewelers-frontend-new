import { useState, useEffect } from "react";
import "./category.css";
import {
  getCategories,
  createCategory,
  deleteCategory
} from "../../service/categoryService";

const CategoryPage = () => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true
  });

  // 🔹 1️⃣ Load Categories On Page Load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);   // backend se aaya hua data
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 2️⃣ Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // 🔹 3️⃣ Save Category To Backend
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      await createCategory(formData);

      // 🔥 Save hone ke baad dobara fresh list load
      fetchCategories();

      // Form reset
      setFormData({
        name: "",
        description: "",
        active: true
      });

    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // 🔹 4️⃣ Delete Category
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategories();  // Delete ke baad refresh
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="category-container">

      <h2 className="page-title">💎 Category Management</h2>

      {/* ADD CATEGORY CARD */}
      <div className="category-card">
        <form onSubmit={handleAddCategory} className="category-form">

          <input
            type="text"
            name="name"
            placeholder="Enter Category Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            Active
          </label>

          <button type="submit">
            Add Category
          </button>

        </form>
      </div>

      {/* CATEGORY TABLE */}
      <div className="category-table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="5" className="no-data">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No Categories Found
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>{index + 1}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <span className={cat.active ? "active-badge" : "inactive-badge"}>
                      {cat.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(cat.id)}
                    >
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

export default CategoryPage;
