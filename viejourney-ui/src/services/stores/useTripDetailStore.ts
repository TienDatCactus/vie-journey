// store/useTripDetailStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Expense,
  Intinerary,
  NoteData,
  PlaceNote,
  TransitData,
} from "./storeInterfaces";
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

  transits: TransitData[];
  addTransit: (transit: TransitData) => void;
  updateTransit: (id: string, transit: Partial<TransitData>) => void;
  toggleEditTransit: (id: string) => void;
  deleteTransit: (id: string) => void;

  placeNotes: PlaceNote[];
  addPlaceNote: (note: PlaceNote) => void;
  updatePlaceNote: (id: string, content: string, visited: boolean) => void;
  toggleEditPlaceNotes: (id: string) => void;
  deletePlaceNote: (id: string) => void;
  setPlaceNotes: (notes: PlaceNote[]) => void;
  togglePlaceVisited: (id: string, visited: boolean) => void;

  itineraries: Intinerary[];
  addItinerary: (itinerary: Intinerary) => void;
  updateItinerary: (id: string, itinerary: Partial<Intinerary>) => void;
  deleteItinerary: (id: string) => void;
  toggleEditItinerary: (id: string) => void;

  expenses: Expense[];
}

export const useTripDetailStore = create<TripDetailStore>()(
  devtools(
    (set, get) => ({
      notes: [],
      placeNotes: [],
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, content) =>
        set((state) => ({
          notes: state.notes.map((n) => (n._id === id ? { ...n, content } : n)),
        })),
      toggleEditNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n._id === id ? { ...n, isEditing: !n.isEditing } : n
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n._id !== id),
        })),

      transits: [],
      addTransit: (transit) =>
        set((state) => ({ transits: [...state.transits, transit] })),
      updateTransit: (id, updated) =>
        set((state) => ({
          transits: state.transits.map((t) =>
            t._id === id ? { ...t, ...updated } : t
          ),
        })),
      toggleEditTransit: (id) =>
        set((state) => ({
          transits: state.transits.map((t) =>
            t._id === id ? { ...t, isEditing: !t.isEditing } : t
          ),
        })),
      deleteTransit: (id) =>
        set((state) => ({
          transits: state.transits.filter((t) => t._id !== id),
        })),

      // Place notes implementation
      addPlaceNote: (note) =>
        set((state) => ({
          placeNotes: [...state.placeNotes, note],
        })),

      updatePlaceNote: (id, note, visited) =>
        set((state) => ({
          placeNotes: state.placeNotes.map((n) =>
            n._id === id ? { ...n, note, visited } : n
          ),
        })),

      toggleEditPlaceNotes: (id) =>
        set((state) => ({
          placeNotes: state.placeNotes.map((n) =>
            n._id === id ? { ...n, isEditing: !n.isEditing } : n
          ),
        })),

      deletePlaceNote: (id) =>
        set((state) => ({
          placeNotes: state.placeNotes.filter((n) => n._id !== id),
        })),

      togglePlaceVisited: (id, visited) =>
        set((state) => ({
          placeNotes: state.placeNotes.map((n) =>
            n._id === id ? { ...n, visited } : n
          ),
        })),
      trip: {} as Trip,
      setTrip: (trip) => set(() => ({ trip })),
      addItinerary: (itinerary) =>
        set((state) => ({
          itineraries: [...state.itineraries, itinerary],
        })),
      updateItinerary: (id, updated) =>
        set((state) => ({
          itineraries: state.itineraries.map((i) =>
            i._id === id ? { ...i, ...updated } : i
          ),
        })),
      deleteItinerary: (id) =>
        set((state) => ({
          itineraries: state.itineraries.filter((i) => i._id !== id),
        })),
      toggleEditItinerary: (id) =>
        set((state) => ({
          itineraries: state.itineraries.map((i) =>
            i._id === id ? { ...i, isEditing: !i.isEditing } : i
          ),
        })),
    }),
    { name: "trip-detail-storage" }
  )
);
