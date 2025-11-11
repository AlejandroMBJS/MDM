// app/horarios/page.tsx  (Next 13 app router, 'use client')
'use client';
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

const API_URL = 'http://localhost:8000/api/v1/horarios-base';
const data = await apiFetch('/api/v1/horarios-base/?limit=500');
type Horario = {
    id: number;
    empleado_id: number;
    turno_id: number;
    dia_semana: number;
    created_at: string;
    updated_at?: string | null;
};

export default function HorariosPage() {
    console.log(data)
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState({ empleado_id: '', turno_id: '', dia_semana: '0' });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => { fetchHorarios(); }, []);

    async function fetchHorarios() {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch(`${API_URL}/?limit=500`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data: Horario[] = await res.json();
            setHorarios(data);
        } catch (e: any) {
            setError(e.message);
        } finally { setLoading(false); }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            empleado_id: Number(form.empleado_id),
            turno_id: Number(form.turno_id),
            dia_semana: Number(form.dia_semana),
        };
        try {
            const res = await apiFetch(editingId ? `${API_URL}/${editingId}` : `${API_URL}/`, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingId ? { ...payload } : payload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.detail || `HTTP ${res.status}`);
            }
            await fetchHorarios();
            setForm({ empleado_id: '', turno_id: '', dia_semana: '0' });
            setEditingId(null);
            alert('Guardado');
        } catch (err: any) {
            alert(err.message);
        }
    }

    function startEdit(h: Horario) {
        setEditingId(h.id);
        setForm({ empleado_id: String(h.empleado_id), turno_id: String(h.turno_id), dia_semana: String(h.dia_semana) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleDelete(id: number) {
        if (!confirm('Eliminar este horario?')) return;
        try {
            const res = await apiFetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
            setHorarios(prev => prev.filter(x => x.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <main style={{ padding: 20 }}>
            <h1>Horarios Base</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <div>
                    <label>Empleado ID</label>
                    <input name="empleado_id" value={form.empleado_id} onChange={handleChange} required />
                </div>
                <div>
                    <label>Turno ID</label>
                    <input name="turno_id" value={form.turno_id} onChange={handleChange} required />
                </div>
                <div>
                    <label>Día semana (0-6)</label>
                    <select name="dia_semana" value={form.dia_semana} onChange={handleChange}>
                        <option value="0">0 - Domingo</option>
                        <option value="1">1 - Lunes</option>
                        <option value="2">2 - Martes</option>
                        <option value="3">3 - Miércoles</option>
                        <option value="4">4 - Jueves</option>
                        <option value="5">5 - Viernes</option>
                        <option value="6">6 - Sábado</option>
                    </select>
                </div>

                <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ empleado_id: '', turno_id: '', dia_semana: '0' }); }}>Cancelar</button>}
            </form>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th><th>Empleado</th><th>Turno</th><th>Día</th><th>Creado</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {horarios.map(h => (
                        <tr key={h.id}>
                            <td>{h.id}</td>
                            <td>{h.empleado_id}</td>
                            <td>{h.turno_id}</td>
                            <td>{h.dia_semana}</td>
                            <td>{new Date(h.created_at).toLocaleString()}</td>
                            <td>
                                <button onClick={() => startEdit(h)}>Editar</button>
                                <button onClick={() => handleDelete(h.id)} style={{ marginLeft: 8 }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
