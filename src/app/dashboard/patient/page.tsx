"use client";
import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import AccountTab from "@/components/AccountsTab";
import { PatientProfile } from "@/lib/validation";
import DashboardStats from "@/components/DashboardStats";
import DashboardTabs from "@/components/DashboardTabs";
import ProfileCard from "@/components/ProfileCard";

interface PatientStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  totalConsultations: number;
}

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [patient, setPatient] = useState<PatientProfile | undefined>();
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch("/api/user/patient");
        if (!res.ok) throw new Error("Failed to fetch patient");
        const data = await res.json();
        setPatient(data.profile);
        setStats(data.stats);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, []);

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
        {/* Error State with Retry */}
        {error ? (
          <div className="text-center">
            <p className="text-red-500">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : null}

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
                label: "Total Consultations",
                value: stats.totalConsultations,
                icon: User,
                color: "text-primary",
              },
            ]}
          />
        ) : null}

        {/* Tabs */}
        <div className="mt-6">
          <DashboardTabs
            items={patientMenuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Profile */}
          {activeTab === "profile" && (
            <ProfileCard user={patient} type="patient" loading={loading} />
          )}

          {/* Account */}
          {activeTab === "account" && (
            <AccountTab patient={patient} setPatient={setPatient} />
          )}
          {/* Other Tabs */}
          {patientMenuItems
            .filter(
              (item) => item.value !== "profile" && item.value !== "account"
            )
            .map((item) => (
              <div key={item.value} hidden={activeTab !== item.value}>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent>{item.label} content goes here</CardContent>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
