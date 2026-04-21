import { useState, useEffect } from "react";
//import { getCategories,createCategory,deleteCategory } from "./Services/AdminServices";
import { getCategories,createCategory,deleteCategory } from "../../services/ProductCategoryService";

function CategoryAdmin() {
  
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  // Fetch categories from backend
  const fetchCategories = async () => {
    
    const data = await getCategories()
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    
    await createCategory({ name, parent_id: parentId || null },token)

    setName("");
    setParentId("");
    fetchCategories(); // refresh category list
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("auth_token");
    
    await deleteCategory(id,token)
    fetchCategories(); // refresh category list
  };

  return (
    <div>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">No Parent</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      <h3>Category List</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Parent</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.parent ? cat.parent.name : "-"}</td>
              <td>{cat.slug}</td>
              <td>
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryAdmin;