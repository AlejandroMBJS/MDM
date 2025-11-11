// src/components/ModalHorario.tsx
import React, { JSX, useState, useEffect } from "react";
import type { HorarioBase } from "../types";
import { createHorarioBase, updateHorarioBase } from "../lib/api";

interface Props {
  userId: number;
  initial?: HorarioBase | null;
  onClose: () => void;
}

export default function ModalHorario({ userId, initial = null, onClose }: Props): JSX.Element {
  const [form, setForm] = useState<HorarioBase>(
    initial ?? { empleado_id: userId, turno_id: 0, dia_semana: 0 }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm((prev) => ({ ...prev, empleado_id: userId }));
    }
  }, [initial, userId]);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial && initial.id) {
        await updateHorarioBase(userId, initial.id, {
          empleado_id: form.empleado_id,
          turno_id: form.turno_id,
          dia_semana: form.dia_semana,
        });
      } else {
        await createHorarioBase(userId, {
          empleado_id: form.empleado_id,
          turno_id: form.turno_id,
          dia_semana: form.dia_semana,
        });
      }
      onClose();
    } catch (err: any) {
      alert(err.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-2xl w-[420px]">
        <h3 className="text-lg font-semibold mb-4">{initial ? "Editar Horario" : "Nuevo Horario"}</h3>

        <label className="block text-sm">Empleado ID</label>
        <input name="empleado_id" value={form.empleado_id} onChange={onChange} className="w-full p-2 rounded mb-3 border" type="number" required />

        <label className="block text-sm">Turno ID</label>
        <input name="turno_id" value={form.turno_id} onChange={onChange} className="w-full p-2 rounded mb-3 border" type="number" required />

        <label className="block text-sm">Día semana</label>
        <select name="dia_semana" value={form.dia_semana} onChange={onChange} className="w-full p-2 rounded mb-4 border">
          <option value={0}>0 - Domingo</option>
          <option value={1}>1 - Lunes</option>
          <option value={2}>2 - Martes</option>
          <option value={3}>3 - Miércoles</option>
          <option value={4}>4 - Jueves</option>
          <option value={5}>5 - Viernes</option>
          <option value={6}>6 - Sábado</option>
        </select>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
