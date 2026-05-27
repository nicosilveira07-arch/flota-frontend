import { useState } from "react";
import { login } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Login() {
  const navigate = useNavigate();

  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (!cedula || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const data = await login(cedula, password);

      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/");
      } else {
        setError("Respuesta inválida del servidor");
      }

    } catch (err) {
      setError(
        err?.response?.data?.message || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* TITULO */}
        <h2 className="text-3xl font-black text-center text-gray-800">
          CONTROL DE FLOTA VEHICULAR
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Acceso al panel operativo
        </p>

        {/* FORM */}
        <form onSubmit={iniciarSesion} className="space-y-4">

          {/* CÉDULA */}
          <input
            type="text"
            placeholder="Cédula"
            className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ERROR */}
          {error && (
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-3 rounded-2xl font-bold transition"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          SOLICITAR USUARIO AL AREA DE SISTEMAS
        </p>

      </div>
    </div>
  );
}

export default Login;