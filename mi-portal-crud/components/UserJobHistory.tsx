// src/components/UserJobHistory.tsx
import React, { JSX, useState, useEffect } from "react";
import { JobHistory } from "../types";
import { apiFetch } from "../lib/api";
import ModalJobHistory from "./ModalJobHistory";

interface Props {
  userId: number;
}

export default function UserJobHistory({ userId }: Props): JSX.Element {
  const [jobHistory, setJobHistory] = useState<JobHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<JobHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobHistory();
  }, [userId]);

  async function loadJobHistory() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/v1/users/${userId}/job-history/?limit=500`);
      setJobHistory(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar historial de trabajo");
      console.error("fetchJobHistory error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar registro de historial de trabajo?")) return;
    try {
      await apiFetch(`/api/v1/users/${userId}/job-history/${id}`, { method: "DELETE" });
      loadJobHistory();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Historial de Trabajo</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Registro
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando historial de trabajo...</div>
      ) : jobHistory.length === 0 ? (
        <div className="text-gray-400">No hay historial de trabajo registrado para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobHistory.map((jh) => (
            <div key={jh.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{jh.position_title}</div>
                  <div className="text-sm text-gray-400">Departamento: {jh.department}</div>
                  <div className="text-sm text-gray-400">Área: {jh.area}</div>
                  <div className="text-sm text-gray-400">Fecha Efectiva: {jh.effective_date}</div>
                  {jh.end_date && <div className="text-sm text-gray-400">Fecha Fin: {jh.end_date}</div>}
                  {jh.salary && <div className="text-sm text-gray-400">Salario: {jh.salary}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(jh); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(jh.id)}
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
        <ModalJobHistory
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadJobHistory(); }}
        />
      )}
    </div>
  );
}
