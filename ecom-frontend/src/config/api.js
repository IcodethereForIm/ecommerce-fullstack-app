const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export const buildUrl = (endpoint) => `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

export const buildStorageUrl = (path) =>{
  return path || "https://via.placeholder.com/300";
};

