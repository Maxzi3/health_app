import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  type,
  error,
  onRetry,
}: ProfileCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2 w-full">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-red-500">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 px-3 py-1 rounded bg-primary text-white"
            >
              Retry
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No profile info found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isDoctor(user) ? "Doctor Profile" : "Patient Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <Avatar className="h-20 w-20 bg-gradient-to-br from-primary to-secondary">
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-semibold">
            {isDoctor(user) ? `Dr. ${user.name}` : user.name}
          </h3>
          <p className="text-muted-foreground">{user.email}</p>

          {/* Doctor fields */}
          {isDoctor(user) && (
            <>
              <p className="text-muted-foreground">
                {user.specialization} • License: #{user.licenseNumber}
              </p>
              {user.bio && <p className="text-sm">{user.bio}</p>}
              <Badge className="mt-2">Verified Doctor</Badge>
            </>
          )}

          {/* Patient fields */}
          {isPatient(user) && (
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              {user.gender && (
                <Badge variant="secondary">Gender: {user.gender}</Badge>
              )}
              {user.dateOfBirth && (
                <Badge variant="secondary">
                  DOB: {formatDate(user.dateOfBirth)}
                </Badge>
              )}
              {user.bloodGroup && (
                <Badge variant="secondary">
                  Blood Group: {user.bloodGroup}
                </Badge>
              )}
              {user.genotype && (
                <Badge variant="secondary">Genotype: {user.genotype}</Badge>
              )}
              {user.phone && (
                <Badge variant="secondary">Phone: {user.phone}</Badge>
              )}
              {user.address && (
                <Badge
                  className="max-w-[250px] truncate cursor-pointer"
                  variant="secondary"
                  title={user.address}
                >
                  Address: {user.address}
                </Badge>
              )}
              {user.verified && (
                <Badge className="mt-2">Verified Patient</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
