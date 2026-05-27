import { useEffect, useState } from "react";

import {
  getReservas,
  aprobarReserva,
  rechazarReserva
} from "../api/reservas.api";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const data = await getReservas();

      setReservas(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     APROBAR
  ========================= */

  const aprobar = async (id) => {
    const confirmar = window.confirm(
      "¿Aprobar reserva?"
    );

    if (!confirmar) return;
    try {
      await aprobarReserva(id);

      await cargarReservas();
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     RECHAZAR
  ========================= */

  const rechazar = async (id) => {
    const motivo = prompt(
      "Motivo del rechazo"
    );

    if (!motivo) return;

    try {
      await rechazarReserva(id, motivo);

      await cargarReservas();
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     FINALIZAR
  ========================= */



  /* =========================
     FILTROS
  ========================= */

  const reservasFiltradas =
    reservas.filter((r) => {
      const coincideBusqueda =
        r.marca
          ?.toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        r.modelo
          ?.toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        r.nombre
          ?.toLowerCase()
          .includes(busqueda.toLowerCase());

      const coincideEstado =
        filtroEstado === "" ||
        r.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-gray-800">
          Reservas
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de solicitudes de vehículos
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-5 rounded-3xl shadow-xl">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            className="
              border border-gray-200
              rounded-2xl p-3 outline-none
            "
          />

          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(
                e.target.value
              )
            }
            className="
              border border-gray-200
              rounded-2xl p-3 outline-none
            "
          >
            <option value="">
              Todos los estados
            </option>

            <option value="PENDIENTE">
              Pendiente
            </option>

            <option value="APROBADA">
              Aprobada
            </option>

            <option value="RECHAZADA">
              Rechazada
            </option>

            <option value="FINALIZADA">
              Finalizada
            </option>
          </select>

        </div>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr className="text-left">

              <th className="p-4">
                Vehículo
              </th>

              <th className="p-4">
                Usuario
              </th>

              <th className="p-4">
                Fecha
              </th>

              <th className="p-4">
                Horario
              </th>

              <th className="p-4">
                Motivo
              </th>

              <th className="p-4">
                Estado
              </th>
               <th className="p-4">
                Responsable</th>

              <th className="p-4">
                Acciones
              </th>
              

            </tr>
          </thead>

          <tbody>

            {reservasFiltradas.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
                  className="
                    p-10 text-center
                    text-gray-400
                  "
                >
                  No hay reservas
                </td>
              </tr>
            )}

            {reservasFiltradas.map((r) => (
              <tr
                key={r.id}
                className="
                  border-t border-gray-100
                "
              >
                <td className="p-4">
                  <div>
                    <p className="font-bold">
                      {r.marca}
                    </p>

                    <p className="text-sm text-gray-500">
                      {r.modelo}
                    </p>
                  </div>
                </td>

                <td className="p-4">
                    {r.solicitante}
                </td>

                <td className="p-4">
                  {new Date(r.fecha).toLocaleDateString()}
                </td>
                

                <td className="p-4">
                  {r.hora_desde} -{" "}
                  {r.hora_hasta}
                </td>

                <td className="p-4 max-w-xs">
                  {r.motivo}

                  {r.motivo_rechazo && (
                    <p className="text-red-500 text-xs mt-2">
                      Rechazo: {r.motivo_rechazo}
                    </p>
                  )}
                </td>
                <td className="p-4">
                  {r.aprobado_por_nombre && (
                    <p className="text-green-600 font-semibold text-sm">
                      Aprobado por: {r.aprobado_por_nombre}
                    </p>
                  )}
                
                  {r.rechazado_por_nombre && (
                    <p className="text-red-600 font-semibold text-sm">
                      Rechazado por: {r.rechazado_por_nombre}
                    </p>
                  )}
                
                  {!r.aprobado_por_nombre && !r.rechazado_por_nombre && (
                    <p className="text-gray-400 text-sm">
                      Pendiente
                    </p>
                  )}
                </td>

                <td className="p-4">

                  {r.estado ===
                    "PENDIENTE" && (
                    <span
                      className="
                        bg-yellow-100
                        text-yellow-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-bold
                      "
                    >
                      PENDIENTE
                    </span>
                  )}

                  {(
                    user?.rol === "ingeniero" ||
                    user?.rol === "administrador"
                  ) &&
                  r.estado === "APROBADA" && (
                    <span
                      className="
                        bg-green-100
                        text-green-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-bold
                      "
                    >
                      APROBADA
                    </span>
                  )}

                  {r.estado ===
                    "RECHAZADA" && (
                    <span
                      className="
                        bg-red-100
                        text-red-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-bold
                      "
                    >
                      RECHAZADA
                    </span>
                  )}

                  {r.estado ===
                    "FINALIZADA" && (
                    <span
                      className="
                        bg-blue-100
                        text-blue-700
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-bold
                      "
                    >
                      FINALIZADA
                    </span>
                  )}

                </td>

                <td className="p-4">

                  <div className="flex gap-2 flex-wrap">

                    {(user?.rol ===
                      "ingeniero" ||
                      user?.rol ===
                        "administrador") &&
                      r.estado ===
                        "PENDIENTE" && (
                        <>
                          <button
                            onClick={() =>
                              aprobar(r.id)
                            }
                            className="
                              bg-green-600
                              hover:bg-green-700
                              text-white
                              px-4 py-2
                              rounded-xl
                              text-sm
                            "
                          >
                            Aprobar
                          </button>

                          <button
                            onClick={() =>
                              rechazar(r.id)
                            }
                            className="
                              bg-red-600
                              hover:bg-red-700
                              text-white
                              px-4 py-2
                              rounded-xl
                              text-sm
                            "
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                  </div>

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}