// src/components/CreateUserModal.tsx
import React, { JSX, useState } from "react";
import { createUser } from "../lib/api";
import { UserCreate } from "../types";

interface Props {
  onClose: () => void;
}

export default function CreateUserModal({ onClose }: Props): JSX.Element {
  const [form, setForm] = useState<UserCreate>({
    name: "",
    email: "",
    password: "",
    role: "employee",
    supervisor_id: undefined,
    department: "",
    default_dashboard: "",
    payroll_number: "",
    periodo: "",
    centro_u: "",
    tipo_usuario: "",
    area: "",
    regimen: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    personal_email: "",
    phone_number: "",
    mobile_number: "",
    street_address: "",
    address_line2: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "México",
    birth_date: undefined,
    gender: "",
    marital_status: "",
    nationality: "",
    curp: "",
    rfc: "",
    nss: "",
    passport_number: "",
    drivers_license: "",
    employee_status: "ACTIVE",
    hire_date: undefined,
    termination_date: undefined,
    termination_reason: "",
    position_title: "",
    job_level: "",
    cost_center: "",
    salary: undefined,
    salary_currency: "MXN",
    payment_frequency: "",
    payment_method: "",
    bank_name: "",
    bank_account_number: "",
    clabe: "",
    contract_type: "",
    work_schedule: "",
    is_active: true,
    last_login: undefined,
    infonavit_credit: false,
    infonavit_number: "",
    infonavit_discount: undefined,
    fonacot_credit: false,
    fonacot_number: "",
    created_by: undefined,
    updated_by: undefined,
  });
  const [saving, setSaving] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === "" ? undefined : parseFloat(value)
          : type === "date" && value === ""
          ? undefined
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: UserCreate = {
        ...form,
        birth_date: form.birth_date ? form.birth_date.toString() : undefined,
        hire_date: form.hire_date ? form.hire_date.toString() : undefined,
        termination_date: form.termination_date ? form.termination_date.toString() : undefined,
        last_login: form.last_login ? form.last_login.toISOString() : undefined,
      };
      await createUser(payload);
      alert("Usuario creado");
      onClose();
    } catch (err: any) {
      alert(err.message || "Error creando usuario");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-2xl w-full max-w-3xl text-gray-800 my-8">
        <h3 className="text-lg font-semibold mb-4">Crear Usuario (Admin)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div>
            <label className="block text-sm">Nombre</label>
            <input name="name" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.name} required />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input name="email" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="email" value={form.email} required />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input name="password" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="password" value={form.password} required />
          </div>
          <div>
            <label className="block text-sm">Role</label>
            <select name="role" onChange={onChange} value={form.role} className="w-full p-2 rounded mb-4 border">
              <option value="employee">employee</option>
              <option value="admin">admin</option>
              <option value="manager">manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Supervisor ID</label>
            <input name="supervisor_id" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="number" value={form.supervisor_id || ""} />
          </div>
          <div>
            <label className="block text-sm">Department</label>
            <input name="department" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.department || ""} />
          </div>
          <div>
            <label className="block text-sm">Default Dashboard</label>
            <input name="default_dashboard" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.default_dashboard || ""} />
          </div>

          {/* Existing Custom Fields */}
          <div>
            <label className="block text-sm">Payroll Number</label>
            <input name="payroll_number" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.payroll_number || ""} />
          </div>
          <div>
            <label className="block text-sm">Periodo</label>
            <input name="periodo" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.periodo || ""} />
          </div>
          <div>
            <label className="block text-sm">Centro U</label>
            <input name="centro_u" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.centro_u || ""} />
          </div>
          <div>
            <label className="block text-sm">Tipo Usuario</label>
            <input name="tipo_usuario" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.tipo_usuario || ""} />
          </div>
          <div>
            <label className="block text-sm">Area</label>
            <input name="area" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.area || ""} />
          </div>
          <div>
            <label className="block text-sm">Regimen</label>
            <input name="regimen" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.regimen || ""} />
          </div>

          {/* Additional Personal Information */}
          <div>
            <label className="block text-sm">First Name</label>
            <input name="first_name" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.first_name || ""} />
          </div>
          <div>
            <label className="block text-sm">Middle Name</label>
            <input name="middle_name" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.middle_name || ""} />
          </div>
          <div>
            <label className="block text-sm">Last Name</label>
            <input name="last_name" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.last_name || ""} />
          </div>
          <div>
            <label className="block text-sm">Second Last Name</label>
            <input name="second_last_name" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.second_last_name || ""} />
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm">Personal Email</label>
            <input name="personal_email" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="email" value={form.personal_email || ""} />
          </div>
          <div>
            <label className="block text-sm">Phone Number</label>
            <input name="phone_number" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.phone_number || ""} />
          </div>
          <div>
            <label className="block text-sm">Mobile Number</label>
            <input name="mobile_number" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.mobile_number || ""} />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm">Street Address</label>
            <input name="street_address" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.street_address || ""} />
          </div>
          <div>
            <label className="block text-sm">Address Line 2</label>
            <input name="address_line2" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.address_line2 || ""} />
          </div>
          <div>
            <label className="block text-sm">City</label>
            <input name="city" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.city || ""} />
          </div>
          <div>
            <label className="block text-sm">State/Province</label>
            <input name="state_province" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.state_province || ""} />
          </div>
          <div>
            <label className="block text-sm">Postal Code</label>
            <input name="postal_code" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.postal_code || ""} />
          </div>
          <div>
            <label className="block text-sm">Country</label>
            <input name="country" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.country || ""} />
          </div>

          {/* Personal Data */}
          <div>
            <label className="block text-sm">Birth Date</label>
            <input name="birth_date" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="date" value={form.birth_date ? form.birth_date.toString() : ""} />
          </div>
          <div>
            <label className="block text-sm">Gender</label>
            <select name="gender" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.gender || ""}>
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Marital Status</label>
            <input name="marital_status" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.marital_status || ""} />
          </div>
          <div>
            <label className="block text-sm">Nationality</label>
            <input name="nationality" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.nationality || ""} />
          </div>

          {/* Official IDs (Mexico) */}
          <div>
            <label className="block text-sm">CURP</label>
            <input name="curp" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.curp || ""} />
          </div>
          <div>
            <label className="block text-sm">RFC</label>
            <input name="rfc" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.rfc || ""} />
          </div>
          <div>
            <label className="block text-sm">NSS</label>
            <input name="nss" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.nss || ""} />
          </div>
          <div>
            <label className="block text-sm">Passport Number</label>
            <input name="passport_number" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.passport_number || ""} />
          </div>
          <div>
            <label className="block text-sm">Drivers License</label>
            <input name="drivers_license" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.drivers_license || ""} />
          </div>

          {/* Employment Information */}
          <div>
            <label className="block text-sm">Employee Status</label>
            <select name="employee_status" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.employee_status || ""}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="TERMINATED">TERMINATED</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Hire Date</label>
            <input name="hire_date" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="date" value={form.hire_date ? form.hire_date.toString() : ""} />
          </div>
          <div>
            <label className="block text-sm">Termination Date</label>
            <input name="termination_date" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="date" value={form.termination_date ? form.termination_date.toString() : ""} />
          </div>
          <div>
            <label className="block text-sm">Termination Reason</label>
            <textarea name="termination_reason" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.termination_reason || ""} />
          </div>

          {/* Position Details */}
          <div>
            <label className="block text-sm">Position Title</label>
            <input name="position_title" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.position_title || ""} />
          </div>
          <div>
            <label className="block text-sm">Job Level</label>
            <input name="job_level" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.job_level || ""} />
          </div>
          <div>
            <label className="block text-sm">Cost Center</label>
            <input name="cost_center" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.cost_center || ""} />
          </div>

          {/* Compensation */}
          <div>
            <label className="block text-sm">Salary</label>
            <input name="salary" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="number" step="0.01" value={form.salary || ""} />
          </div>
          <div>
            <label className="block text-sm">Salary Currency</label>
            <input name="salary_currency" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.salary_currency || ""} />
          </div>
          <div>
            <label className="block text-sm">Payment Frequency</label>
            <input name="payment_frequency" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.payment_frequency || ""} />
          </div>
          <div>
            <label className="block text-sm">Payment Method</label>
            <input name="payment_method" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.payment_method || ""} />
          </div>
          <div>
            <label className="block text-sm">Bank Name</label>
            <input name="bank_name" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.bank_name || ""} />
          </div>
          <div>
            <label className="block text-sm">Bank Account Number</label>
            <input name="bank_account_number" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.bank_account_number || ""} />
          </div>
          <div>
            <label className="block text-sm">CLABE</label>
            <input name="clabe" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.clabe || ""} />
          </div>

          {/* Contract Type */}
          <div>
            <label className="block text-sm">Contract Type</label>
            <input name="contract_type" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.contract_type || ""} />
          </div>
          <div>
            <label className="block text-sm">Work Schedule</label>
            <input name="work_schedule" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.work_schedule || ""} />
          </div>

          {/* System */}
          <div className="flex items-center mb-3">
            <input name="is_active" type="checkbox" onChange={onChange} className="mr-2" checked={form.is_active || false} />
            <label className="block text-sm">Is Active</label>
          </div>
          <div>
            <label className="block text-sm">Last Login</label>
            <input name="last_login" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="datetime-local" value={form.last_login ? new Date(form.last_login).toISOString().slice(0, 16) : ""} />
          </div>

          {/* Benefits */}
          <div className="flex items-center mb-3">
            <input name="infonavit_credit" type="checkbox" onChange={onChange} className="mr-2" checked={form.infonavit_credit || false} />
            <label className="block text-sm">Infonavit Credit</label>
          </div>
          <div>
            <label className="block text-sm">Infonavit Number</label>
            <input name="infonavit_number" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.infonavit_number || ""} />
          </div>
          <div>
            <label className="block text-sm">Infonavit Discount</label>
            <input name="infonavit_discount" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="number" step="0.01" value={form.infonavit_discount || ""} />
          </div>
          <div className="flex items-center mb-3">
            <input name="fonacot_credit" type="checkbox" onChange={onChange} className="mr-2" checked={form.fonacot_credit || false} />
            <label className="block text-sm">Fonacot Credit</label>
          </div>
          <div>
            <label className="block text-sm">Fonacot Number</label>
            <input name="fonacot_number" onChange={onChange} className="w-full p-2 rounded mb-3 border" value={form.fonacot_number || ""} />
          </div>

          {/* Audit Fields */}
          <div>
            <label className="block text-sm">Created By</label>
            <input name="created_by" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="number" value={form.created_by || ""} />
          </div>
          <div>
            <label className="block text-sm">Updated By</label>
            <input name="updated_by" onChange={onChange} className="w-full p-2 rounded mb-3 border" type="number" value={form.updated_by || ""} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {saving ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
