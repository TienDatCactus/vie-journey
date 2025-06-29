// stores/directionStore.ts
import { create } from "zustand";

type DirectionStore = {
  places: {
    id: string;
    fromDate: string;
  }[]; // lưu toàn bộ thứ tự
  travelMode: google.maps.TravelMode | null; // null nếu không có travel mode nào được chọn
  addPlaceId: (id: string, fromDate?: string) => void;
  removePlaceId: (id: string) => void;
  clear: () => void;
  setTravelMode?: (mode: google.maps.TravelMode) => void;
  setPlaceIds: (ids: string[]) => void;
};
export const useDirectionStore = create<DirectionStore>((set) => ({
  places: [],
  travelMode: null,
  setPlaceIds: (ids: string[]) =>
    set({ places: ids.map((id) => ({ id, fromDate: "" })) }),

  addPlaceId: (id, fromDate = "") =>
    set((state) =>
      state.places.some((place) => place.id === id)
        ? state
        : { places: [...state.places, { id, fromDate }] }
    ),

  removePlaceId: (id) =>
    set((state) => ({
      places: state.places.filter((p) => p.id !== id),
    })),

  clear: () =>
    set({
      places: [],
      travelMode: google.maps.TravelMode.DRIVING,
    }),
  setTravelMode: (mode) =>
    set(() => ({
      travelMode: mode,
    })),
}));
