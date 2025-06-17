import { UserInfo } from "../../utils/interfaces";
import { create } from "zustand";

export interface NoteData {
  id: string;
  content: string;
  by: UserInfo | null;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface TransitData {
  id: string;
  note: string;
  cost: number;
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
