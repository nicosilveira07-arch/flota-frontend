import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import {
  getNotificaciones,
  marcarLeida,
  eliminarNotificacion
} from "../../api/notificaciones.api";

export default function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);

  const cargar = async () => {
    try {
      const data = await getNotificaciones();
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error notificaciones:", error?.response?.status);
    }
  };

  useEffect(() => {
    let active = true;

    const cargarSeguro = async () => {
      try {
        const data = await getNotificaciones();
        if (active) setNotificaciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error notificaciones:", error?.response?.status);
      }
    };

    cargarSeguro();

    const interval = setInterval(cargarSeguro, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const marcar = async (id) => {
    try {
      await marcarLeida(id);
      cargar();
    } catch (error) {
      console.log(error);
    }
  };

  const borrar = async (id) => {
    try {
      await eliminarNotificacion(id);
      cargar();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">

      {/* BELL */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <FaBell className="text-lg text-gray-700" />
      </button>

      {/* BADGE */}
      {noLeidas > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {noLeidas}
        </div>
      )}

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">

          <div className="p-3 border-b font-bold">
            Notificaciones
          </div>

          <div className="max-h-96 overflow-auto">

            {notificaciones.length === 0 && (
              <p className="p-3 text-sm text-gray-500">
                Sin notificaciones
              </p>
            )}

            {notificaciones.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b text-sm flex justify-between items-center ${
                  n.leida ? "bg-white" : "bg-blue-50"
                }`}
              >

                <span
                  className="cursor-pointer flex-1"
                  onClick={() => marcar(n.id)}
                >
                  {n.mensaje}
                </span>

                <button
                  onClick={() => borrar(n.id)}
                  className="text-red-500 font-bold ml-3"
                >
                  ✕
                </button>

              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}