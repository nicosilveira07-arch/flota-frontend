import http from "./http";

// GET vehículos
export const getVehiculos = async () => {
  const res = await http.get("/vehiculos");
  return res.data;
};

// CREATE vehículo
export const createVehiculo = async (vehiculo) => {
  const res = await http.post("/vehiculos", vehiculo);
  return res.data;
};

// UPDATE vehículo
export const updateVehiculo = async (id, vehiculo) => {
  const res = await http.put(`/vehiculos/${id}`, vehiculo);
  return res.data;
};

// DELETE vehículo
export const deleteVehiculo = async (id) => {
  const res = await http.delete(`/vehiculos/${id}`);
  return res.data;
};

/* =========================
   INICIAR OPERATIVO
========================= */

export const elegirVehiculo = async (id, data) => {
  const res = await http.put(
    `/vehiculos/${id}/iniciar-operativo`,
    data
  );

  return res.data;
};

/* =========================
   FINALIZAR OPERATIVO
========================= */

export const finalizarVehiculo = async (id, data) => {
  const res = await http.put(
    `/vehiculos/${id}/finalizar`,
    data
  );

  return res.data;
};

/* =========================
   RADIAR VEHICULO
========================= */

export const radiarVehiculo = async (id, data) => {
  const res = await http.put(
    `/vehiculos/${id}`,
    data
  );

  return res.data;
};

/* =========================
   HISTORIAL
========================= */

export const getHistorialVehiculo = async (id) => {
  const res = await http.get(`/vehiculos/${id}/historial`);
  return res.data;
};