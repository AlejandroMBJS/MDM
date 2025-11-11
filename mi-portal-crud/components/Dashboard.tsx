// src/components/Dashboard.tsx
import React, { JSX, useEffect, useState } from "react";
import { HorarioBase } from "../types";
import { fetchHorarios, deleteHorario } from "../lib/api";
import Navbar from "@/components/Navbar";
import ModalHorario from "@/components/ModalHorario";
import CreateUserModal from "@/components/CreateUserModal";

interface Props {
  token: string;
  role: string | null;
  onLogout: () => void;
}

export default function Dashboard({ token, role, onLogout }: Props): JSX.Element {
  const [horarios, setHorarios] = useState<HorarioBase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<HorarioBase | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState<boolean>(false);

  async function load() {
    setLoading(true);
    try {
      const data = (await fetchHorarios()) as HorarioBase[];
      setHorarios(data);
    } catch (err) {
      console.error("fetchHorarios error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar horario?")) return;
    try {
      await deleteHorario(id);
      setHorarios((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Navbar onLogout={onLogout} onOpenCreateUser={() => setCreateUserOpen(true)} role={role} />

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Horarios Base</h2>
        <div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            + Nuevo Horario
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : horarios.length === 0 ? (
          <div className="text-gray-400">No hay horarios.</div>
        ) : (
          horarios.map((h) => (
            <div key={h.id} className="bg-gray-800/50 p-4 rounded-2xl shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">Empleado {h.empleado_id}</div>
                  <div className="text-sm text-gray-400">Turno: {h.turno_id}</div>
                  <div className="text-sm text-gray-400">Día: {h.dia_semana}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(h); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition duration-200"
                  >
                    Borrar
                  </button>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">Creado: {h.created_at ? new Date(h.created_at).toLocaleString() : "-"}</div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <ModalHorario
          initial={editing}
          onClose={() => { setModalOpen(false); load(); }}
        />
      )}

      {createUserOpen && role === "admin" && (
        <CreateUserModal onClose={() => setCreateUserOpen(false)} />
      )}
    </div>
  );
}
