// src/components/ModalEmergencyContact.tsx
import React, { JSX, useState, useEffect } from "react";
import { EmergencyContact } from "../types";
import { createEmergencyContact, updateEmergencyContact } from "../lib/api";

interface Props {
  initial?: EmergencyContact | null;
  onClose: () => void;
}

export default function ModalEmergencyContact({ initial, onClose }: Props): JSX.Element {
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [contactName, setContactName] = useState<string>("");
  const [relationship, setRelationship] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [alternativePhone, setAlternativePhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setEmployeeId(initial.employee_id);
      setContactName(initial.contact_name);
      setRelationship(initial.relationship);
      setPhoneNumber(initial.phone_number);
      setAlternativePhone(initial.alternative_phone || "");
      setEmail(initial.email || "");
      setAddress(initial.address || "");
      setIsPrimary(initial.is_primary || false);
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        employee_id: employeeId,
        contact_name: contactName,
        relationship: relationship,
        phone_number: phoneNumber,
        alternative_phone: alternativePhone || null,
        email: email || null,
        address: address || null,
        is_primary: isPrimary,
      };
      if (initial?.id) {
        await updateEmergencyContact(initial.id, payload);
      } else {
        await createEmergencyContact(payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Contacto de Emergencia" : "Nuevo Contacto de Emergencia"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">ID de Empleado</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={employeeId}
              onChange={(e) => setEmployeeId(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Contacto</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Relación</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Número de Teléfono</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono Alternativo</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={alternativePhone}
              onChange={(e) => setAlternativePhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Dirección</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isPrimary"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
            />
            <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-300">Es Contacto Principal</label>
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
