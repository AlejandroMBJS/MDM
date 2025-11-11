// src/components/Navbar.tsx
import React, { JSX } from "react";

interface Props {
  onLogout: () => void;
  onOpenCreateUser: () => void;
  role: string | null;
}

export default function Navbar({ onLogout, onOpenCreateUser, role }: Props): JSX.Element {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">MDM Portal</div>
        <div className="text-sm text-gray-400">mi-portal-crud</div>
      </div>

      <div className="flex items-center gap-3">
        {role === "admin" && (
          <>
            <a href="/turnos" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">Gestión de Turnos</a>
            <a href="/emergency-contacts" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">Contactos de Emergencia</a>
            <a href="/users" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">Gestión de Usuarios</a>
            <button onClick={onOpenCreateUser} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200">Crear Usuario</button>
          </>
        )}
        <button onClick={onLogout} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200">Logout</button>
      </div>
    </header>
  );
}
