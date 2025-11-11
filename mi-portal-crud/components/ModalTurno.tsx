// src/components/ModalTurno.tsx
import React, { JSX, useState, useEffect } from "react";
import { Turno } from "../types";
import { createTurno, updateTurno } from "../lib/api";

interface Props {
  initial?: Turno | null;
  onClose: () => void;
}

export default function ModalTurno({ initial, onClose }: Props): JSX.Element {
  const [nombre, setNombre] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");
  const [horaInicio, setHoraInicio] = useState<string>("");
  const [horaFin, setHoraFin] = useState<string>("");
  const [esDescanso, setEsDescanso] = useState<boolean>(false);
  const [activo, setActivo] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setNombre(initial.nombre);
      setCodigo(initial.codigo);
      setHoraInicio(initial.hora_inicio);
      setHoraFin(initial.hora_fin);
      setEsDescanso(initial.es_descanso);
      setActivo(initial.activo);
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre,
        codigo,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        es_descanso: esDescanso,
        activo: activo,
      };
      if (initial?.id) {
        await updateTurno(initial.id, payload);
      } else {
        await createTurno(payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Turno" : "Nuevo Turno"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Código</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Hora Inicio</label>
              <input
                type="time"
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Hora Fin</label>
              <input
                type="time"
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="esDescanso"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={esDescanso}
              onChange={(e) => setEsDescanso(e.target.checked)}
            />
            <label htmlFor="esDescanso" className="ml-2 block text-sm text-gray-300">Es Descanso</label>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="activo"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-300">Activo</label>
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
