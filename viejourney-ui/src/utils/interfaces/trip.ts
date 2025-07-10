export interface ITrip {
  _id: string;
  title: string;
  coverImage?: string; // URL of the cover image
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
  budgetRange?: string;
  tripmateRange?: string;
  tripmates: string[];
  description: string;
  visibility: boolean;
}
