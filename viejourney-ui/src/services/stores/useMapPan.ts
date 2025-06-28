// stores/selectedLocationStore.ts
import { create } from "zustand";

export type SelectedLocation = google.maps.places.Place;

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
