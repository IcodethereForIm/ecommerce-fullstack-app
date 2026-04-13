import { useState, useEffect } from "react";

function CategoryDropdown({ value, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name}
        </option>
      ))}
    </select>
  );
}

export default CategoryDropdown;