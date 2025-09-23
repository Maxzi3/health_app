"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  DollarSign,
  Bell,
  UserCog,
  CheckCircle,
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
import { DoctorProfile } from "@/lib/validation";
import DashboardStats from "@/components/DashboardStats";
import DashboardTabs from "@/components/DashboardTabs";
import ProfileCard from "@/components/ProfileCard";
import PrescriptionModal from "@/components/PrescriptionModal";
import PrescriptionItem from "@/components/PrescriptionItem";
import AppointmentItem from "@/components/AppointmentItem";
import { Appointment } from "@/types/appointment";
import { Prescription } from "@/types/prescription";

interface DoctorStats {
  upcomingAppointments: number;
  pendingPrescriptions: number;
  totalPatients: number;
  completedConsultations: number;
}

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [doctor, setDoctor] = useState<DoctorProfile | undefined>();
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | Appointment["status"]
  >("PENDING");
  const [statusFilterPrescriptions, setStatusFilterPrescriptions] = useState<
    "ALL" | Prescription["status"]
  >("PENDING");

  const router = useRouter();

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

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointment");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchDoctor(), fetchPrescriptions(), fetchAppointments()]);
  }, []);

  const doctorMenuItems = [
    { value: "profile", label: "Profile", icon: User },
    { value: "appointments", label: "Appointments", icon: Calendar },
    { value: "prescriptions", label: "Prescriptions", icon: FileText },
    { value: "earnings", label: "Earnings", icon: DollarSign },
    { value: "account", label: "Account", icon: UserCog },
    { value: "notifications", label: "Notifications", icon: Bell },
  ];

  const onBackToChat = () => router.back();

  const filteredAppointments =
    statusFilter === "ALL"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const filteredPrescriptions =
    statusFilterPrescriptions === "ALL"
      ? prescriptions
      : prescriptions.filter((p) => p.status === statusFilterPrescriptions);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-card border-b shadow-soft">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBackToChat}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {error ? (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : null}

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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <DashboardTabs
            items={doctorMenuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <TabsContent value="profile">
            <ProfileCard
              loading={loading}
              user={doctor}
              type="doctor"
              error={error || undefined}
              onRetry={fetchDoctor}
            />
          </TabsContent>

          <TabsContent value="account">
            <AccountTab doctor={doctor} setDoctor={setDoctor} />
          </TabsContent>

          <TabsContent value="prescriptions">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="statusFilterPrescriptions"
                  className="mr-2 font-medium"
                >
                  Filter by Status:
                </label>
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
              {filteredPrescriptions.length === 0 ? (
                <p>No prescriptions for selected status.</p>
              ) : (
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredPrescriptions.map((p) => (
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
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 flex items-center">
                <label htmlFor="statusFilter" className="mr-2 font-medium">
                  Filter by Status:
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as "ALL" | Appointment["status"])
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
                    <SelectItem value="CANCELED">CANCELED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {filteredAppointments.length === 0 ? (
                <p>No appointments for selected status.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredAppointments.map((a) => (
                    <AppointmentItem
                      key={a._id}
                      a={a}
                      refresh={() =>
                        Promise.all([fetchAppointments(), fetchDoctor()])
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

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
                  <CardContent>{item.label} Coming Soon or not!</CardContent>
                </Card>
              </TabsContent>
            ))}
        </Tabs>

        {selectedPrescription && (
          <PrescriptionModal
            prescriptionId={selectedPrescription._id}
            onSaved={() => {
              setSelectedPrescription(null);
              Promise.all([fetchPrescriptions(), fetchDoctor()]);
            }}
            refresh={() => Promise.all([fetchPrescriptions(), fetchDoctor()])}
          />
        )}
      </div>
    </div>
  );
}
