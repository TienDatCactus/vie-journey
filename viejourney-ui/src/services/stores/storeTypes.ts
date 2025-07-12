import { UserInfo } from "../../utils/interfaces";

// types/trip.ts
export interface Trip {
  _id: string;
  title: string;
  destination: {
    id: string; // Google Place ID or custom ID
    name: string; // Name of the destination
    location: {
      lat: number; // Latitude of the destination
      lng: number; // Longitude of the destination
    };
  };
  startDate: Date;
  endDate: Date;
  tripmates: string[];
  visibility: boolean;
  createdBy: Partial<UserInfo>;
  createdAt: Date;
  updatedAt: Date;
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
  placeId?: string;
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
