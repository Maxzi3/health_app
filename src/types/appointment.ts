export interface Appointment {
  _id: string;
  doctorId?: {
    _id: string;
    name: string;
    email: string;
  };
  patientId?: { name: string; email: string };
  conversationId?: string;
  messageId?: string;
  symptoms: string;
  botResponse: string;
  scheduledAt: Date; 
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt?: string;
  updatedAt?: string;
  appointmentNotes?: string;
}
