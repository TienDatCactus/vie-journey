// src/services/stores/useHotelStore.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { enqueueSnackbar } from "notistack";
import { doGetAllHotels, doGetHotelById } from "../api";
import { Hotel } from "../../utils/interfaces";

interface HotelFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minRating?: number;
  maxPrice?: number;
  amenities?: string[];
}

interface HotelState {
  hotels: Hotel[];
  currentHotel: Hotel | null;
  loading: boolean;
  searchFilters: HotelFilters;
  featuredHotels: Hotel[];
  nearbyHotels: Hotel[];
}

interface HotelActions {
  // Hotel search and filters
  searchHotels: (filters: HotelFilters) => Promise<void>;
  updateFilters: (filters: Partial<HotelFilters>) => void;
  clearFilters: () => void;

  // Individual hotel
  getHotelById: (id: string) => Promise<void>;
  setCurrentHotel: (hotel: Hotel | null) => void;

  // Featured and nearby
  getFeaturedHotels: () => Promise<void>;
  getNearbyHotels: (latitude: number, longitude: number) => Promise<void>;

  // Utility
  clearHotels: () => void;
}

type HotelStore = HotelState & HotelActions;

const initialState: HotelState = {
  hotels: [],
  currentHotel: null,
  loading: false,
  searchFilters: {},
  featuredHotels: [],
  nearbyHotels: [],
};

export const useHotelStore = create<HotelStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    searchHotels: async (filters: HotelFilters) => {
      set({ loading: true, searchFilters: filters });

      try {
        const allHotels = await doGetAllHotels();

        // Apply client-side filtering
        let filteredHotels = allHotels;

        if (filters.location) {
          filteredHotels = filteredHotels.filter(
            (hotel) =>
              hotel.address
                ?.toLowerCase()
                .includes(filters.location!.toLowerCase()) ||
              hotel.name
                ?.toLowerCase()
                .includes(filters.location!.toLowerCase())
          );
        }

        if (filters.minRating && filters.minRating > 0) {
          filteredHotels = filteredHotels.filter(
            (hotel) => hotel.rating >= filters.minRating!
          );
        }

        // Sort by rating (highest first)
        filteredHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        set({ hotels: filteredHotels, loading: false });

        console.log("Hotels searched:", {
          total: allHotels.length,
          filtered: filteredHotels.length,
          filters,
        });
      } catch (error) {
        console.error("Failed to search hotels:", error);
        enqueueSnackbar("Failed to load hotels", { variant: "error" });
        set({ loading: false });
      }
    },

    updateFilters: (newFilters: Partial<HotelFilters>) => {
      set((state) => ({
        searchFilters: { ...state.searchFilters, ...newFilters },
      }));
    },

    clearFilters: () => {
      set({ searchFilters: {} });
    },

    getHotelById: async (id: string) => {
      set({ loading: true });

      try {
        const hotel = await doGetHotelById(id);
        set({ currentHotel: hotel, loading: false });
      } catch (error) {
        console.error("Failed to get hotel:", error);
        enqueueSnackbar("Failed to load hotel details", { variant: "error" });
        set({ loading: false });
      }
    },

    setCurrentHotel: (hotel: Hotel | null) => {
      set({ currentHotel: hotel });
    },

    getFeaturedHotels: async () => {
      try {
        const allHotels = await doGetAllHotels();
        // Get top-rated hotels as featured
        const featured = allHotels
          .filter((hotel) => hotel.rating >= 4.0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6);

        set({ featuredHotels: featured });
      } catch (error) {
        console.error("Failed to get featured hotels:", error);
      }
    },

    getNearbyHotels: async (latitude: number, longitude: number) => {
      try {
        const allHotels = await doGetAllHotels();

        // Calculate distance and sort by proximity
        const hotelsWithDistance = allHotels.map((hotel) => {
          const hotelCoord =
            typeof hotel.coordinate === "string"
              ? JSON.parse(hotel.coordinate)
              : hotel.coordinate;

          const distance = calculateDistance(
            latitude,
            longitude,
            hotelCoord?.lat || 0,
            hotelCoord?.lng || 0
          );

          return { ...hotel, distance };
        });

        const nearby = hotelsWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 8);

        set({ nearbyHotels: nearby });
      } catch (error) {
        console.error("Failed to get nearby hotels:", error);
      }
    },

    clearHotels: () => {
      set({
        hotels: [],
        currentHotel: null,
        featuredHotels: [],
        nearbyHotels: [],
      });
    },
  }))
);

// Helper function to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
