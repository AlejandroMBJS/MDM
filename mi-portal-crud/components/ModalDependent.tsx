// src/components/ModalDependent.tsx
import React, { JSX, useState, useEffect } from "react";
import { Dependent } from "../types";
import { createDependent, updateDependent } from "../lib/api";

interface Props {
  userId: number;
  initial?: Dependent | null;
  onClose: () => void;
}

export default function ModalDependent({ userId, initial, onClose }: Props): JSX.Element {
  const [dependentName, setDependentName] = useState<string>("");
  const [relationship, setRelationship] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [curp, setCurp] = useState<string>("");
  const [isBeneficiary, setIsBeneficiary] = useState<boolean>(false);
  const [beneficiaryPercentage, setBeneficiaryPercentage] = useState<number | undefined>(undefined);
  const [isDependent, setIsDependent] = useState<boolean>(true);
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setDependentName(initial.dependent_name);
      setRelationship(initial.relationship);
      setBirthDate(initial.birth_date || "");
      setGender(initial.gender || "");
      setCurp(initial.curp || "");
      setIsBeneficiary(initial.is_beneficiary || false);
      setBeneficiaryPercentage(initial.beneficiary_percentage || undefined);
      setIsDependent(initial.is_dependent || true);
      setHasDisability(initial.has_disability || false);
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
        dependent_name: dependentName,
        relationship: relationship,
        birth_date: birthDate || null,
        gender: gender || null,
        curp: curp || null,
        is_beneficiary: isBeneficiary,
        beneficiary_percentage: beneficiaryPercentage || null,
        is_dependent: isDependent,
        has_disability: hasDisability,
        notes: notes || null,
      };
      if (initial?.id) {
        await updateDependent(userId, initial.id, payload);
      } else {
        await createDependent(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Dependiente" : "Nuevo Dependiente"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Dependiente</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={dependentName}
              onChange={(e) => setDependentName(e.target.value)}
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Género</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">CURP</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={curp}
              onChange={(e) => setCurp(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isBeneficiary"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={isBeneficiary}
              onChange={(e) => setIsBeneficiary(e.target.checked)}
            />
            <label htmlFor="isBeneficiary" className="ml-2 block text-sm text-gray-300">Es Beneficiario</label>
          </div>
          {isBeneficiary && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Porcentaje de Beneficio</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                value={beneficiaryPercentage}
                onChange={(e) => setBeneficiaryPercentage(parseFloat(e.target.value))}
              />
            </div>
          )}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isDependent"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={isDependent}
              onChange={(e) => setIsDependent(e.target.checked)}
            />
            <label htmlFor="isDependent" className="ml-2 block text-sm text-gray-300">Es Dependiente</label>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="hasDisability"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={hasDisability}
              onChange={(e) => setHasDisability(e.target.checked)}
            />
            <label htmlFor="hasDisability" className="ml-2 block text-sm text-gray-300">Tiene Discapacidad</label>
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
