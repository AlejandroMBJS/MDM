// src/components/UserHorariosBase.tsx
import React, { JSX, useState, useEffect } from "react";
import { HorarioBase } from "../types";
import { apiFetch } from "../lib/api";
import ModalHorario from "./ModalHorario";

interface Props {
  userId: number;
}

export default function UserHorariosBase({ userId }: Props): JSX.Element {
  const [horariosBase, setHorariosBase] = useState<HorarioBase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<HorarioBase | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHorariosBase();
  }, [userId]);

  async function loadHorariosBase() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/v1/users/${userId}/horarios-base/?limit=500`);
      setHorariosBase(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar horarios base");
      console.error("fetchHorariosBase error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar horario base?")) return;
    try {
      await apiFetch(`/api/v1/users/${userId}/horarios-base/${id}`, { method: "DELETE" });
      loadHorariosBase();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  const getDayOfWeek = (day: number) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[day];
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Horarios Base</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Horario
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando horarios base...</div>
      ) : horariosBase.length === 0 ? (
        <div className="text-gray-400">No hay horarios base registrados para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {horariosBase.map((hb) => (
            <div key={hb.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">Día: {getDayOfWeek(hb.dia_semana)}</div>
                  <div className="text-sm text-gray-400">Turno ID: {hb.turno_id}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(hb); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(hb.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition duration-200"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-red-400 mt-4 text-sm bg-red-900/50 p-3 rounded-lg">{error}</div>}

      {modalOpen && (
        <ModalHorario
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadHorariosBase(); }}
        />
      )}
    </div>
  );
}