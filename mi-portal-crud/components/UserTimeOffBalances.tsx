// src/components/UserTimeOffBalances.tsx
import React, { JSX, useState, useEffect } from "react";
import { TimeOffBalance } from "../types";
import { fetchTimeOffBalances, createTimeOffBalance, updateTimeOffBalance, deleteTimeOffBalance } from "../lib/api";
import ModalTimeOffBalance from "./ModalTimeOffBalance";

interface Props {
  userId: number;
}

export default function UserTimeOffBalances({ userId }: Props): JSX.Element {
  const [timeOffBalances, setTimeOffBalances] = useState<TimeOffBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<TimeOffBalance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTimeOffBalances();
  }, [userId]);

  async function loadTimeOffBalances() {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchTimeOffBalances(userId)) as TimeOffBalance[];
      setTimeOffBalances(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar balances de tiempo libre");
      console.error("fetchTimeOffBalances error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar balance de tiempo libre?")) return;
    try {
      await deleteTimeOffBalance(userId, id);
      loadTimeOffBalances(); // Reload balances after deletion
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Balances de Tiempo Libre</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Balance
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando balances...</div>
      ) : timeOffBalances.length === 0 ? (
        <div className="text-gray-400">No hay balances de tiempo libre registrados para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timeOffBalances.map((tob) => (
            <div key={tob.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{tob.leave_type} ({tob.year})</div>
                  <div className="text-sm text-gray-400">Total: {tob.total_days} días</div>
                  <div className="text-sm text-gray-400">Usados: {tob.used_days} días</div>
                  <div className="text-sm text-gray-400">Pendientes: {tob.pending_days} días</div>
                  <div className="text-sm text-gray-400">Disponibles: {tob.available_days} días</div>
                  {tob.expires_on && <div className="text-sm text-gray-400">Expira: {tob.expires_on}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(tob); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(tob.id)}
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
        <ModalTimeOffBalance
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadTimeOffBalances(); }}
        />
      )}
    </div>
  );
}
