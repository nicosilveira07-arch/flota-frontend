import http from "./http";

export const cambiarPassword = async (data) => {
  const res = await http.put(
    "/auth/perfil/password",
    data
  );

  return res.data;
};