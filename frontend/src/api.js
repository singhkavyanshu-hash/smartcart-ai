export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getAuthHeaders(token) {
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "Content-Type": "application/json",
      };
}
