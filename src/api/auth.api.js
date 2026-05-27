import http from "./http";

export const login = async (cedula, password) => {
  const res = await http.post("/auth/login", {
    cedula,
    password,
  });

  return res.data;
};