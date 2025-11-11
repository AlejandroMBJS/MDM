// src/components/ModalJobHistory.tsx
import React, { JSX, useState, useEffect } from "react";
import { JobHistory } from "../types";
import { createJobHistory, updateJobHistory } from "../lib/api";

interface Props {
  userId: number;
  initial?: JobHistory | null;
  onClose: () => void;
}

export default function ModalJobHistory({ userId, initial, onClose }: Props): JSX.Element {
  const [effectiveDate, setEffectiveDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [positionTitle, setPositionTitle] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [supervisorId, setSupervisorId] = useState<number | undefined>(undefined);
  const [salary, setSalary] = useState<number | undefined>(undefined);
  const [changeType, setChangeType] = useState<string>("");
  const [changeReason, setChangeReason] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setEffectiveDate(initial.effective_date);
      setEndDate(initial.end_date || "");
      setPositionTitle(initial.position_title || "");
      setDepartment(initial.department || "");
      setArea(initial.area || "");
      setSupervisorId(initial.supervisor_id || undefined);
      setSalary(initial.salary || undefined);
      setChangeType(initial.change_type || "");
      setChangeReason(initial.change_reason || "");
      setCreatedBy(initial.created_by || undefined);
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        employee_id: userId,
        effective_date: effectiveDate,
        end_date: endDate || null,
        position_title: positionTitle || null,
        department: department || null,
        area: area || null,
        supervisor_id: supervisorId || null,
        salary: salary || null,
        change_type: changeType || null,
        change_reason: changeReason || null,
        created_by: createdBy || null,
      };
      if (initial?.id) {
        await updateJobHistory(userId, initial.id, payload);
      } else {
        await createJobHistory(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Historial de Trabajo" : "Nuevo Historial de Trabajo"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha Efectiva</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha Fin</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Título del Puesto</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Departamento</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Área</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">ID Supervisor</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={supervisorId || ""}
              onChange={(e) => setSupervisorId(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Salario</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={salary || ""}
              onChange={(e) => setSalary(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Cambio</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Razón del Cambio</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Creado por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={createdBy || ""}
              onChange={(e) => setCreatedBy(parseInt(e.target.value) || undefined)}
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
