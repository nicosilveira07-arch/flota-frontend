import { useState, useRef, useEffect } from "react";
import {
  FaCar,
  FaClipboardList,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaHome,
  FaBars,
} from "react-icons/fa";

import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import NotificationBell from "../components/ui/NotificationBell";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuUsuario, setMenuUsuario] = useState(false);
  const menuRef = useRef(null);

  const usuario = JSON.parse(localStorage.getItem("user")) || {};
  const rol = (usuario?.rol || "").toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuUsuario(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const puedeVerVehiculos = [
    "ADMINISTRADOR",
    "INGENIERO",
    "PISTERO",
  ].includes(rol);

  const puedeVerUsuarios = ["INGENIERO"].includes(rol);

  const menu = [
    { name: "Inicio", path: "/", icon: <FaHome /> },

    ...(puedeVerVehiculos
      ? [{ name: "Vehículos", path: "/vehiculos", icon: <FaCar /> }]
      : []),

    {
      name: "Operativos",
      path: "/operativos",
      icon: <FaClipboardList />,
    },

    {
      name: "Reservas",
      path: "/reservas",
      icon: <FaCalendarAlt />,
    },

    ...(puedeVerUsuarios
      ? [{ name: "Usuarios", path: "/usuarios", icon: <FaUsers /> }]
      : []),
  ];

  const titulo =
    menu.find((m) => m.path === location.pathname)?.name ||
    "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#001B48] text-white flex flex-col shadow-2xl">

        {/* LOGO */}
        <div className="px-6 py-7 border-b border-blue-900">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
              <FaCar className="text-2xl" />
            </div>

            <div>
              <h1 className="text-xl font-black">
                GUARDIA REPUBLICANA
              </h1>
              <p className="text-sm text-blue-100">
                FLOTA VEHICULAR
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-medium
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-blue-100 hover:bg-blue-900"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-24 bg-white border-b px-8 flex items-center justify-between">

          <div className="flex items-center gap-5">
            <FaBars className="text-gray-600 text-2xl" />

            <div>
              <h1 className="text-2xl font-black text-gray-800">
                {titulo}
              </h1>

              <p className="text-sm text-gray-500">
                Gestión operativa de flota
              </p>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-6">

            <NotificationBell />

            <div
              className="relative"
              ref={menuRef}
            >
              <button
                onClick={() =>
                  setMenuUsuario(!menuUsuario)
                }
                className="flex items-center gap-4 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
              >
                <img
                  src={
                    usuario?.foto ||
                    "https://i.pravatar.cc/150?img=12"
                  }
                  alt="Usuario"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                />

                <div className="text-left">
                  <p className="font-bold text-gray-800">
                    {`${usuario?.nombre || ""} ${
                      usuario?.apellido || ""
                    }`.trim()}
                  </p>

                  <p className="text-sm text-gray-500 uppercase">
                    {rol}
                  </p>
                </div>
              </button>

              {menuUsuario && (
                <div className="absolute right-0 top-20 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <button
                    onClick={cerrarSesion}
                    className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 transition"
                  >
                    <FaSignOutAlt />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* PAGE */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}