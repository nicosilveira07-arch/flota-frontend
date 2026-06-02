import { useEffect, useState } from "react";
import {
  FaCar,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTools,
} from "react-icons/fa";
import { getImageUrl } from "../helpers/image";
import {
  getVehiculos,
  createVehiculo,
  deleteVehiculo,
  updateVehiculo,
  elegirVehiculo,
  finalizarVehiculo,
  radiarVehiculo,
  getHistorialVehiculo,
} from "../api/vehiculos.api";
import http from "../api/http";
const EMPTY_FORM = {
  tipo: "",
  marca: "",
  modelo: "",
  matricula: "",
  anio: "",
  imagen: "",
  km_actual: 0,
};

const EMPTY_OPERATIVO_FORM = {
  operativo: "",
  observacion: "",
  kmSalida: "",
};

const EMPTY_FINALIZAR_FORM = {
  kmLlegada: "",
  observacion: "",
};

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenFile, setImagenFile] = useState(null);
  const [operativoForm, setOperativoForm] = useState(EMPTY_OPERATIVO_FORM);
  const [finalizarForm, setFinalizarForm] = useState(EMPTY_FINALIZAR_FORM);

  const [vehiculoOperativo, setVehiculoOperativo] = useState(null);
  const [vehiculoFinalizar, setVehiculoFinalizar] = useState(null);

  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);


  const [vehiculoRadiar, setVehiculoRadiar] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [vehiculoHistorial, setVehiculoHistorial] = useState(null);

  const [motivo_radiado, setmotivo_radiado] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  const usuario = JSON.parse(localStorage.getItem("user"));

  const esAdminOIngeniero =
    ["administrador", "ingeniero", "pistero"].includes(
      usuario?.rol?.toLowerCase()
    );

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      const data = await getVehiculos();
      setVehiculos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarForm = () => {
    setForm(EMPTY_FORM);
  };

  const limpiarOperativoForm = () => {
    setOperativoForm(EMPTY_OPERATIVO_FORM);
  };

  const limpiarFinalizarForm = () => {
    setFinalizarForm(EMPTY_FINALIZAR_FORM);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setVehiculoEditando(null);
    limpiarForm();
  };

  const cerrarOperativo = () => {
    setVehiculoOperativo(null);
    limpiarOperativoForm();
  };

  const cerrarFinalizar = () => {
    setVehiculoFinalizar(null);
    limpiarFinalizarForm();
  };

  const cerrarRadiar = () => {
    setVehiculoRadiar(null);
    setmotivo_radiado("");
  };

  const verHistorial = async (vehiculo) => {
    try {
      const data = await getHistorialVehiculo(vehiculo.id);
      setHistorial(Array.isArray(data) ? data : []);
      setVehiculoHistorial(vehiculo);
    } catch (error) {
      console.log(error);
      setHistorial([]);
      setVehiculoHistorial(vehiculo);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "km_actual" || name === "anio"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImagenFile(reader.result);
    };
  
    reader.readAsDataURL(file);
  };

  const handleOperativoChange = (e) => {
    const { name, value } = e.target;
    setOperativoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalizarChange = (e) => {
    const { name, value } = e.target;
    setFinalizarForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imagenUrl = imagenFile || "";
      

      await createVehiculo({
        ...form,
        imagen: imagenUrl,
        estado: "LIBRE",
      });

      await cargarVehiculos();
      limpiarForm();
      setMostrarFormulario(false);
      setImagenFile(null);

    } catch (error) {
      console.log(error);
    }
  };

  const iniciarEdicion = (vehiculo) => {
    setVehiculoEditando(vehiculo);
    setMostrarFormulario(true);
    setForm({
      tipo: vehiculo.tipo || "",
      marca: vehiculo.marca || "",
      modelo: vehiculo.modelo || "",
      matricula: vehiculo.matricula || "",
      anio: vehiculo.anio || "",
      imagen: vehiculo.imagen || "",
      km_actual: vehiculo.km_actual ?? 0,
    });
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    
    try {
      let imagenUrl = form.imagen;
    
      if (imagenFile) {
        imagenUrl = imagenFile;
      }
    
      await updateVehiculo(vehiculoEditando.id, {
        ...form,
        imagen: imagenUrl,
        estado: vehiculoEditando.estado,
        motivo_radiado: vehiculoEditando.motivo_radiado || null,
      });
    
      await cargarVehiculos();
      setVehiculoEditando(null);
      setMostrarFormulario(false);
      limpiarForm();
      setImagenFile(null);
    
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVehiculo(id);
      await cargarVehiculos();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmarElegirVehiculo = async () => {
    try {
      if (!vehiculoOperativo) return;
    
      const kmActualVehiculo = Number(vehiculoOperativo.km_actual);
      const kmSalida = Number(operativoForm.kmSalida);
    
      if (!kmSalida || Number.isNaN(kmSalida)) {
        alert("Debes ingresar un KM válido");
        return;
      }
    
      if (kmSalida < kmActualVehiculo) {
        alert(
          `El KM de salida no puede ser menor al KM actual (${kmActualVehiculo})`
        );
        return;
      }
    
      await elegirVehiculo(vehiculoOperativo.id, {
        ...vehiculoOperativo,
        operativo: operativoForm.operativo,
        observacion: operativoForm.observacion,
        kmSalida,
        estado: "EN USO",
      });
    
      cerrarOperativo();
      await cargarVehiculos();
    } catch (error) {
      alert("Error iniciando operativo");
      console.log(error);
    }
  };

  const confirmarFinalizarVehiculo = async () => {
    try {
      if (!vehiculoFinalizar) return;

      const kmSalida = Number(vehiculoFinalizar?.km_actual ?? 0);
      const kmLlegada = Number(finalizarForm.kmLlegada);

      if (!kmLlegada || Number.isNaN(kmLlegada) || kmLlegada < kmSalida) {
        alert("❌ KM inválido");
        return;
      }

      await finalizarVehiculo(vehiculoFinalizar.id, {
        kmLlegada,
        observacion: finalizarForm.observacion,
      });

      cerrarFinalizar();
      await cargarVehiculos();
    } catch (error) {
      alert(error?.response?.data?.error || "Error");
      console.log(error);
    }
  };

  const confirmarRadiarVehiculo = async () => {
    try {
      if (!vehiculoRadiar) return;

      if (!motivo_radiado.trim()) {
        alert("Debes escribir un motivo");
        return;
      }

      await radiarVehiculo(vehiculoRadiar.id, {
        tipo: vehiculoRadiar.tipo,
        marca: vehiculoRadiar.marca,
        modelo: vehiculoRadiar.modelo,
        matricula: vehiculoRadiar.matricula,
        anio: vehiculoRadiar.anio,
        km_actual: vehiculoRadiar.km_actual,
        imagen: vehiculoRadiar.imagen,
        estado: "RADIADO",
        motivo_radiado,
      });

      cerrarRadiar();
      await cargarVehiculos();
    } catch (error) {
      alert("Error al radiar vehículo");
      console.log(error);
    }
  };

  const handleReactivarVehiculo = async (vehiculo) => {
    try {
      await updateVehiculo(vehiculo.id, {
        tipo: vehiculo.tipo,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        matricula: vehiculo.matricula,
        anio: vehiculo.anio,
        km_actual: vehiculo.km_actual,
        imagen: vehiculo.imagen,
        estado: "LIBRE",
        motivo_radiado: null,
      });

      await cargarVehiculos();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Cargando vehículos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-800">Vehículos</h1>
        <p className="text-gray-500 mt-2">Gestión operativa de flota</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {vehiculos.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="relative">
              <img
                src={getImageUrl(v.imagen)}
                alt={v.modelo || "Vehiculo"}
                className="w-full h-56 object-cover"
              />

              <div className="absolute top-4 right-4">
                {v.estado === "LIBRE" && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    LIBRE
                  </span>
                )}

                {v.estado === "EN USO" && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    EN USO
                  </span>
                )}

                {v.estado === "RADIADO" && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    RADIADO
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {v.marca}
                  </h2>
                  <p className="text-gray-500">{v.modelo}</p>
                </div>

                <div className="bg-blue-100 p-3 rounded-2xl">
                  <FaCar className="text-blue-700 text-xl" />
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-5">
                <p>
                  <strong>Matrícula:</strong> {v.matricula}
                </p>
                <p>
                  <strong>Año:</strong> {v.anio}
                </p>
                <p>
                  <strong>Tipo:</strong> {v.tipo}
                </p>
                <p>
                  <strong>KM:</strong> {v.km_actual}
                </p>

                {v.estado === "RADIADO" && v.motivo_radiado && (
                  <div className="mt-3 p-3 rounded-2xl bg-red-50 border border-red-200">
                    <p className="text-xs font-bold text-red-700 mb-1">
                      MOTIVO DEL RADIADO
                    </p>
                    <p className="text-sm text-red-900">{v.motivo_radiado}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {esAdminOIngeniero && (
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(v)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Editar
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => verHistorial(v)}
                  className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-2xl font-bold"
                >
                  Ver Historial
                </button>

                {esAdminOIngeniero && (
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    Eliminar
                  </button>
                )}

              

                {v.estado !== "RADIADO" && esAdminOIngeniero && (
                  <button
                    type="button"
                    onClick={() => setVehiculoRadiar(v)}
                    className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:scale-105 transition-all duration-300 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
                  >
                    <FaTools className="text-sm" />
                    Radiar
                  </button>
                )}

                {v.estado === "RADIADO" && v.motivo_radiado && (
                  <button
                    type="button"
                    onClick={() => handleReactivarVehiculo(v)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-2xl font-bold shadow-md"
                  >
                    Reactivar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {vehiculoHistorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-3xl">
            <h2 className="text-2xl font-black mb-4">
              Historial del vehículo {vehiculoHistorial.matricula}
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {historial.length === 0 ? (
                <p>No hay historial</p>
              ) : (
                historial.map((h) => (
                  <div key={h.id} className="p-3 border rounded-xl">
                  
                    <p className="font-bold">{h.accion}</p>
                    
                    {h.solicitante_nombre && (
                      <p className="text-sm text-gray-800">
                        Reservado por: {h.solicitante_nombre}
                      </p>
                    )}

                    {h.chofer_nombre && (
                      <p className="text-sm text-blue-700 font-semibold">
                        chofer: {h.chofer_nombre}
                      </p>
                    )}

                    <p className="text-sm text-gray-600">
                      {h.observacion}
                    </p>
                  
                    <p className="text-xs text-gray-400">
                      {h.created_at}
                    </p>
                  
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setVehiculoHistorial(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {esAdminOIngeniero && !mostrarFormulario && (
        <div className="flex justify-center mt-20">
          <button
            type="button"
            onClick={() => {
              setVehiculoEditando(null);
              limpiarForm();
              setMostrarFormulario(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl shadow-2xl font-black text-lg flex items-center gap-3"
          >
            <FaPlus />
            AGREGAR VEHÍCULO
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-8">
            <h2 className="text-3xl font-black mb-6">
              {vehiculoEditando ? "Editar Vehículo" : "Nuevo Vehículo"}
            </h2>

            <form
              onSubmit={vehiculoEditando ? guardarEdicion : handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                placeholder="Tipo"
                className="border p-4 rounded-2xl"
              />

              <input
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Marca"
                className="border p-4 rounded-2xl"
              />

              <input
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Modelo"
                className="border p-4 rounded-2xl"
              />

              <input
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                placeholder="Matrícula"
                className="border p-4 rounded-2xl"
              />

              <input
                name="anio"
                value={form.anio}
                onChange={handleChange}
                placeholder="Año"
                type="number"
                className="border p-4 rounded-2xl"
              />

              <input
                name="km_actual"
                value={form.km_actual}
                onChange={handleChange}
                placeholder="KM actual"
                type="number"
                className="border p-4 rounded-2xl"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-4 rounded-2xl md:col-span-2"
              />

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold"
                >
                  Guardar
                </button>

                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-4 rounded-2xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {vehiculoRadiar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              Radiar Vehículo
            </h2>

            <p className="text-gray-500 mb-6">
              Este motivo será visible para administradores.
            </p>

            <textarea
              placeholder="Escriba el motivo del radiado..."
              value={motivo_radiado}
              onChange={(e) => setmotivo_radiado(e.target.value)}
              className="w-full h-40 border border-gray-300 rounded-2xl p-5 outline-none focus:ring-4 focus:ring-red-300 resize-none"
            />

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={confirmarRadiarVehiculo}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold hover:scale-[1.02] transition-all shadow-lg"
              >
                Confirmar Radiado
              </button>

              <button
                type="button"
                onClick={cerrarRadiar}
                className="flex-1 h-14 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vehiculos;