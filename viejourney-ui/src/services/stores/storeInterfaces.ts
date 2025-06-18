import { UserInfo } from "../../utils/interfaces";

export interface NoteData {
  _id: string;
  content: string;
  by: UserInfo | null;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface TransitData {
  _id: string;
  note: string;
  cost: number;
  currency: string;
  mode:
    | "Train"
    | "Flight"
    | "Car"
    | "Bus"
    | "Boat"
    | "Walk"
    | "Bike"
    | "Others";
  departure: {
    date: string; // ISO date string
    time: string; // ISO time string
    location: string;
  };
  arrival: {
    date: string; // ISO date string
    time: string; // ISO time string
    location: string;
  };
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface PlaceData extends google.maps.places.PlaceResult {
  _id: String;
  placeId: google.maps.places.PlacePrediction["placeId"];
  content: string;
  visited: boolean;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface PlaceNote {
  _id: string;
  placeId: string;
  note: string;
  visited: boolean;
  addedBy: UserInfo;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Intinerary {
  _id: string;
  date: string; // ISO date string
  placeId: string;
  note: string;
  time: {
    startTime: string; // ISO time string
    endTime: string; // ISO time string
  };
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Expense {
  _id: string;
  paidAt: string; // place title
  paidBy: UserInfo;
  paidOn: string; // ISO date string
  amount: number;
  type: string;
  currency: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
