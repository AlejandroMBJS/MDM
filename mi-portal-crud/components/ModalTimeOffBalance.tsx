// src/components/ModalTimeOffBalance.tsx
import React, { JSX, useState, useEffect } from "react";
import { TimeOffBalance } from "../types";
import { createTimeOffBalance, updateTimeOffBalance } from "../lib/api";

interface Props {
  userId: number;
  initial?: TimeOffBalance | null;
  onClose: () => void;
}

export default function ModalTimeOffBalance({ userId, initial, onClose }: Props): JSX.Element {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [leaveType, setLeaveType] = useState<string>("");
  const [totalDays, setTotalDays] = useState<number>(0);
  const [usedDays, setUsedDays] = useState<number>(0);
  const [pendingDays, setPendingDays] = useState<number>(0);
  const [expiresOn, setExpiresOn] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setYear(initial.year);
      setLeaveType(initial.leave_type);
      setTotalDays(initial.total_days || 0);
      setUsedDays(initial.used_days || 0);
      setPendingDays(initial.pending_days || 0);
      setExpiresOn(initial.expires_on || "");
      setNotes(initial.notes || "");
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        employee_id: userId,
        year: year,
        leave_type: leaveType,
        total_days: totalDays,
        used_days: usedDays,
        pending_days: pendingDays,
        expires_on: expiresOn || null,
        notes: notes || null,
      };
      if (initial?.id) {
        await updateTimeOffBalance(userId, initial.id, payload);
      } else {
        await createTimeOffBalance(userId, payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Balance de Tiempo Libre" : "Nuevo Balance de Tiempo Libre"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Año</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Ausencia</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Días Totales</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={totalDays}
              onChange={(e) => setTotalDays(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Días Usados</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={usedDays}
              onChange={(e) => setUsedDays(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Días Pendientes</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={pendingDays}
              onChange={(e) => setPendingDays(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Expira el</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={expiresOn}
              onChange={(e) => setExpiresOn(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Notas</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <div className="text-red-400 mb-4 text-sm bg-red-900/50 p-3 rounded-lg">{error}</div>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
