import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

export const createProduct = async (form,token)=>{
    const formData = new FormData();

    formData.append("name", form.name);
        formData.append("product_type", form.product_type);
        formData.append("categoryId", form.categoryId);
        formData.append("price", form.price);
        formData.append("description", form.description);
        formData.append("sku", form.sku);
        formData.append("sale_price", form.sale_price);
        formData.append("is_active", form.is_active ? 1 : 0);
        formData.append("is_featured", form.is_featured ? 1 : 0);

        for (let i = 0; i < form.images.length; i++) {
            formData.append("images[]", form.images[i]);
        }

        form.sizes.forEach((item, index) => {
            formData.append(`sizes[${index}][size]`, item.size);
            formData.append(`sizes[${index}][stock]`, item.stock);
        });

        const res = await fetch(api(`/admin/product`),{
        method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                credentials: "include",
                body: formData,
    })
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
}

export const getProducts = async ()=>{
    const res = await fetch(api(`/products`));
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export const deleteProductById = async (id, token) => {
  const res = await fetch(api(`/admin/products/${id}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete product");
};

export const getProductById = async (id) => {
  const res = await fetch(api(`/products/${id}`));
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const updateProductById = async (id,form,token)=>{
    const formData = new FormData();
    formData.append("name", form.name);
        formData.append("categoryId", form.categoryId);
        formData.append("product_type", form.product_type);
        formData.append("price", form.price);
        formData.append("sale_price", form.sale_price);
        formData.append("sku", form.sku);
        formData.append("description", form.description);
        formData.append("is_active", form.is_active ? 1 : 0);
        formData.append("is_featured", form.is_featured ? 1 : 0);

        form.images.forEach((img) => {
            formData.append("images[]", img);
        });
    const res = await fetch(api(`/admin/products/${id}`), {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                body: formData
            });

    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}