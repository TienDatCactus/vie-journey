import { UserInfo } from "../../utils/interfaces";

export interface NoteData {
  id: string;
  content: string;
  by: UserInfo | null;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface TransitData {
  id?: string;
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
    datetime: string; // ISO date string
    location: string;
  };
  arrival: {
    datetime: string; // ISO date string
    location: string;
  };
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface PlaceData extends google.maps.places.Place {
  _id: String;
  placeId: google.maps.places.PlacePrediction["placeId"];
  content: string;
  visited: boolean;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface PlaceNote {
  id: string;
  placeId: string;
  note: string;
  visited: boolean;
  addedBy: UserInfo;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Itinerary {
  id: string;
  date: string; // ISO date string
  place?: google.maps.places.Place;
  placeId?: string; // Google Place ID
  note: string;
  time: {
    startTime: string; // ISO time string
    endTime: string; // ISO time string
  };
  cost?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  isEditing?: boolean;
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
