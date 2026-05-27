import http from "./http";

/* =========================
   USUARIOS API
========================= */

/* OBTENER USUARIOS */
export const getUsuarios = async () => {
  const res = await http.get("/usuarios");
  return res.data;
};

/* CREAR USUARIO */
export const crearUsuario = async (data) => {
  const res = await http.post("/usuarios", data);
  return res.data;
};

/* ELIMINAR USUARIO */
export const eliminarUsuario = async (id) => {
  const res = await http.delete(`/usuarios/${id}`);
  return res.data;
};

/* CAMBIAR ROL */
export const cambiarRolUsuario = async (id, rol) => {
  const res = await http.put(`/usuarios/${id}/rol`, { rol });
  return res.data;
};

/* RESET PASSWORD */
export const resetPassword = async (id, password) => {
  const res = await http.put(`/usuarios/${id}/password`, {
    password,
  });

  return res.data;
};