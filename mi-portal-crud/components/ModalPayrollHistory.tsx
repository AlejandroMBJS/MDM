// src/components/ModalPayrollHistory.tsx
import React, { JSX, useState, useEffect } from "react";
import { PayrollHistory } from "../types";
import { createPayrollHistory, updatePayrollHistory } from "../lib/api";

interface Props {
  userId: number;
  initial?: PayrollHistory | null;
  onClose: () => void;
}

export default function ModalPayrollHistory({ userId, initial, onClose }: Props): JSX.Element {
  const [employeeId, setEmployeeId] = useState<number>(userId);
  const [payrollPeriod, setPayrollPeriod] = useState<string>("");
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");
  const [baseSalary, setBaseSalary] = useState<number | undefined>(undefined);
  const [overtimePay, setOvertimePay] = useState<number>(0);
  const [bonuses, setBonuses] = useState<number>(0);
  const [commissions, setCommissions] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [grossPay, setGrossPay] = useState<number | undefined>(undefined);
  const [isrTax, setIsrTax] = useState<number>(0);
  const [imssEmployee, setImssEmployee] = useState<number>(0);
  const [infonavitDiscount, setInfonavitDiscount] = useState<number>(0);
  const [fonacotDiscount, setFonacotDiscount] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [totalDeductions, setTotalDeductions] = useState<number | undefined>(undefined);
  const [netPay, setNetPay] = useState<number | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PROCESSED" | "PAID" | "CANCELLED">("PENDING");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setEmployeeId(initial.employee_id);
      setPayrollPeriod(initial.payroll_period);
      setPeriodStart(initial.period_start);
      setPeriodEnd(initial.period_end);
      setBaseSalary(initial.base_salary || undefined);
      setOvertimePay(initial.overtime_pay || 0);
      setBonuses(initial.bonuses || 0);
      setCommissions(initial.commissions || 0);
      setOtherIncome(initial.other_income || 0);
      setGrossPay(initial.gross_pay || undefined);
      setIsrTax(initial.isr_tax || 0);
      setImssEmployee(initial.imss_employee || 0);
      setInfonavitDiscount(initial.infonavit_discount || 0);
      setFonacotDiscount(initial.fonacot_discount || 0);
      setOtherDeductions(initial.other_deductions || 0);
      setTotalDeductions(initial.total_deductions || undefined);
      setNetPay(initial.net_pay || undefined);
      setPaymentStatus(initial.payment_status || "PENDING");
      setPaymentDate(initial.payment_date || "");
      setPaymentMethod(initial.payment_method || "");
      setCreatedBy(initial.created_by || undefined);
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        employee_id: employeeId,
        payroll_period: payrollPeriod,
        period_start: periodStart,
        period_end: periodEnd,
        base_salary: baseSalary || null,
        overtime_pay: overtimePay,
        bonuses: bonuses,
        commissions: commissions,
        other_income: otherIncome,
        gross_pay: grossPay || null,
        isr_tax: isrTax,
        imss_employee: imssEmployee,
        infonavit_discount: infonavitDiscount,
        fonacot_discount: fonacotDiscount,
        other_deductions: otherDeductions,
        total_deductions: totalDeductions || null,
        net_pay: netPay || null,
        payment_status: paymentStatus,
        payment_date: paymentDate || null,
        payment_method: paymentMethod || null,
        created_by: createdBy || null,
      };
      if (initial?.id) {
        await updatePayrollHistory(userId, initial.id, payload);
      } else {
        await createPayrollHistory(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Historial de Nómina" : "Nuevo Historial de Nómina"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Período de Nómina</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={payrollPeriod}
              onChange={(e) => setPayrollPeriod(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Inicio del Período</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fin del Período</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Salario Base</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={baseSalary || ""}
              onChange={(e) => setBaseSalary(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Pago por Horas Extras</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={overtimePay}
              onChange={(e) => setOvertimePay(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Bonos</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={bonuses}
              onChange={(e) => setBonuses(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Comisiones</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={commissions}
              onChange={(e) => setCommissions(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Otros Ingresos</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={otherIncome}
              onChange={(e) => setOtherIncome(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Pago Bruto</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={grossPay || ""}
              onChange={(e) => setGrossPay(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Impuesto ISR</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={isrTax}
              onChange={(e) => setIsrTax(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">IMSS Empleado</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={imssEmployee}
              onChange={(e) => setImssEmployee(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Descuento INFONAVIT</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={infonavitDiscount}
              onChange={(e) => setInfonavitDiscount(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Descuento FONACOT</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={fonacotDiscount}
              onChange={(e) => setFonacotDiscount(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Otras Deducciones</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(parseFloat(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Deducciones Totales</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={totalDeductions || ""}
              onChange={(e) => setTotalDeductions(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Pago Neto</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={netPay || ""}
              onChange={(e) => setNetPay(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado de Pago</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as "PENDING" | "PROCESSED" | "PAID" | "CANCELLED")}
            >
              <option value="PENDING">Pendiente</option>
              <option value="PROCESSED">Procesado</option>
              <option value="PAID">Pagado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Pago</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Método de Pago</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Creado Por (ID de Usuario)</label>
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
