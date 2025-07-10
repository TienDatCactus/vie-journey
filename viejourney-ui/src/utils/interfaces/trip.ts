export interface ITrip {
  _id?: string;
  title: string;
  destination: {
    id: string;
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  startDate: string;
  endDate: string;
  budgetRange?: string;
  tripmateRange?: string;
  description?: string;
  createdBy: string;
  visibility?: boolean;
  tripmates?: string[];
  createdAt?: string;
  updatedAt?: string;
}
