"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  FileText,
  Users,
  DollarSign,
  Bell,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountTab from "@/components/AccountsTab";
import { DoctorProfile } from "@/lib/validation";
import DashboardStats from "@/components/DashboardStats";
import DashboardTabs from "@/components/DashboardTabs";
import ProfileCard from "@/components/ProfileCard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorStats {
  todaysAppointments: number;
  activePatients: number;
  monthlyEarnings: string;
}

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [doctor, setDoctor] = useState<DoctorProfile | undefined>();
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctor = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/user/doctor");
      if (!res.ok) throw new Error("Failed to fetch doctor");
      const data = await res.json();
      setDoctor(data);

      // For now, just set dummy stats (replace later with DB values)
      setStats({
        todaysAppointments: 8,
        activePatients: 45,
        monthlyEarnings: "$3,200",
      });
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

  const doctorMenuItems = [
    { value: "profile", label: "Profile", icon: User },
    { value: "appointments", label: "Appointments", icon: Calendar },
    { value: "patients", label: "Patients", icon: Users },
    { value: "prescriptions", label: "Prescriptions", icon: FileText },
    { value: "earnings", label: "Earnings", icon: DollarSign },
    { value: "account", label: "Account", icon: UserCog },
    { value: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft p-4 max-w-7xl mx-auto">
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
              label: "Today's Appointments",
              value: stats.todaysAppointments,
              icon: Calendar,
              color: "text-trust-blue",
            },
            {
              label: "Active Patients",
              value: stats.activePatients,
              icon: Users,
              color: "text-health-green",
            },
            {
              label: "Monthly Earnings",
              value: stats.monthlyEarnings,
              icon: DollarSign,
              color: "text-primary",
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

        {/* Other Tabs */}
        {doctorMenuItems
          .filter(
            (item) => item.value !== "profile" && item.value !== "account"
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
    </div>
  );
}
