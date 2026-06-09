import { useState, useRef, useEffect } from "react";
import {
  FaCar,
  FaClipboardList,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaHome,
  FaUserCog
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
    { name: "INICIO", path: "/", icon: <FaHome /> },

    ...(puedeVerVehiculos
      ? [{ name: "VEHICULOS", path: "/vehiculos", icon: <FaCar /> }]
      : []),

    {
      name: "OPERATIVOS",
      path: "/operativos",
      icon: <FaClipboardList />,
    },

    {
      name: "RESERVAS",
      path: "/reservas",
      icon: <FaCalendarAlt />,
    },

    ...(puedeVerUsuarios
      ? [{ name: "USUARIOS", path: "/usuarios", icon: <FaUsers /> }]
      : []),
  ];

  const titulo =
    menu.find((m) => m.path === location.pathname)?.name ||
    "Dashboard";

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-teal-800 text-white flex flex-col shadow-2xl">

        {/* LOGO */}
        <div className="px-6 py-7 border-b border-black/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center">
              <img
                src="/logo.ico"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-black">
                GUARDIA REPUBLICANA
              </h1>
              <p className="text-sm text-teal-100">
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
                      ? "bg-black text-white shadow-lg"
                      : "text-white/90 hover:bg-black hover:text-white"
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
<header className="h-24 bg-white border-b border-teal-100 px-8 flex items-center justify-between"></header>
          <div className="flex items-center gap-5">
            

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
                className="flex items-center gap-4 hover:bg-teal-50 px-3 py-2 rounded-xl transition"
              >
                <div className="w-14 h-14 rounded-full bg-teal-800 border-2 border-teal-700 flex items-center justify-center text-white font-bold text-lg">
                  {`${usuario?.nombre?.[0] || ""}${usuario?.apellido?.[0] || ""}`.toUpperCase()}
                </div>

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
                <div className="absolute right-0 top-20 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              
                  <button
                    onClick={() => {
                      setMenuUsuario(false);
                      navigate("/perfil");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FaUserCog />
                    Gestión de Perfil
                  </button>
                  
                  <button
                    onClick={cerrarSesion}
                    className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 transition border-t"
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