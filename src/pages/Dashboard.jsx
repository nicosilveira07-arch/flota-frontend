import { useEffect, useState } from "react";
import { crearReserva } from "../api/reservas.api";
import { getReservas } from "../api/reservas.api";
import {
  FaCar,
  FaClipboardList,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { getImageUrl } from "../helpers/image";
import {
  getVehiculos,
  elegirVehiculo,
  finalizarVehiculo,
} from "../api/vehiculos.api";

export default function Dashboard() {
  const [vehiculos, setVehiculos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  /* =========================
   MODALS
========================= */
const [reservas, setReservas] =
  useState([]);

const [modalElegir, setModalElegir] =
  useState(false);


const [modalFinalizar, setModalFinalizar] =
  useState(false);

const [modalReserva, setModalReserva] =
  useState(false);

const [vehiculoSeleccionado,
  setVehiculoSeleccionado] =
  useState(null);

const [filtroMatricula, setFiltroMatricula] = useState("");
const [filtroEstado, setFiltroEstado] = useState("");

/* =========================
   FORM OPERATIVO
========================= */

const [operativoForm, setOperativoForm] =
  useState({
    operativo: "",
    kmSalida: "",
    observacion: "",
  });

/* =========================
   FORM FINALIZAR
========================= */

const [finalizarForm, setFinalizarForm] =
  useState({
    kmLlegada: "",
    observacion: "",
  });

/* =========================
   FORM RESERVA
========================= */

const [reservaForm, setReservaForm] =
  useState({
    fecha: "",
    hora_desde: "",
    hora_hasta: "",
    motivo: "",
  });
  

  useEffect(() => {
    cargarVehiculos();
    cargarReservas();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const data = await getVehiculos();
      console.log("VEHICULOS COMPLETO:", data);
      console.log("PRIMER VEHICULO:", data[0]);

      console.log("VEHICULOS:", data);

      const vehiculosUnicos = Array.from(
        new Map(
          data.map((v) => [v.id, v])
        ).values()
        
      );
      
      setVehiculos(vehiculosUnicos);

    } catch (error) {
      console.log(error);
    }
  };
  const cargarReservas = async () => {
    try {

      const data =
        await getReservas();

      setReservas(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.log(error);
    }
  };


  /* =========================
     ELEGIR VEHICULO
  ========================= */
  const abrirElegirVehiculo = (
    vehiculo
  ) => {
    setVehiculoSeleccionado(vehiculo);

    setOperativoForm({
      operativo: "",
      kmSalida: vehiculo.km_actual || 0,
      observacion: "",
    });

    setModalElegir(true);
  };

  const confirmarElegirVehiculo =
    async () => {
      try {
        await elegirVehiculo(vehiculoSeleccionado.id, {
          operativo: operativoForm.operativo,
          observacion: operativoForm.observacion,
          kmSalida: Number(operativoForm.kmSalida)
        });

        setModalElegir(false);

        await cargarVehiculos();

      } catch (error) {
        console.log(error);

        alert(
          error?.response?.data?.error ||
            "Error al iniciar operativo"
        );
      }
    };

  /* =========================
     FINALIZAR OPERATIVO
  ========================= */
  const abrirFinalizarVehiculo =
    (vehiculo) => {
      setVehiculoSeleccionado(vehiculo);

      setFinalizarForm({
        kmLlegada: vehiculo.km_actual,
        observacion: "",
      });

      setModalFinalizar(true);
    };

  const confirmarFinalizarVehiculo =
    async () => {
      try {
        await finalizarVehiculo(
          vehiculoSeleccionado.id,
          finalizarForm
        );

        setModalFinalizar(false);

        await cargarVehiculos();

      } catch (error) {
        console.log(error);

        alert(
          error?.response?.data?.error ||
            "Error al finalizar operativo"
        );
      }
    };
  /* =========================
   RESERVAR
========================= */

const abrirReserva = (vehiculo) => {
  setVehiculoSeleccionado(vehiculo);

  setReservaForm({
    fecha: "",
    hora_desde: "",
    hora_hasta: "",
    motivo: "",
  });

  setModalReserva(true);
};

const confirmarReserva = async () => {
  try {
    const payload = {
      vehiculo_id: vehiculoSeleccionado?.id,
      fecha: reservaForm.fecha?.trim(),
      hora_desde: reservaForm.hora_desde?.trim(),
      hora_hasta: reservaForm.hora_hasta?.trim(),
      motivo: reservaForm.motivo?.trim(),
    };

    if (
      !payload.vehiculo_id ||
      !payload.fecha ||
      !payload.hora_desde ||
      !payload.hora_hasta ||
      !payload.motivo
    ) {
      return alert("Completa todos los campos");
    }

    await crearReserva(payload);

    await cargarReservas();
    await cargarVehiculos();

    alert("Reserva enviada correctamente");
    setModalReserva(false);

  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Error al reservar"
    );
  }
};

  const totalVehiculos = vehiculos.length;

  const disponibles = vehiculos.filter(
    (v) => v.estado === "LIBRE"
  ).length;
  
  const operativos = vehiculos.filter(
    (v) => v.estado === "EN USO"
  ).length;
  
  const reservados = vehiculos.filter(
    (v) => v.estado === "RESERVADO"
  ).length;
  
  const reservasPendientes =
    reservas.filter(
      (r) =>
        r.estado === "PENDIENTE"
      ).length;
  const tieneReservaActiva = reservas.some(
    (r) =>
      r.estado === "PENDIENTE" ||
      r.estado === "APROBADA"
  );
  const tieneVehiculoEnUso = vehiculos.some(
    (v) =>
      v.estado === "EN USO" &&
      v.operativo_usuario_id === user?.id
  );

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-gray-800">
          Dashboard Operativo
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión operativa de flota
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Vehículos
              </p>

              <h2 className="text-4xl font-black text-gray-800 mt-2">
                {totalVehiculos}
              </h2>
            </div>

            <div className="bg-blue-100 p-4 rounded-2xl">
              <FaCar className="text-blue-700 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Reservados
              </p>

              <h2 className="text-4xl font-black text-gray-800 mt-2">
                {reservados}
              </h2>
            </div>

            <div className="bg-purple-100 p-4 rounded-2xl">
              <FaCalendarAlt className="text-purple-700 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Operativos
              </p>

              <h2 className="text-4xl font-black text-gray-800 mt-2">
                {operativos}
              </h2>
            </div>

            <div className="bg-orange-100 p-4 rounded-2xl">
              <FaClipboardList className="text-orange-700 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Disponibles
              </p>

              <h2 className="text-4xl font-black text-green-600 mt-2">
                {disponibles}
              </h2>
            </div>

            <div className="bg-green-100 p-4 rounded-2xl">
              <FaCheckCircle className="text-green-700 text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Reservas Pendientes
                </p>

                <h2 className="text-4xl font-black text-yellow-600 mt-2">
                  {reservasPendientes}
                </h2>
              </div>

              <div className="bg-yellow-100 p-4 rounded-2xl">
                <FaCalendarAlt className="text-yellow-700 text-2xl" />
              </div>
            </div>
          </div>

      </div>

      {/* VEHICULOS */}
      <div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-800">
            Vehículos Operativos
          </h2>
        </div>
        
        
        <div className="mb-6 flex gap-4 flex-wrap">
          {/* FILTRO MATRÍCULA */}
          <input
            type="text"
            placeholder="Buscar por matrícula..."
            value={filtroMatricula.toUpperCase()}
            onChange={(e) => setFiltroMatricula(e.target.value)}
            className="w-full md:w-96 border p-3 rounded-2xl"
          />

          {/* FILTRO ESTADO */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full md:w-60 border p-3 rounded-2xl"
          >
            <option value="">Todos los estados</option>
            <option value="LIBRE">LIBRE</option>
            <option value="EN USO">EN USO</option>
            <option value="RESERVADO">RESERVADO</option>
            <option value="RADIADO">RADIADO</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {vehiculos
            .filter((v) => {
              const matricula = (v.matricula ?? "").toLowerCase();
              const filtro = (filtroMatricula ?? "").toLowerCase();
            
              const matchMatricula = matricula.includes(filtro);
              const matchEstado = filtroEstado ? v.estado === filtroEstado : true;
            
              return matchMatricula && matchEstado;
            })
            .map((v) => (
          
                      
            <div
              key={v.id}
              className="
                bg-white rounded-3xl overflow-hidden
                shadow-xl hover:scale-[1.01]
                transition-all duration-300
              "
            >
              
              <img
                src={getImageUrl(v.imagen)}
                
                alt={v.modelo}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">

                <div className="flex justify-between items-center mb-4">

                  <div>
                    <h2 className="text-2xl font-black text-gray-800">
                      {v.marca?.toUpperCase()}
                    </h2>

                    <p className="text-gray-500">
                      {v.modelo?.toUpperCase()}
                    </p>
                  </div>

                  <div>
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
                    {v.estado === "RESERVADO" && (
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        RESERVADO
                      </span>
                    )}
                    {v.estado === "RADIADO" && (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        RADIADO
                      </span>
                    )}
                  </div>

                </div>

                <div className="space-y-3 text-sm text-gray-700">
                                  
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      Matrícula
                    </span>
                                  
                    <span>{v.matricula?.toUpperCase()}</span>
                  </div>
                                  
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      KM
                    </span>
                                  
                    <span>{v.km_actual}</span>
                  </div>
                                  
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      Tipo
                    </span>
                                  
                    <span>{v.tipo?.toUpperCase()}</span>
                  </div>
                                  
                  {/* =========================
                      RESERVADO
                  ========================= */}
                
                  {v.estado === "RESERVADO" && (
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 mt-3">
                      <p className="font-bold text-purple-700 mb-2">
                        Reserva
                      </p>
                                    
                      <p>
                        <strong>Desde:</strong> {v.hora_desde}
                      </p>
                                    
                      <p>
                        <strong>Hasta:</strong> {v.hora_hasta}
                      </p>
                                    
                      <p>
                        <strong>Solicitante:</strong> {v.solicitante}
                      </p>
                                    
                      {/* BOTÓN SOLO PARA EL USUARIO QUE RESERVÓ */}
                      {v.solicitante_id === user?.id && (
                        <button
                          onClick={() => abrirElegirVehiculo(v)}
                          className="mt-3 bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl font-bold w-full"
                        >
                          Usar vehículo reservado
                        </button>
                      )}
                    </div>
                  )}
                
                  {/* =========================
                      EN USO
                  ========================= */}
                
                  {v.estado === "EN USO" && (
                    <div className="
                      bg-orange-50 border border-orange-200
                      rounded-2xl p-3 mt-3
                    ">
                      <p className="font-bold text-orange-700 mb-2">
                        Operativo
                      </p>
                  
                      <p>
                        <strong>Operativo:</strong>{" "}
                        {v.destino || "No definido"}
                      </p>
                  
                      <p>
                        <strong>Chofer:</strong>{" "}
                        {v.chofer || "No definido"}
                      </p>
                  
                      <p>
                        <strong>Salida:</strong>{" "}
                        {v.fecha_salida
                          ? new Date(v.fecha_salida).toLocaleString()
                          : "Sin fecha"}
                      </p>
                    </div>
                  )}
                
                  {/* =========================
                      RADIADO
                  ========================= */}
                
                  {v.estado === "RADIADO" && (
                    <div className="
                      bg-red-50 border border-red-200
                      rounded-2xl p-3 mt-3
                    ">
                      <p className="font-bold text-red-700 mb-2">
                        Vehículo Radiado
                      </p>
                  
                      <p>
                        <strong>Motivo:</strong>{" "}
                        {v.motivo_radiado || "Sin motivo"}
                      </p>
                    </div>
                  )}
                
                </div>

                <div className="mt-5 flex flex-col gap-3">

                  {v.estado === "LIBRE" &&
                   !tieneReservaActiva &&
                   !tieneVehiculoEnUso && (
                    <button
                      onClick={() =>
                        abrirElegirVehiculo(v)
                      }
                      className="
                        bg-green-600 hover:bg-green-700
                        text-white p-3 rounded-2xl
                        font-bold
                      "
                    >
                      Elegir Vehículo
                    </button>
                  )}

                  {v.estado === "EN USO" &&
                    v.operativo_usuario_id === user?.id && (
                      <button
                        onClick={() => abrirFinalizarVehiculo(v)}
                        className="
                          bg-blue-600 hover:bg-blue-700
                          text-white p-3 rounded-2xl font-bold
                        "
                      >
                        Finalizar Operativo
                      </button>
                  )}

                  {v.estado === "LIBRE" &&
                   !tieneReservaActiva &&
                   !tieneVehiculoEnUso && (
                    <button
                      onClick={() => abrirReserva(v)}
                      className="
                        bg-purple-600 hover:bg-purple-700
                        text-white p-3 rounded-2xl
                        font-bold
                      "
                    >
                      Reservar
                    </button>
                  )}
                {v.estado === "RADIADO" && (
                  <button
                    disabled
                    className="
                      bg-red-200 text-red-700
                      p-3 rounded-2xl
                      font-bold cursor-not-allowed
                    "
                  >
                    Vehículo fuera de servicio
                  </button>
                )}

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
      {/* =========================
   MODAL ELEGIR
========================= */}

{modalElegir && (
  <div className="
    fixed inset-0 bg-black/50
    flex items-center justify-center
    z-50
  ">

    <div className="
      bg-white w-full max-w-lg
      rounded-3xl p-8
    ">

      <div className="
        flex justify-between items-center
        mb-6
      ">
        <h2 className="text-3xl font-black">
          Iniciar Operativo
        </h2>

        <button
          onClick={() =>
            setModalElegir(false)
          }
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Operativo"
          value={operativoForm.operativo}
          onChange={(e) =>
            setOperativoForm({
              ...operativoForm,
              operativo: e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <input
          type="number"
          placeholder="KM salida"
          value={operativoForm.kmSalida}
          onChange={(e) =>
            setOperativoForm({
              ...operativoForm,
              kmSalida: e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <textarea
          placeholder="Observación"
          value={operativoForm.observacion}
          onChange={(e) =>
            setOperativoForm({
              ...operativoForm,
              observacion: e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <button
          onClick={
            confirmarElegirVehiculo
          }
          className="
            w-full bg-green-600
            hover:bg-green-700
            text-white p-3
            rounded-2xl font-bold
          "
        >
          Confirmar
        </button>

      </div>
    </div>
  </div>
)}

{/* =========================
   MODAL FINALIZAR
========================= */}

{modalFinalizar && (
  <div className="
    fixed inset-0 bg-black/50
    flex items-center justify-center
    z-50
  ">

    <div className="
      bg-white w-full max-w-lg
      rounded-3xl p-8
    ">

      <div className="
        flex justify-between items-center
        mb-6
      ">
        <h2 className="text-3xl font-black">
          Finalizar Operativo
        </h2>

        <button
          onClick={() =>
            setModalFinalizar(false)
          }
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-4">

        <input
          type="number"
          placeholder="KM llegada"
          value={finalizarForm.kmLlegada}
          onChange={(e) =>
            setFinalizarForm({
              ...finalizarForm,
              kmLlegada:
                e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <textarea
          placeholder="Observación"
          value={
            finalizarForm.observacion
          }
          onChange={(e) =>
            setFinalizarForm({
              ...finalizarForm,
              observacion:
                e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <button
          onClick={
            confirmarFinalizarVehiculo
          }
          className="
            w-full bg-blue-600
            hover:bg-blue-700
            text-white p-3
            rounded-2xl font-bold
          "
        >
          Finalizar
        </button>

      </div>
    </div>
  </div>
)}

{/* =========================
   MODAL RESERVA
========================= */}

{modalReserva && (
  <div className="
    fixed inset-0 bg-black/50
    flex items-center justify-center
    z-50
  ">

    <div className="
      bg-white w-full max-w-lg
      rounded-3xl p-8
    ">

      <div className="
        flex justify-between items-center
        mb-6
      ">
        <h2 className="text-3xl font-black">
          Reservar Vehículo
        </h2>

        <button
          onClick={() =>
            setModalReserva(false)
          }
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-4">

        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={reservaForm.fecha}
          onChange={(e) =>
            setReservaForm({
              ...reservaForm,
              fecha: e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <input
          type="time"
          value={
            reservaForm.hora_desde
          }
          onChange={(e) =>
            setReservaForm({
              ...reservaForm,
              hora_desde:
                e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <input
          type="time"
          value={
            reservaForm.hora_hasta
          }
          onChange={(e) =>
            setReservaForm({
              ...reservaForm,
              hora_hasta:
                e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <textarea
          placeholder="Motivo"
          value={reservaForm.motivo}
          onChange={(e) =>
            setReservaForm({
              ...reservaForm,
              motivo: e.target.value,
            })
          }
          className="
            w-full border p-3
            rounded-2xl
          "
        />

        <button
          onClick={confirmarReserva}
          className="
            w-full bg-purple-600
            hover:bg-purple-700
            text-white p-3
            rounded-2xl font-bold
          "
        >
          Enviar Reserva
        </button>

      </div>
    </div>
  </div>
)}

    </div>
  );
}