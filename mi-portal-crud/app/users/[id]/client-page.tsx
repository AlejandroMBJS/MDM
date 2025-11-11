// src/app/users/[id]/client-page.tsx
"use client";
import React, { JSX, useEffect, useState } from "react";
import { User } from "../../../types";
import { fetchUser } from "../../../lib/api";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { parseJwt } from "../../../lib/api";
import UserEmergencyContacts from "../../../components/UserEmergencyContacts";
import UserDependents from "../../../components/UserDependents";
import UserEmployeeDocuments from "../../../components/UserEmployeeDocuments";
import UserJobHistory from "../../../components/UserJobHistory";
import UserTimeOffBalances from "../../../components/UserTimeOffBalances";
import UserEmployeeBenefits from "../../../components/UserEmployeeBenefits";
import UserHorariosBase from "../../../components/UserHorariosBase";
import UserHorariosExcepcion from "../../../components/UserHorariosExcepcion";
import UserPayrollHistory from "../../../components/UserPayrollHistory";
import UserAbsenceRequests from "../../../components/UserAbsenceRequests";
import UserApprovalHistory from "../../../components/UserApprovalHistory";
import UserNotifications from "../../../components/UserNotifications";

interface ClientUserDetailPageProps {
  userId: number;
}

export default function ClientUserDetailPage({ userId }: ClientUserDetailPageProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("mdm_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.role) {
      setRole(decodedToken.role);
    }
    loadUser();
  }, [router, userId]);

  async function loadUser() {
    setLoading(true);
    try {
      const data = (await fetchUser(userId)) as User;
      setUser(data);
    } catch (err) {
      console.error("fetchUser error", err);
      if (err instanceof Error && (err.message.includes("401") || err.message.includes("403"))) {
        localStorage.removeItem("mdm_token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("mdm_token");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-900 text-white">
        <Navbar onLogout={handleLogout} onOpenCreateUser={() => {}} role={role} />
        <div className="mt-6 text-gray-400">Cargando usuario...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-8 bg-gray-900 text-white">
        <Navbar onLogout={handleLogout} onOpenCreateUser={() => {}} role={role} />
        <div className="mt-6 text-red-400">Usuario no encontrado.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Navbar onLogout={handleLogout} onOpenCreateUser={() => {}} role={role} />

      <div className="mt-6">
        <h2 className="text-3xl font-bold mb-4">Detalles del Usuario: {user.name}</h2>
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700 mb-6">
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg"><strong>Rol:</strong> {user.role}</p>
          <p className="text-lg"><strong>Activo:</strong> {user.is_active ? "Sí" : "No"}</p>
          <p className="text-sm text-gray-400">Creado: {new Date(user.created_at).toLocaleString()}</p>
        </div>

        {/* Nested component for Emergency Contacts */}
        <UserEmergencyContacts userId={userId} />

        {/* Nested component for Dependents */}
        <UserDependents userId={userId} />

        {/* Nested component for Employee Documents */}
        <UserEmployeeDocuments userId={userId} />

        {/* Nested component for Job History */}
        <UserJobHistory userId={userId} />

        {/* Nested component for Time Off Balances */}
        <UserTimeOffBalances userId={userId} />

        {/* Nested component for Employee Benefits */}
        <UserEmployeeBenefits userId={userId} />

        {/* Nested component for Horarios Base */}
        <UserHorariosBase userId={userId} />

        {/* Nested component for Horarios Excepcion */}
        <UserHorariosExcepcion userId={userId} />

        {/* Nested component for Payroll History */}
        <UserPayrollHistory userId={userId} />

        {/* Nested component for Absence Requests */}
        <UserAbsenceRequests userId={userId} />

        {/* Nested component for Approval History */}
        <UserApprovalHistory userId={userId} />

        {/* Nested component for Notifications */}
        <UserNotifications userId={userId} />
      </div>
    </div>
  );
}