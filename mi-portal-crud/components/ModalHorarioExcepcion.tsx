// src/components/ModalHorarioExcepcion.tsx
import React, { JSX, useState, useEffect } from "react";
import { HorarioExcepcion } from "../types";
import { createHorarioExcepcion, updateHorarioExcepcion } from "../lib/api";

interface Props {
  userId: number;
  initial?: HorarioExcepcion | null;
  onClose: () => void;
}

export default function ModalHorarioExcepcion({ userId, initial, onClose }: Props): JSX.Element {
  const [empleadoId, setEmpleadoId] = useState<number>(userId);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [turnoId, setTurnoId] = useState<number>(0);
  const [motivo, setMotivo] = useState<string>("");
  const [aprobadoPor, setAprobadoPor] = useState<number | undefined>(undefined);
  const [estado, setEstado] = useState<"pendiente" | "aprobado" | "rechazado">("pendiente");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setEmpleadoId(initial.empleado_id);
      setFechaInicio(initial.fecha_inicio);
      setFechaFin(initial.fecha_fin);
      setTurnoId(initial.turno_id);
      setMotivo(initial.motivo || "");
      setAprobadoPor(initial.aprobado_por || undefined);
      setEstado(initial.estado || "pendiente");
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        empleado_id: empleadoId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        turno_id: turnoId,
        motivo: motivo || null,
        aprobado_por: aprobadoPor || null,
        estado: estado,
      };
      if (initial?.id) {
        await updateHorarioExcepcion(userId, initial.id, payload);
      } else {
        await createHorarioExcepcion(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Horario de Excepción" : "Nuevo Horario de Excepción"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Fin</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Turno ID</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={turnoId}
              onChange={(e) => setTurnoId(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Motivo</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Aprobado Por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={aprobadoPor || ""}
              onChange={(e) => setAprobadoPor(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={estado}
              onChange={(e) => setEstado(e.target.value as "pendiente" | "aprobado" | "rechazado")}
            >
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
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
