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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-12">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Control de Flota"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* TITULO */}
        <h1 className="text-center text-5xl font-black text-black leading-tight">
          CONTROL DE FLOTA
        </h1>

        <h2 className="text-center text-5xl font-black text-black leading-tight mb-10">
          VEHICULAR
        </h2>

        {/* FORMULARIO */}
        <form onSubmit={iniciarSesion} className="space-y-6">

          {/* CEDULA */}
          <input
            type="text"
            placeholder="👤 USUARIO"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="
              w-full
              h-16
              px-6
              text-lg
              border-2
              border-black
              rounded-xl
              outline-none
              transition-all
              duration-300
              hover:border-teal-800
              focus:border-teal-800
              focus:ring-2
              focus:ring-teal-800/20
            "
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="🔒 Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              h-16
              px-6
              text-lg
              border-2
              border-black
              rounded-xl
              outline-none
              transition-all
              duration-300
              hover:border-teal-800
              focus:border-teal-800
              focus:ring-2
              focus:ring-teal-800/20
            "
          />

          {/* ERROR */}
          {error && (
            <div className="text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          {/* BOTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-16
              bg-black
              hover:bg-teal-800
              text-white
              text-lg
              font-bold
              rounded-xl
              transition-all
              duration-300
              disabled:opacity-50
            "
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Si no tiene acceso, contacte al departamento de sistemas
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;