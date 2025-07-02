// stores/selectedLocationStore.ts
import { create } from "zustand";
import { Itinerary } from "./storeInterfaces";

export type SelectedLocation = Itinerary["place"];

interface State {
  selected?: SelectedLocation | null;
  setSelected: (loc: SelectedLocation) => void;
  clearSelected: () => void;
}

export const useMapPan = create<State>((set) => ({
  selected: null,
  setSelected: (loc) => set({ selected: loc }),
  clearSelected: () => set({ selected: null }),
}));
