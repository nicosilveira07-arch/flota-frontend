import http from "../api/http";

export const loginRequest = async (email, password) => {
  try {
    const res = await http.post("/auth/login", {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Error inesperado en login";

    throw new Error(message);
  }
};