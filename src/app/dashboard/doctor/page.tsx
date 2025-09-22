"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  FileText,
  DollarSign,
  Bell,
  UserCog,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountTab from "@/components/AccountsTab";
import { DoctorProfile } from "@/lib/validation";
import DashboardStats from "@/components/DashboardStats";
import DashboardTabs from "@/components/DashboardTabs";
import ProfileCard from "@/components/ProfileCard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PrescriptionModal from "@/components/PrescriptionModal";
import PrescriptionItem from "@/components/PrescriptionItem";
import AppointmentItem from "@/components/AppointmentItem";

interface DoctorStats {
  upcomingAppointments: number;
  pendingPrescriptions: number;
  totalPatients: number;
  completedConsultations: number;
}
export interface Prescription {
  _id: string;
  patientId: { name: string; email: string };
  symptoms: string;
  botResponse: string;
  status: string;
  prescriptionNotes?: string;
}

export interface Appointment {
  _id: string;
  patientId: { name: string; email: string };
  symptoms: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";
  note?: string;
}

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [doctor, setDoctor] = useState<DoctorProfile | undefined>();
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchDoctor = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/user/doctor");
      if (!res.ok) throw new Error("Failed to fetch doctor");
      const data = await res.json();

      setDoctor(data.profile);
      setStats(data.stats);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch("/api/prescription");
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      const data = await res.json();
      setPrescriptions(data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    }
  };

  useEffect(() => {
    fetchDoctor();
    fetchPrescriptions();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointment");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data); // 👈 correct state
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchDoctor();
    fetchPrescriptions();
    fetchAppointments();
  }, []);

  const doctorMenuItems = [
    { value: "profile", label: "Profile", icon: User },
    { value: "appointments", label: "Appointments", icon: Calendar },
    { value: "prescriptions", label: "Prescriptions", icon: FileText },
    { value: "earnings", label: "Earnings", icon: DollarSign },
    { value: "account", label: "Account", icon: UserCog },
    { value: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft  max-w-7xl mx-auto">
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
              label: "Pending Prescriptions",
              value: stats.pendingPrescriptions,
              icon: FileText,
              color: "text-health-green",
            },
            {
              label: "Total Patients",
              value: stats.totalPatients,
              icon: User,
              color: "text-primary",
            },
            {
              label: "Completed Consultations",
              value: stats.completedConsultations,
              icon: CheckCircle,
              color: "text-success",
            },
          ]}
        />
      ) : null}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <DashboardTabs
          items={doctorMenuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Profile Tab */}
        <TabsContent value="profile">
          <ProfileCard
            loading={loading}
            user={doctor}
            type="doctor"
            error={error || undefined}
            onRetry={fetchDoctor}
          />
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <AccountTab doctor={doctor} setDoctor={setDoctor} />
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions">
          <div className="max-w-6xl mx-auto">
            {prescriptions.length === 0 ? (
              <p>No prescriptions yet.</p>
            ) : (
              <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {prescriptions.map((p) => (
                  <PrescriptionItem
                    key={p._id}
                    p={p}
                    onEdit={(prescription) =>
                      setSelectedPrescription(prescription)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <div>
            {appointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {appointments.map((a) => (
                  <AppointmentItem
                    key={a._id}
                    a={a}
                    refresh={fetchAppointments}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Other Tabs */}
        {doctorMenuItems
          .filter(
            (item) =>
              item.value !== "profile" &&
              item.value !== "account" &&
              item.value !== "prescriptions" &&
              item.value !== "appointments"
          )
          .map((item) => (
            <TabsContent key={item.value} value={item.value}>
              <Card>
                <CardHeader>
                  <CardTitle>{item.label}</CardTitle>
                </CardHeader>
                <CardContent>{item.label} content goes here</CardContent>
              </Card>
            </TabsContent>
          ))}
      </Tabs>

      {/* Prescription Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescriptionId={selectedPrescription._id}
          onSaved={() => {
            setSelectedPrescription(null);
            fetchPrescriptions();
          }}
        />
      )}
    </div>
  );
}
