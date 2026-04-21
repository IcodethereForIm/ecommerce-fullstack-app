import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

export const getFilteredProducts = async (source = {}, limit) => {
  let url = api(`/products`);

  const params = new URLSearchParams();

  if (source.gender) {
    params.append("gender", source.gender);
  }

  if (source.subcategory) {
    params.append("subcategory", source.subcategory);
  }

  if (source.type) {
    params.append("type", source.type);
  }

  if (limit) {
    params.append("limit", limit);
  }

  if ([...params].length) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
};