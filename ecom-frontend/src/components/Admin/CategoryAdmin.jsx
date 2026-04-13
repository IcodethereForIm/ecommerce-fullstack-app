import { useState, useEffect } from "react";

function CategoryAdmin() {
  
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  // Fetch categories from backend
  const fetchCategories = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    await fetch("http://127.0.0.1:8000/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}`, },
      body: JSON.stringify({ name, parent_id: parentId || null }),
    });

    setName("");
    setParentId("");
    fetchCategories(); // refresh category list
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("auth_token");
    await fetch(`http://127.0.0.1:8000/api/admin/categories/${id}`, { method: "DELETE",headers: {
      "Authorization": `Bearer ${token}`,
    }, },);
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