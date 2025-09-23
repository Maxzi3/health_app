export interface Prescription {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    email: string;
  };
  appointmentId?: string;
  messageId?: string;
  notes?: string;
  status: "ACTIVE" | "COMPLETED" | "PENDING";
  createdAt?: string;
  updatedAt?: string;
  patientId: { name: string; email: string };
  symptoms: string;
  botResponse: string;
  prescriptionNotes?: string;
}
