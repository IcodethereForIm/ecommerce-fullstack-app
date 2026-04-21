import { useState, useEffect } from "react";
//import { getCategories } from "./Services/AdminServices";
import { getCategories } from "../../services/ProductCategoryService";

function CategoryDropdown({ value, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories(); // Service Api call
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
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