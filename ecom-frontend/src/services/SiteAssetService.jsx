import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

export const getImages = async () => {
  const res = await fetch(api(`/images`));
  if (!res.ok) throw new Error("Failed to fetch images");
  return res.json();
};

export const getAssets = async (section, key) => {
  const res = await fetch(api(`/site-assets/${section}/${key}`));
  if (!res.ok) throw new Error("Failed to fetch assets");
  return res.json();
};

export const uploadSiteAsset = async (
  { section, key, assetKey, selectedImages },
  token
) => {
  const formData = new FormData();

  formData.append("section", section);
  formData.append("key", key);
  formData.append("asset_key", assetKey);

  selectedImages.forEach((img, index) => {
    formData.append(`image_ids[${index}]`, img.id);
  });

  const res = await fetch(api(`/admin/site-assets`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return res.json();
};

export const deleteSiteAsset = async (id, token) => {
  const res = await fetch(api(`/admin/site-assets/${id}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Delete failed");
};

export const getSectionsBySlug = async (slug) => {
  const res = await fetch(
    api(`/site-assets/sections/${slug}`)
  );

  if (!res.ok) throw new Error("Failed to fetch sections");

  return res.json();
};