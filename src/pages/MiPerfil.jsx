import { useState } from "react";
import { cambiarPassword } from "../api/perfil.api";

export default function MiPerfil() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const guardar = async (e) => {
    e.preventDefault();

    if (passwordNueva !== confirmacion) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await cambiarPassword({
        passwordActual,
        passwordNueva
      });

      alert(res.message);

      setPasswordActual("");
      setPasswordNueva("");
      setConfirmacion("");

    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Error al actualizar contraseña"
      );
    }
  };

  return (
  <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 rounded-2xl">

    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        Gestión de Perfil
      </h1>

      <form
        onSubmit={guardar}
        className="space-y-5"
      >

        <div>
          <label className="block mb-2 font-medium">
            Contraseña actual
          </label>

          <input
            type="password"
            value={passwordActual}
            onChange={(e) =>
              setPasswordActual(e.target.value)
            }
            className="w-full border rounded-xl p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Nueva contraseña
          </label>

          <input
            type="password"
            value={passwordNueva}
            onChange={(e) =>
              setPasswordNueva(e.target.value)
            }
            className="w-full border rounded-xl p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Confirmar contraseña
          </label>

          <input
            type="password"
            value={confirmacion}
            onChange={(e) =>
              setConfirmacion(e.target.value)
            }
            className="w-full border rounded-xl p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Cambiar contraseña
        </button>

      </form>

    </div>

  </div>
);
}