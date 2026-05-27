import http from "./http";

/* OBTENER NOTIFICACIONES */
export const getNotificaciones = async () => {
  const res = await http.get("/notificaciones");
  return res.data;
};

/* MARCAR COMO LEÍDA */
export const marcarLeida = async (id) => {
  const res = await http.put(`/notificaciones/${id}/leida`);
  return res.data;
};

/* ELIMINAR NOTIFICACIÓN */
export const eliminarNotificacion = async (id) => {
  const res = await http.delete(`/notificaciones/${id}`);
  return res.data;
};