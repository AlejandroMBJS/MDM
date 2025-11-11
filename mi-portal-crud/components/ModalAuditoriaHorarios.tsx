// src/components/ModalAuditoriaHorarios.tsx
import React, { JSX, useState, useEffect } from "react";
import { AuditoriaHorarios } from "../types";
import { createAuditoriaHorarios, updateAuditoriaHorarios } from "../lib/api";

interface Props {
  userId: number;
  initial?: AuditoriaHorarios | null;
  onClose: () => void;
}

export default function ModalAuditoriaHorarios({ userId, initial, onClose }: Props): JSX.Element {
  const [empleadoId, setEmpleadoId] = useState<number>(userId);
  const [fecha, setFecha] = useState<string>("");
  const [horaEntrada, setHoraEntrada] = useState<string>("");
  const [horaSalida, setHoraSalida] = useState<string>("");
  const [estado, setEstado] = useState<"puntual" | "tarde" | "ausente" | "temprano">("puntual");
  const [registradoPor, setRegistradoPor] = useState<number | undefined>(undefined);
  const [notas, setNotas] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setEmpleadoId(initial.empleado_id);
      setFecha(initial.fecha);
      setHoraEntrada(initial.hora_entrada || "");
      setHoraSalida(initial.hora_salida || "");
      setEstado(initial.estado || "puntual");
      setRegistradoPor(initial.registrado_por || undefined);
      setNotas(initial.notas || "");
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        empleado_id: empleadoId,
        fecha: fecha,
        hora_entrada: horaEntrada || null,
        hora_salida: horaSalida || null,
        estado: estado,
        registrado_por: registradoPor || null,
        notas: notas || null,
      };
      if (initial?.id) {
        await updateAuditoriaHorarios(userId, initial.id, payload);
      } else {
        await createAuditoriaHorarios(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Auditoría de Horario" : "Nueva Auditoría de Horario"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Hora de Entrada</label>
            <input
              type="time"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={horaEntrada}
              onChange={(e) => setHoraEntrada(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Hora de Salida</label>
            <input
              type="time"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={estado}
              onChange={(e) => setEstado(e.target.value as "puntual" | "tarde" | "ausente" | "temprano")}
            >
              <option value="puntual">Puntual</option>
              <option value="tarde">Tarde</option>
              <option value="ausente">Ausente</option>
              <option value="temprano">Temprano</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Registrado Por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={registradoPor || ""}
              onChange={(e) => setRegistradoPor(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Notas</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
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
