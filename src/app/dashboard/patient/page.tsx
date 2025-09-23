/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  CreditCard,
  HelpCircle,
  Bell,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import AccountTab from "@/components/AccountsTab";
import { PatientProfile } from "@/lib/validation";
import DashboardStats from "@/components/DashboardStats";
import DashboardTabs from "@/components/DashboardTabs";
import ProfileCard from "@/components/ProfileCard";
import PatientAppointments from "@/components/PatientAppointments";
import { Prescription } from "@/types/prescription";
import { Appointment } from "@/types/appointment";
import PatientPrescriptions from "@/components/PatientPrescriptions";
import toast from "react-hot-toast";

interface PatientStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  totalPrescriptions: number;
}

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [patient, setPatient] = useState<PatientProfile | undefined>();
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statusFilterAppointments, setStatusFilterAppointments] = useState<
    "ALL" | Appointment["status"]
  >("PENDING");
  const [statusFilterPrescriptions, setStatusFilterPrescriptions] = useState<
    "ALL" | Prescription["status"]
  >("PENDING");

  const router = useRouter();

  // 🔹 Fetch patient + stats
  const fetchPatient = async () => {
    try {
      const res = await fetch("/api/user/patient");
      if (!res.ok) throw new Error("Failed to fetch patient");
      const data = await res.json();
      setPatient(data.profile);
      setStats(data.stats);
    } catch (err: any) {
      setError(err);
      toast.error(err.message || "Failed to load patient");
    }
  };

  // 🔹 Fetch prescriptions
  const fetchPrescriptions = async () => {
    try {
      const res = await fetch("/api/prescription");
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      const data = await res.json();
      setPrescriptions(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load prescriptions");
    }
  };

  // 🔹 Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointment");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load appointments");
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchPatient(),
        fetchPrescriptions(),
        fetchAppointments(),
      ]);
      setLoading(false);
    })();
  }, []);

  // ✅ Mark prescription completed
  const markPrescriptionCompleted = async (id: string) => {
    try {
      const res = await fetch(`/api/prescription/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Prescription marked completed");
      fetchPrescriptions(); // refresh only prescriptions
      fetchPatient(); // refresh stats
    } catch {
      toast.error("Failed to update prescription");
    }
  };

  // ✅ Cancel appointment
  const cancelAppointment = async (id: string) => {
    try {
      const res = await fetch(`/api/appointment/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Appointment cancelled");
      fetchAppointments(); // refresh only appointments
      fetchPatient(); // refresh stats
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

  const patientMenuItems = [
    { value: "profile", label: "Profile", icon: User },
    { value: "appointments", label: "Appointments", icon: Calendar },
    { value: "prescriptions", label: "Prescriptions", icon: FileText },
    { value: "billing", label: "Billing", icon: CreditCard },
    { value: "help", label: "Help Center", icon: HelpCircle },
    { value: "account", label: "Account", icon: UserCog },
    { value: "notifications", label: "Notifications", icon: Bell },
  ];

  const onBackToChat = () => router.back();

  const filteredAppointments =
    statusFilterAppointments === "ALL"
      ? appointments
      : appointments.filter((a) => a.status === statusFilterAppointments);

  const filteredPrescriptions =
    statusFilterPrescriptions === "ALL"
      ? prescriptions
      : prescriptions.filter((p) => p.status === statusFilterPrescriptions);

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="bg-card border-b shadow-soft">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBackToChat}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Patient Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {/* Error State */}
        {error && (
          <div className="text-center">
            <p className="text-red-500">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Stats Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/50">
                <CardContent className="p-6 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <DashboardStats
            stats={[
              {
                label: "Upcoming Appointments",
                value: stats.upcomingAppointments,
                icon: Calendar,
                color: "text-trust-blue",
              },
              {
                label: "Active Prescriptions",
                value: stats.activePrescriptions,
                icon: FileText,
                color: "text-health-green",
              },
              {
                label: "Total Prescriptions",
                value: stats.totalPrescriptions,
                icon: FileText,
                color: "text-primary",
              },
            ]}
          />
        ) : null}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <DashboardTabs
            items={patientMenuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Profile */}
          <TabsContent value="profile">
            <ProfileCard user={patient} type="patient" loading={loading} />
          </TabsContent>

          {/* Account */}
          <TabsContent value="account">
            <AccountTab patient={patient} setPatient={setPatient} />
          </TabsContent>

          {/* Appointments */}
          <TabsContent value="appointments">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 flex items-center">
                <label className="mr-2 font-medium">Filter by Status:</label>
                <Select
                  value={statusFilterAppointments}
                  onValueChange={(value) =>
                    setStatusFilterAppointments(
                      value as "ALL" | Appointment["status"]
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <PatientAppointments
                appointments={filteredAppointments}
                loading={loading}
                onCancelAppointment={cancelAppointment}
                refresh={fetchAppointments}
              />
            </div>
          </TabsContent>

          {/* Prescriptions */}
          <TabsContent value="prescriptions">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 flex items-center">
                <label className="mr-2 font-medium">Filter by Status:</label>
                <Select
                  value={statusFilterPrescriptions}
                  onValueChange={(value) =>
                    setStatusFilterPrescriptions(
                      value as "ALL" | Prescription["status"]
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <PatientPrescriptions
                prescriptions={filteredPrescriptions}
                loading={loading}
                onMarkCompleted={markPrescriptionCompleted}
                refresh={fetchPrescriptions}
              />
            </div>
          </TabsContent>

          {/* Other Tabs */}
          {patientMenuItems
            .filter(
              (item) =>
                ![
                  "profile",
                  "account",
                  "appointments",
                  "prescriptions",
                ].includes(item.value)
            )
            .map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent>{item.label} Coming Soon or not!</CardContent>
                </Card>
              </TabsContent>
            ))}
        </Tabs>
      </div>
    </div>
  );
}
