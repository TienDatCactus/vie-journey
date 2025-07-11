// store/useTripDetailStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { doGetPlanByTripId, doGetUserTripList, doRemoveTripMate } from "../api";
import {
  Expense,
  Itinerary,
  NoteData,
  PlaceNote,
  TransitData,
} from "./storeInterfaces";
import { Trip } from "./storeTypes";

interface TripDetailStore {
  trip: Trip;
  trips: Trip[];
  setTrip: (trip: Trip) => void;
  //   trip: Trip | null;
  notes: NoteData[];
  addNote: (note: NoteData) => void;
  updateNote: (id: string, content: string) => void;
  toggleEditNote: (id: string) => void;
  deleteNote: (id: string) => void;
  setNotes: (note: NoteData) => void;

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

  itineraries: Itinerary[];
  addItinerary: (itinerary: Itinerary) => void;
  updateItinerary: (id: string, itinerary: Partial<Itinerary>) => void;
  deleteItinerary: (id: string) => void;
  toggleEditItinerary: (id: string) => void;

  totalBudget: number;
  currentUsage: number;
  setTotalBudget: (budget: number) => void;
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  addTripmate: (tripmateEmail: string) => void;
  handleGetUserTrips: () => Promise<void>;
  handleRemoveTripMate: (tripmateEmail: string) => Promise<void>;
  handleGetPlanByTripId: () => Promise<void>;
}

export const useTripDetailStore = create<TripDetailStore>()(
  devtools(
    persist(
      (set, get) => ({
        trips: [],
        setNotes: (note) => set((state) => ({ notes: [...state.notes, note] })),
        setPlaceNotes: (notes) => set(() => ({ placeNotes: notes })),
        notes: [],
        itineraries: [],
        expenses: [],
        placeNotes: [],
        totalBudget: 0,
        currentUsage: 0,
        trip: {} as Trip,
        addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
        updateNote: (id, content) =>
          set((state) => ({
            notes: state.notes.map((n) =>
              n.id === id ? { ...n, content } : n
            ),
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

        // Place notes implementation
        addPlaceNote: (note) =>
          set((state) => ({
            placeNotes: [...state.placeNotes, note],
          })),

        updatePlaceNote: (id, note, visited) =>
          set((state) => ({
            placeNotes: state.placeNotes.map((n) =>
              n.id === id ? { ...n, note, visited } : n
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

        setTrip: (trip) => set(() => ({ trip })),
        addItinerary: (itinerary) =>
          set((state) => ({
            itineraries: [...state.itineraries, itinerary],
          })),
        updateItinerary: (id, updated) =>
          set((state) => ({
            itineraries: state.itineraries.map((i) =>
              i.id === id ? { ...i, ...updated } : i
            ),
          })),
        deleteItinerary: (id) =>
          set((state) => ({
            itineraries: state.itineraries.filter((i) => i.id !== id),
          })),
        toggleEditItinerary: (id) =>
          set((state) => ({
            itineraries: state.itineraries.map((i) =>
              i.id === id ? { ...i, isEditing: !i.isEditing } : i
            ),
          })),
        addExpense: (expense) =>
          set((state) => ({
            expenses: [...state.expenses, expense],
            currentUsage: Number(state.currentUsage) + Number(expense.amount),
          })),
        updateExpense: (id, updated) =>
          set((state) => {
            const updatedExpenses = state.expenses.map((e) =>
              e.id === id ? { ...e, ...updated } : e
            );
            return {
              expenses: updatedExpenses,
              currentUsage: updatedExpenses.reduce(
                (total, expense) => Number(total) + Number(expense.amount),
                0
              ),
            };
          }),

        deleteExpense: (id) =>
          set((state) => {
            const updatedExpenses = state.expenses.filter((e) => e.id !== id);
            return {
              expenses: updatedExpenses,
              currentUsage: updatedExpenses.reduce(
                (total, expense) => Number(total) + Number(expense.amount),
                0
              ),
            };
          }),

        setTotalBudget: (budget) =>
          set(() => ({
            totalBudget: budget,
          })),
        addTripmate: (tripmateEmail) =>
          set((state) => ({
            trip: {
              ...state.trip,
              tripmates: [...state.trip.tripmates, tripmateEmail],
            },
          })),
        handleGetUserTrips: async () => {
          try {
            const res = await doGetUserTripList();
            if (res) {
              set({ trips: res });
            } else {
              console.error("No data received from getUserTrips");
            }
          } catch (error) {
            console.error("Failed to get user trips:", error);
          }
        },
        handleRemoveTripMate: async (tripmateEmail: string) => {
          try {
            const res = await doRemoveTripMate(get().trip._id, tripmateEmail);
            if (res) {
              set((state) => ({
                trip: {
                  ...state.trip,
                  tripmates: state.trip.tripmates.filter(
                    (email) => email !== tripmateEmail
                  ),
                },
              }));
            }
          } catch (error) {
            console.error("Failed to remove trip mate:", error);
          }
        },
        handleGetPlanByTripId: async () => {
          try {
            const res = await doGetPlanByTripId(get().trip._id);
            if (res) {
              const plan = res.plan;
              set(() => ({
                totalBudget: plan.budget,
                expenses: plan.expenses,
                itineraries: plan.itineraries,
                notes: plan.notes,
                placeNotes: plan.places,
                transits: plan.transits,
              }));
            } else {
              console.error("No data received from getPlanByTripId");
            }
          } catch (error) {
            console.error("Failed to get plan by trip ID:", error);
          }
        },
      }),
      {
        name: "trip-detail-storage",
        partialize: (state) => ({
          trips: state.trips,
        }),
      }
    )
  )
);
