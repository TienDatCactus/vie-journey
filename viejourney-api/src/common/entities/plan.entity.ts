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

export interface Place {
  id: string;
  name: string;
  placeId?: string;
  note?: string;
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

export interface Itinerary {
  id: string;
  date: string; // ISO date string
  place?: PlaceDetails;
  note: string;
  createdAt?: string;
  updatedAt?: string;
  isEditing?: boolean;
}

export interface Split {
  splitWith: string[];
  amount: number;
  isSettled: boolean;
}

export interface Expense {
  id: string; // Note: Using 'id' instead of '_id' to match your service interfaces
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
  splits: Split;
}

export interface Budgeting {
  budget: number;
  expenses: Expense[];
}

export interface Plan {
  notes: Note[];
  transits: Transit[];
  places: Place[];
  itineraries: Itinerary[];
  budgeting: Budgeting;
}

export interface TripPlan extends Document {
  tripId: Types.ObjectId;
  plan: Plan;
  lastUpdated: Date;
  lastUpdatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
