"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import type { DoctorProfile, PatientProfile } from "@/lib/validation";
import { formatDate } from "@/lib/utils";

type UserType = "doctor" | "patient";

interface ProfileCardProps {
  loading: boolean;
  user?: DoctorProfile | PatientProfile;
  type: UserType;
  error?: string;
  onRetry?: () => void;
}

// Type guards
function isDoctor(user: DoctorProfile | PatientProfile): user is DoctorProfile {
  return user.role === "DOCTOR";
}

function isPatient(
  user: DoctorProfile | PatientProfile
): user is PatientProfile {
  return user.role === "PATIENT";
}

export default function ProfileCard({
  loading,
  user,
  error,
  onRetry,
}: ProfileCardProps) {
  if (loading) {
    return (
      <Card className="border border-border/30 shadow-lg rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <Skeleton className="h-24 w-24 rounded-full animate-pulse" />
          <div className="flex-1 space-y-3 w-full">
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-border/30 shadow-lg rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              aria-label="Retry loading profile"
            >
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border border-border/30 shadow-lg rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No profile information available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/30 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {isDoctor(user) ? "Doctor Profile" : "Patient Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
        {/* Avatar */}
        <Avatar className="h-24 w-24 ring-2 ring-primary/20 ring-offset-2">
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
            {user.name?.charAt(0).toUpperCase() || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Name and Email */}
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {isDoctor(user) ? `Dr. ${user.name}` : user.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>

          {/* Phone */}
          {user.phone && <Badge variant="secondary">Phone: {user.phone}</Badge>}

          {/* Doctor-specific fields */}
          {isDoctor(user) && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {user.specialization} • License: #{user.licenseNumber}
              </p>
              {user.bio && (
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {user.bio}
                </p>
              )}
              <Badge className="bg-green-100 text-green-800 font-medium">
                Verified Doctor
              </Badge>
            </div>
          )}

          {/* Patient-specific fields */}
          {isPatient(user) && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {user.gender && (
                <Badge
                  variant="secondary"
                  className="text-sm border-border/50 bg-background/50"
                >
                  Gender: {user.gender}
                </Badge>
              )}
              {user.dateOfBirth && (
                <Badge
                  variant="outline"
                  className="text-sm border-border/50 bg-background/50"
                >
                  DOB: {formatDate(user.dateOfBirth)}
                </Badge>
              )}
              {user.bloodGroup && (
                <Badge
                  variant="outline"
                  className="text-sm border-border/50 bg-background/50"
                >
                  Blood Group: {user.bloodGroup}
                </Badge>
              )}
              {user.genotype && (
                <Badge
                  variant="outline"
                  className="text-sm border-border/50 bg-background/50"
                >
                  Genotype: {user.genotype}
                </Badge>
              )}
              {user.address && (
                <Badge
                  variant="outline"
                  className="text-sm border-border/50 bg-background/50 max-w-[250px] truncate"
                  title={user.address}
                >
                  Address: {user.address}
                </Badge>
              )}
              {user.verified && (
                <Badge className="bg-green-100 text-green-800 font-medium">
                  Verified Patient
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
