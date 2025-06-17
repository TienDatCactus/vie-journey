// store/useTripDetailStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { NoteData, PlaceNote, TransitData } from "./storeInterfaces";
import { Trip } from "./storeTypes";

interface TripDetailStore {
  trip: Trip;
  setTrip: (trip: Trip) => void;
  //   trip: Trip | null;
  notes: NoteData[];
  addNote: (note: NoteData) => void;
  updateNote: (id: string, content: string) => void;
  toggleEditNote: (id: string) => void;
  deleteNote: (id: string) => void;
  setNotes: (notes: NoteData[]) => void;

  transits: TransitData[];
  addTransit: (transit: TransitData) => void;
  updateTransit: (id: string, transit: Partial<TransitData>) => void;
  toggleEditTransit: (id: string) => void;
  deleteTransit: (id: string) => void;
  setTransits: (transits: TransitData[]) => void;

  placeNotes: PlaceNote[];
  placeDetails: Record<string, google.maps.places.Place>;

  addPlaceNote: (note: PlaceNote) => void;
  updatePlaceNote: (id: string, content: string) => void;
  toggleEditPlaceNotes: (id: string) => void;
  deletePlaceNote: (id: string) => void;
  setPlaceNotes: (notes: PlaceNote[]) => void;
  togglePlaceVisited: (id: string) => void;
  setPlaceDetails: (placeId: string, detail: google.maps.places.Place) => void;

  //   places: Place[];
  //   transits: Transit[];
  //   itineraries: DayItinerary[];
  //   expenses: Expense[];

  // CRUD methods (you can later modularize these)

  //   addPlace: (place: Place) => void;
  //   updatePlace: (place: Place) => void;
  //   deletePlace: (id: string) => void;

  // ...
}

export const useTripDetailStore = create<TripDetailStore>()(
  devtools(
    (set, get) => ({
      notes: [],
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, content) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, content } : n)),
        })),
      toggleEditNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isEditing: !n.isEditing } : n
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),
      setNotes: (notes) => set(() => ({ notes })),
      transits: [],
      addTransit: (transit) =>
        set((state) => ({ transits: [...state.transits, transit] })),
      updateTransit: (id, updated) =>
        set((state) => ({
          transits: state.transits.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        })),
      toggleEditTransit: (id) =>
        set((state) => ({
          transits: state.transits.map((t) =>
            t.id === id ? { ...t, isEditing: !t.isEditing } : t
          ),
        })),
      deleteTransit: (id) =>
        set((state) => ({
          transits: state.transits.filter((t) => t.id !== id),
        })),
      setTransits: (transits) => set(() => ({ transits })),

      // Place notes implementation
      placeNotes: [],
      placeDetails: {},

      addPlaceNote: (note) =>
        set((state) => ({
          placeNotes: [...state.placeNotes, note],
        })),

      updatePlaceNote: (id, note) =>
        set((state) => ({
          placeNotes: state.placeNotes.map((n) =>
            n.id === id ? { ...n, note } : n
          ),
        })),

      toggleEditPlaceNotes: (id) =>
        set((state) => ({
          placeNotes: state.placeNotes.map((n) =>
            n.id === id ? { ...n, isEditing: !n.isEditing } : n
          ),
        })),

      deletePlaceNote: (id) =>
        set((state) => ({
          placeNotes: state.placeNotes.filter((n) => n.id !== id),
        })),
      setPlaceNotes: (notes) => set(() => ({ placeNotes: notes })),
      setPlaceDetails: (placeId, detail) =>
        set((state) => ({
          placeDetails: {
            ...state.placeDetails,
            [placeId]: detail,
          },
        })),
      togglePlaceVisited: (id) =>
        set((state) => ({
          placeNotes: state.placeNotes.map((n) =>
            n.id === id ? { ...n, visited: !n.visited } : n
          ),
        })),
      trip: {} as Trip,
      setTrip: (trip) => set(() => ({ trip })),
    }),
    { name: "trip-detail-storage" }
  )
);
