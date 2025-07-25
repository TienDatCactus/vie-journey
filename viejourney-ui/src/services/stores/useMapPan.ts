// stores/selectedLocationStore.ts
import { create } from "zustand";
import { Itinerary } from "./storeInterfaces";

export type SelectedLocation = Itinerary["place"];

interface State {
  selectedLocation: {
    lat: number;
    lng: number;
  };
  selected?: SelectedLocation | null;
  setSelected: (loc: SelectedLocation) => void;
  setSelectedLocation: (location: { lat: number; lng: number }) => void;
  clearSelected: () => void;
}

export const useMapPan = create<State>((set) => ({
  selected: null,
  selectedLocation: { lat: 0, lng: 0 },
  setSelected: (loc) => set({ selected: loc }),
  setSelectedLocation: (location) =>
    set(() => ({
      selectedLocation: {
        lat: location.lat,
        lng: location.lng,
      },
    })),
  clearSelected: () => set({ selected: null }),
}));
