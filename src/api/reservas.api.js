import http from "./http";

/* =========================
   CREAR RESERVA
========================= */
export const crearReserva = async (data) => {
  const res = await http.post(
    "/reservas",
    data
  );

  return res.data;
};

/* =========================
   OBTENER RESERVAS
========================= */
export const getReservas = async () => {
  const res = await http.get(
    "/reservas"
  );

  return res.data;
};

/* =========================
   APROBAR RESERVA
========================= */
export const aprobarReserva = async (id) => {
  const res = await http.put(
    `/reservas/${id}/estado`,
    {
      estado: "APROBADA"
    }
  );

  return res.data;
};

/* =========================
   RECHAZAR RESERVA
========================= */
export const rechazarReserva = async (
  id,
  motivo_rechazo
) => {
  const res = await http.put(
    `/reservas/${id}/estado`,
    {
      estado: "RECHAZADA",
      motivo_rechazo
    }
  );

  return res.data;
};

/* =========================
   FINALIZAR RESERVA
========================= */
export const finalizarReserva = async (
  id
) => {
  const res = await http.put(
    `/reservas/${id}/estado`,
    {
      estado: "FINALIZADA"
    }
  );

  return res.data;
};