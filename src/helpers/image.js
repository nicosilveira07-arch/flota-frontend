const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL?.replace("/api", "");

export const getImageUrl = (img) => {
  if (!img) return "https://placehold.co/600x400?text=Vehiculo";

  return img.startsWith("http")
    ? img
    : `${API_BASE}${img}`;
};