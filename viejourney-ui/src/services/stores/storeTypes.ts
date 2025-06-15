// types/trip.ts
export interface Trip {
  _id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budgetRange: string;
  tripmateRange: string;
  description: string;
  visibility: boolean;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Place {
  id: string;
  name: string;
  placeId?: string; // Optional for places not in Google Places
  location: { lat: number; lng: number };
  note?: string;
}

export interface Transit {
  id: string;
  type: "flight" | "bus" | "train" | "car";
  from: string;
  to: string;
  time: string;
}

export interface DayItinerary {
  date: string;
  places: Place[];
  notes: Note[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
}
