import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../auth/Login";
import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Vehiculos from "../pages/Vehiculos";
import Reservas from "../pages/Reservas";
import Operativos from "../pages/Operativos";
import Usuarios from "../pages/Usuarios";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="operativos" element={<Operativos />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}