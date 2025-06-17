import { User } from "../../utils/interfaces";

export interface NoteData {
  id: string;
  content: string;
  by: User;
  isEditing?: boolean;
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
}

export interface PlaceData extends google.maps.places.Place {
  _id: String;
  placeId: google.maps.places.PlacePrediction["placeId"];
  content: string;
  visited: boolean;
  isEditing?: boolean;
}

export interface PlaceNote {
  id: string;
  placeId: string;
  note: string;
  visited: boolean;
  addedBy: User;
  isEditing?: boolean;
}

export interface PlaceNotesStore {}
