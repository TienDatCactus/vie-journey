export interface Account {
  _id: string;
  email: string;
  role: "USER" | "ADMIN" | "MANAGER";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
}

export interface Trip {
  _id: string;
  title: string;
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
  tripmates: string[];
  visibility: boolean;
  createdBy: Partial<UserInfo>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfo extends Account {
  fullName: string;
  dob: Date | null;
  userId: string;
  phone: string;
  address: string;
  avatar: string;
  lastLoginAt: Date | null;
  flaggedCount: number;
  banReason: string | null;
  bannedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInfoUpdate {
  _id?: string;
  fullName?: string;
  dob?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  lastLoginAt?: Date | null;
  flaggedCount?: number;
  banReason?: string | null;
  bannedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LandingAssets {
  hero?: {
    url?: string;
  }[];
  intro?: {
    url?: string;
  }[];
  destination?: {
    url?: string;
  }[];
  hotel?: {
    url?: string;
  }[];
  creator?: {
    url?: string;
  }[];
}
export interface Asset {
  _id?: string;
  type: string;
  url: string;
  publicId: string;
  location: string;
  assetOwner: string;
  format: string;
  file_size: string;
  dimensions: string;
  userId?: string;
  subsection?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  coordinate: string;
  images: string[]; // Changed from 'image' to 'images' to match backend
}
export interface PlaceData {
  displayName: string;
  placeId: string;
  latitude?: number;
  longitude?: number;
  editorialSummary?: string;
  types?: string[];
  photos?: string[];
  googleMapsURI?: string;
  showDetails?: boolean;
}

export interface ProcessedBlogContent {
  cleanHtml: string;
  places: PlaceData[];
  fullHtml: string;
  wordCount: number;
}

export interface UserDetails {
  destinations: {
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  }[];
  likeCount: number;
  blogCount: number;
  tripCount: number;
}
