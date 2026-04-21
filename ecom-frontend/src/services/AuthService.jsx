import { buildUrl } from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

export const magicLogin = async (email) => {
  const res = await fetch(api(`/magic-login`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const getUserInfo = async (token) => {
  const res = await fetch(api("/info"), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return data;
};

export const logoutUser = async (token) => {
  const res = await fetch(api("/logout"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};