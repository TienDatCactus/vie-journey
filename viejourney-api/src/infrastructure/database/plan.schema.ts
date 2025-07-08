import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, Types } from 'mongoose';

// Define sub-schemas for each plan section
@Schema({ _id: false })
class Note {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  text: string;
}

@Schema({ _id: false })
class Location {
  @Prop()
  lat: number;

  @Prop()
  lng: number;
}

@Schema({ _id: false })
class Departure {
  @Prop({ required: true })
  datetime: string;

  @Prop({ required: true })
  location: string;
}

@Schema({ _id: false })
class Arrival {
  @Prop({ required: true })
  datetime: string;

  @Prop({ required: true })
  location: string;
}

@Schema({ _id: false })
class Transit {
  @Prop({ required: true })
  id: string;

  @Prop()
  note: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  currency: string;

  @Prop({
    required: true,
    enum: ['Train', 'Flight', 'Car', 'Bus', 'Boat', 'Walk', 'Bike', 'Others'],
  })
  mode: string;

  @Prop({ type: Departure, required: true })
  departure: Departure;

  @Prop({ type: Arrival, required: true })
  arrival: Arrival;
}

@Schema({ _id: false, timestamps: true })
class Place {
  @Prop({ required: true })
  id: string;
  @Prop({ type: Object, required: true })
  place: {
    placeId: String;
    displayName: String;
    types: [String];
    photo: String;
    editorialSummary: String;
    regularOpeningHours: mongoose.Schema.Types.Mixed;
    websiteURI: String;
    priceLevel: String;
    rating: Number;
    googleMapsURI: String;
    userRatingCount: Number;
  };
  @Prop({ required: false })
  note: String;
  @Prop({ required: false })
  visited: Boolean;
  @Prop({ required: false })
  isEditing: Boolean;
}

@Schema({ _id: false })
class PlaceDetails {
  @Prop()
  placeId?: string;

  @Prop()
  displayName: string;

  @Prop([String])
  types: string[];

  @Prop()
  photo: string;

  @Prop()
  editorialSummary?: string;

  @Prop({ type: Location })
  location?: Location;

  @Prop()
  time?: string;

  @Prop()
  cost?: number;
}

@Schema({ _id: false })
class Itinerary {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  date: string;

  @Prop({ type: PlaceDetails })
  place?: PlaceDetails;

  @Prop()
  note: string;

  @Prop()
  createdAt?: string;

  @Prop()
  updatedAt?: string;

  @Prop()
  isEditing?: boolean;
}

@Schema({ _id: false })
class Split {
  @Prop([String])
  splitWith: string[];

  @Prop()
  amount: number;

  @Prop({ default: false })
  isSettled: boolean;
}

@Schema({ _id: false })
class Expense {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Trip' })
  tripId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({
    required: true,
    enum: [
      'Flights',
      'Lodging',
      'Car rental',
      'Transit',
      'Food',
      'Drinks',
      'Sightseeing',
      'Activities',
      'Shopping',
      'Gas',
      'Groceries',
      'Other',
    ],
  })
  type: string;

  @Prop()
  desc: string;

  @Prop()
  payer: string;

  @Prop({ type: Split })
  splits: Split;
}

@Schema({ _id: false })
class Plan {
  @Prop({ type: [Note], default: [] })
  notes: Note[];

  @Prop({ type: [Transit], default: [] })
  transits: Transit[];

  @Prop({ type: [Place], default: [] })
  places: Place[];

  @Prop({ type: [Itinerary], default: [] })
  itineraries: Itinerary[];

  @Prop({ default: 0 })
  budget: number;

  @Prop({ type: [Expense], default: [] })
  expenses: Expense[];
}

@Schema({ timestamps: true, versionKey: false })
export class TripPlan extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Trip', required: true })
  tripId: mongoose.Types.ObjectId;

  @Prop({
    type: Plan,
    default: {
      notes: [],
      transits: [],
      places: [],
      itineraries: [],
      budget: 0,
      expenses: [],
    },
  })
  plan: Plan;

  @Prop({ default: Date.now })
  lastUpdated: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  lastUpdatedBy: mongoose.Types.ObjectId;
}

export const TripPlanSchema = SchemaFactory.createForClass(TripPlan);
