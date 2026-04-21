import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

//Get Categories >>
export const getCategories = async ()=>{
    const res = await fetch(api("/categories"))
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

//Create Categories >>
export const createCategory = async (data, token) => {
    const res = await fetch(api("/admin/categories"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

//Delete Category >>
export const deleteCategory = async (id, token) => {
  const res = await fetch(api(`/admin/categories/${id}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete category");
};