import { useEffect, useState } from "react";
import {
  getUsuarios,
  crearUsuario,
  eliminarUsuario,
  cambiarRolUsuario,
  resetPassword,
} from "../api/usuarios.api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);

  const [openReset, setOpenReset] = useState(false);
  const [passwordNueva, setPasswordNueva] = useState("");
  const [usuarioResetId, setUsuarioResetId] = useState(null);

  const usuarioActual = JSON.parse(localStorage.getItem("user")) || {};
  const rol = usuarioActual?.rol?.toLowerCase();
  const esIngeniero = rol === "ingeniero";

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    password: "",
    rol: "chofer",
  });

  const cargar = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      cargar();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const crear = async (e) => {
    e.preventDefault();

    await crearUsuario(form);

    setOpen(false);
    setForm({
      nombre: "",
      apellido: "",
      cedula: "",
      password: "",
      rol: "chofer",
    });

    cargar();
  };

  const eliminar = async (id) => {
    await eliminarUsuario(id);
    cargar();
  };

  const cambiarRol = async (id, rol) => {
    await cambiarRolUsuario(id, rol);
    cargar();
  };

  /* RESET PASSWORD */
  const abrirReset = (id) => {
    setUsuarioResetId(id);
    setOpenReset(true);
  };

  const confirmarReset = async () => {
    await resetPassword(usuarioResetId, passwordNueva);
    setOpenReset(false);
    setPasswordNueva("");
    cargar();
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Cédula</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Contraseña</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">

                <td className="p-3">
                  <div className="font-semibold">{u.nombre}</div>
                  <div className="text-xs text-gray-500">{u.apellido}</div>
                </td>

                <td className="p-3">{u.cedula}</td>

                <td className="p-3">
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="administrador">Administrador</option>
                    <option value="ingeniero">Ingeniero</option>
                    <option value="pistero">Pistero</option>
                    <option value="chofer">Chofer</option>
                  </select>
                </td>

                {/* CONTRASEÑA */}
                <td className="p-3">
                  {esIngeniero ? (
                    <button
                      onClick={() => abrirReset(u.id)}
                      className="text-blue-600 underline"
                    >
                      Reset contraseña
                    </button>
                  ) : (
                    <span className="text-gray-400">••••••••</span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => eliminar(u.id)}
                    className="text-red-600"
                  >
                    Eliminar
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL CREAR */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>

            <form onSubmit={crear} className="space-y-3">

              <input name="nombre" placeholder="Nombre" onChange={handleChange} className="w-full border p-2" />
              <input name="apellido" placeholder="Apellido" onChange={handleChange} className="w-full border p-2" />
              <input name="cedula" placeholder="Cédula" onChange={handleChange} className="w-full border p-2" />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2" />

              <select name="rol" onChange={handleChange} className="w-full border p-2">
                <option value="chofer">Chofer</option>
                <option value="pistero">Pistero</option>
                <option value="ingeniero">Ingeniero</option>
                <option value="administrador">Administrador</option>
              </select>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 border">
                  Cancelar
                </button>

                <button className="bg-blue-600 text-white px-3 py-1">
                  Crear
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL RESET PASSWORD */}
      {openReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-xl font-bold mb-4">Reset contraseña</h2>

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpenReset(false)} className="px-3 py-1 border">
                Cancelar
              </button>

              <button
                onClick={confirmarReset}
                className="bg-blue-600 text-white px-3 py-1"
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}