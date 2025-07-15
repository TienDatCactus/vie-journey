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
  id: string;
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
  place?: {
    placeId: string; // Google Place ID
    displayName: string;
    types: string[];
    photo: string;
    editorialSummary?: string;
    regularOpeningHours?: any;
    websiteURI: string;
    priceLevel: string;
    rating: number;
    googleMapsURI: string;
    userRatingCount: number;
    createdBy?: Partial<UserInfo>; // User who created this place
  };
  note: string;
  visited: boolean;
  isEditing?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
export interface Itinerary {
  id: string;
  date: string; // ISO date string
  place?: {
    placeId?: string | null; // Google Place ID
    displayName: string;
    types: string[];
    photo: string;
    editorialSummary?: string;
    location?: {
      lat: number;
      lng: number;
    }; // Location coordinates
    time?: string;
    cost?: number;
    createdBy?: Partial<UserInfo>; // User who created this place
  };
  note: string;

  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  isEditing?: boolean;
}

export interface Expense {
  id?: string;
  amount: number;
  currency: string;
  type:
    | "Flights"
    | "Lodging"
    | "Car rental"
    | "Transit"
    | "Food"
    | "Drinks"
    | "Sightseeing"
    | "Activities"
    | "Shopping"
    | "Gas"
    | "Groceries"
    | "Other";
  desc: string;
  payer: string;
  splits: {
    splitWith: string[];
    amount: number;
    isSettled: boolean;
  };
}
