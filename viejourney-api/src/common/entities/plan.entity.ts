import { Document, Types } from 'mongoose';

export interface Note {
  id: string;
  text: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Departure {
  datetime: string;
  location: string;
}

export interface Arrival {
  datetime: string;
  location: string;
}

export interface Transit {
  id: string;
  note: string;
  cost: number;
  currency: string;
  mode:
    | 'Train'
    | 'Flight'
    | 'Car'
    | 'Bus'
    | 'Boat'
    | 'Walk'
    | 'Bike'
    | 'Others';
  departure: Departure;
  arrival: Arrival;
}

export interface PlaceDetails {
  placeId?: string | null;
  displayName: string;
  types: string[];
  photo: string;
  editorialSummary?: string;
  location?: Location;
  time?: string;
  cost?: number;
}

export interface Note {
  id: string;
  text: string;
  by?: string;
}

export interface Transit {
  id: string;
  note: string;
  cost: number;
  currency: string;
  mode:
    | 'Train'
    | 'Flight'
    | 'Car'
    | 'Bus'
    | 'Boat'
    | 'Walk'
    | 'Bike'
    | 'Others';
  departure: {
    datetime: string;
    location: string;
  };
  arrival: {
    datetime: string;
    location: string;
  };
}
export interface Place {
  id: string;
  place: {
    placeId: string; // Google Place ID
    displayName?: string;
    types?: string[];
    photo?: string;
    editorialSummary?: string;
    regularOpeningHours?: any;
    websiteURI?: string;
    priceLevel?: string;
    rating?: number;
    googleMapsURI?: string;
    userRatingCount?: number;
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
    time?: string; // ISO time string
    cost?: number;
    by?: string;
  };
  note: string;
  createdBy?: string; // User ID of the creator
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
export interface Split {
  splitWith: string[];
  amount: number;
  isSettled: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  type:
    | 'Flights'
    | 'Lodging'
    | 'Car rental'
    | 'Transit'
    | 'Food'
    | 'Drinks'
    | 'Sightseeing'
    | 'Activities'
    | 'Shopping'
    | 'Gas'
    | 'Groceries'
    | 'Other';
  desc: string;
  payer: string;
  splits: {
    splitWith: string[];
    amount: number;
    isSettled: boolean;
  };
}
export interface Plan {
  notes: Note[];
  transits: Transit[];
  places: Place[];
  itineraries: Itinerary[];
  budget: number;
  expenses: Expense[];
}
export interface TripPlan extends Document {
  tripId: Types.ObjectId;
  plan: Plan;
  lastUpdated: Date;
  lastUpdatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
