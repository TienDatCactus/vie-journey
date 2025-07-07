import { Injectable } from '@nestjs/common';
import { TripService } from '../trip.service';
import { randomUUID } from 'crypto';

export interface Note {
  id: string;
  text: string;
}

export interface Transit {
  id: string;
  note: string;
  cost: number;
  currency: string;
  mode:
    | 'Train'
    | 'Flight'
    | 'Car'
    | 'Bus'
    | 'Boat'
    | 'Walk'
    | 'Bike'
    | 'Others';
  departure: {
    datetime: string;
    location: string;
  };
  arrival: {
    datetime: string;
    location: string;
  };
}
export interface Place {
  id: string;
  name: string;
  placeId?: string;
  note?: string;
}
export interface Itinerary {
  id: string;
  date: string; // ISO date string
  place?: {
    placeId?: string | null; // Google Place ID
    displayName: string;
    types: string[];
    photo: string;
    editorialSummary?: string;
    location?: {
      lat: number;
      lng: number;
    }; // Location coordinates
    time?: string; // ISO time string
    cost?: number;
  };
  note: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  isEditing?: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  type:
    | 'Flights'
    | 'Lodging'
    | 'Car rental'
    | 'Transit'
    | 'Food'
    | 'Drinks'
    | 'Sightseeing'
    | 'Activities'
    | 'Shopping'
    | 'Gas'
    | 'Groceries'
    | 'Other';
  desc: string;
  payer: string;
  splits: {
    splitWith: string[];
    amount: number;
    isSettled: boolean;
  };
}
export interface Plan {
  notes: Note[];
  transits: Transit[];
  places: Place[];
  itineraries: Itinerary[];
  budget: number;
  expenses: Expense[];
}

export type PlanSection = keyof Plan;

type AddPayload<T extends PlanSection> =
  Plan[T] extends Array<infer U> ? Omit<U, 'id'> : never;

type UpdatePayload<T extends PlanSection> =
  Plan[T] extends Array<infer U> ? U : Partial<Plan[T]>;

type DeletePayload<T extends PlanSection> =
  Plan[T] extends Array<infer U>
    ? U extends { id: infer ID }
      ? ID
      : never
    : never;

type WithId<T, K> =
  T extends Array<infer U> ? (U extends { id: K } ? U : never) : never;

export interface AddMessage<T extends PlanSection> {
  section: T;
  item: AddPayload<T>;
}

export interface UpdateMessage<T extends PlanSection> {
  section: T;
  item: UpdatePayload<T>;
}

export interface DeleteMessage<T extends PlanSection> {
  section: T;
  itemId: DeletePayload<T>;
}

@Injectable()
export class PlanStateService {
  private readonly saveDelayMillis = 20000;
  private planStates = new Map<
    string,
    { plan: Plan; timeout?: NodeJS.Timeout }
  >(); // NOTE: Replace this with Redis service

  constructor(private readonly tripService: TripService) {}

  addItem<T extends PlanSection>(
    tripId: string,
    section: T,
    item: AddPayload<T>,
  ): string {
    const plan = this.getOrCreatePlan(tripId);
    if (section === 'budget') {
      if (typeof item == 'number' || typeof item === 'string') {
        plan.budget = item;
        this.scheduleSave(tripId);
        return 'budget';
      } else {
        throw new Error('Invalid budget payload');
      }
    }
    if (!Array.isArray(plan[section])) {
      throw new Error(
        `Section ${section} is not an array and cannot add items to it`,
      );
    }
    type Item = WithId<Plan[T], string>;
    const newItem: Item = {
      ...(item as Omit<Item, 'id'>),
      id: randomUUID().toString(),
    } as Item;
    (plan[section] as Item[]).push(newItem);
    this.scheduleSave(tripId);
    return newItem.id;
  }

  updateItem<T extends PlanSection>(
    tripId: string,
    section: T,
    item: UpdatePayload<T>,
  ) {
    const plan = this.getOrCreatePlan(tripId);

    if (Array.isArray(plan[section])) {
      type Item = WithId<Plan[T], string>;
      const index = (plan[section] as Item[]).findIndex(
        (i) => i.id === (item as Item).id,
      );
      if (index !== -1) {
        (plan[section] as Item[])[index] = {
          ...(plan[section][index] as Item),
          ...(item as Partial<Item>),
        };
      }
      this.scheduleSave(tripId);
    } else {
      throw new Error(`Update not supported for section: ${section}`);
    }
  }

  deleteItem<T extends PlanSection>(
    tripId: string,
    section: T,
    itemId: DeletePayload<T>,
  ) {
    const plan = this.getOrCreatePlan(tripId);

    if (Array.isArray(plan[section])) {
      type Item = WithId<Plan[T], string>;
      const index = (plan[section] as Item[]).findIndex(
        (i) => i.id === (itemId as string),
      );
      if (index !== -1) {
        console.log('first', plan);
        (plan[section] as Item[]).splice(index, 1);
        console.log('then', plan);
      }
      this.scheduleSave(tripId);
    }
  }

  // Add to PlanStateService class
  private savingStatus = new Map<string, boolean>();

  // Check if a plan is currently being saved
  public isSavingPlan(tripId: string): boolean {
    return this.savingStatus.get(tripId) === true;
  }

  // Update the savePlan method to track save status
  async savePlan(tripId: string) {
    const state = this.planStates.get(tripId);
    if (!state) return;
    console.log(`[DEBUG] Memory state before saving (Trip ${tripId}):`);
    try {
      // Mark as saving
      this.savingStatus.set(tripId, true);
      this.emitSaveStatus(tripId, 'saving');
      await this.tripService.updatePlan(tripId, state.plan);
      this.savingStatus.set(tripId, false);
      console.log(`Plan saved for trip: ${tripId}`);
      this.emitSaveStatus(tripId, 'saved');
    } catch (error) {
      // Mark as not saving on error
      this.savingStatus.set(tripId, false);

      console.error(`Failed to save plan for trip: ${tripId}`, error);

      // Notify clients about save error
      this.emitSaveStatus(tripId, 'error', error.message);
    }
  }
  public notifySaveStatus?: (
    tripId: string,
    status: 'saving' | 'saved' | 'error',
    errorMessage?: string,
  ) => void;
  // Helper method to emit save status
  private emitSaveStatus(
    tripId: string,
    status: 'saving' | 'saved' | 'error',
    errorMessage?: string,
  ) {
    this.notifySaveStatus?.(tripId, status, errorMessage);
  }

  scheduleSave(tripId: string) {
    const state = this.planStates.get(tripId);
    if (!state) return;
    if (state.timeout) clearTimeout(state.timeout);
    state.timeout = setTimeout(
      () => this.savePlan(tripId),
      this.saveDelayMillis,
    );
  }

  getOrCreatePlan(tripId: string): Plan {
    let state = this.planStates.get(tripId);
    if (!state) {
      state = {
        plan: {
          notes: [],
          places: [],
          transits: [],
          itineraries: [],
          budget: 0,
          expenses: [],
        },
      };
      this.planStates.set(tripId, state);
    }
    return state.plan;
  }
  public initializePlan(tripId: string, plan: Plan): void {
    this.planStates.set(tripId, {
      plan,
      timeout: undefined,
    });
  }
  // Add to PlanStateService
  public async forceSave(tripId: string): Promise<void> {
    const state = this.planStates.get(tripId);
    if (!state) return;
    if (state.timeout) {
      clearTimeout(state.timeout);
      state.timeout = undefined;
    }
    console.log(`[FORCE SAVE] Force saving plan for trip ${tripId}:`);
    await this.savePlan(tripId); // <-- Await the save
  }
}
