// types/trip.ts
export interface Trip {
  _id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budgetRange?: string;
  tripmateRange?: string;
  tripmates: string[];
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
  routes: {
    origin: string; // placeId
    destination: string; // placeId
    distance?: string;
    duration?: string;
    transportType: "car" | "walk" | "bus";
    steps?:
      | {
          instructions?: string;
          distance?: string;
          duration?: string;
        }[]
      | undefined;
  }[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
}
