// src/components/ModalEmployeeBenefit.tsx
import React, { JSX, useState, useEffect } from "react";
import { EmployeeBenefit } from "../types";
import { createEmployeeBenefit, updateEmployeeBenefit } from "../lib/api";

interface Props {
  userId: number;
  initial?: EmployeeBenefit | null;
  onClose: () => void;
}

export default function ModalEmployeeBenefit({ userId, initial, onClose }: Props): JSX.Element {
  const [benefitType, setBenefitType] = useState<string>("");
  const [benefitName, setBenefitName] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [policyNumber, setPolicyNumber] = useState<string>("");
  const [coverageAmount, setCoverageAmount] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [employeeCost, setEmployeeCost] = useState<number>(0);
  const [employerCost, setEmployerCost] = useState<number>(0);
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setBenefitType(initial.benefit_type);
      setBenefitName(initial.benefit_name);
      setProvider(initial.provider || "");
      setPolicyNumber(initial.policy_number || "");
      setCoverageAmount(initial.coverage_amount || undefined);
      setStartDate(initial.start_date);
      setEndDate(initial.end_date || "");
      setEmployeeCost(initial.employee_cost || 0);
      setEmployerCost(initial.employer_cost || 0);
      setBeneficiaryName(initial.beneficiary_name || "");
      setIsActive(initial.is_active || true);
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
        benefit_type: benefitType,
        benefit_name: benefitName,
        provider: provider || null,
        policy_number: policyNumber || null,
        coverage_amount: coverageAmount || null,
        start_date: startDate,
        end_date: endDate || null,
        employee_cost: employeeCost,
        employer_cost: employerCost,
        beneficiary_name: beneficiaryName || null,
        is_active: isActive,
        notes: notes || null,
      };
      if (initial?.id) {
        await updateEmployeeBenefit(userId, initial.id, payload);
      } else {
        await createEmployeeBenefit(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Beneficio" : "Nuevo Beneficio"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Beneficio</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={benefitType}
              onChange={(e) => setBenefitType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Beneficio</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={benefitName}
              onChange={(e) => setBenefitName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Proveedor</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Número de Póliza</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Monto de Cobertura</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={coverageAmount || ""}
              onChange={(e) => setCoverageAmount(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Fin</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Costo Empleado</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={employeeCost}
              onChange={(e) => setEmployeeCost(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Costo Empleador</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={employerCost}
              onChange={(e) => setEmployerCost(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Beneficiario</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">Activo</label>
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
