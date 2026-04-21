const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export const buildUrl = (endpoint) => `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

export const buildStorageUrl = (path) =>`${BASE_URL.replace(/\/$/, "")}/storage/${path.replace(/^\//, "")}`;

export default BASE_URL