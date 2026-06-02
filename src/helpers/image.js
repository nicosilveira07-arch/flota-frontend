const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL?.replace("/api", "");

export const getImageUrl = (img) => {
  if (!img) {
    return "https://placehold.co/600x400?text=Vehiculo";
  }

  // Base64
  if (img.startsWith("data:image")) {
    return img;
  }

  // URL completa
  if (img.startsWith("http")) {
    return img;
  }

  // Ruta relativa
  return `${API_BASE}${img}`;
};