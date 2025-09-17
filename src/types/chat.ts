export interface Doctor {
  id: string; // Changed to string only
  name: string;
  specialty: string;
  rating: number;
  experience: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "USER" | "BOT";
  timestamp: Date | string;
  doctors?: Doctor[];
}
