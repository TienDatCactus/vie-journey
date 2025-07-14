import { Injectable } from '@nestjs/common';
import { TripService } from '../trip.service';
import { randomUUID } from 'crypto';
import { Plan } from 'src/common/entities/plan.entity';

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
    user?: {
      id: string;
      email: string;
      fullName: string;
    },
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
    // Add user info to notes
    if (section === 'notes' && user) {
      (item as any).by = user.fullName || user.email;
    }
    if (section === 'itineraries' && user) {
      (item as any).createdBy = user.fullName || user.email;
      (item as any).createdAt = new Date().toISOString();
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
    user?: string,
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

  async savePlan(tripId: string) {
    const state = this.planStates.get(tripId);
    if (!state) return;
    console.log(JSON.stringify(state.plan, null, 1));
    try {
      this.savingStatus.set(tripId, true);
      this.emitSaveStatus(tripId, 'saving');
      await this.tripService.updatePlan(tripId, state.plan);
      this.savingStatus.set(tripId, false);
      console.log(`Plan saved for trip: ${tripId}`);
      this.emitSaveStatus(tripId, 'saved');
    } catch (error) {
      this.savingStatus.set(tripId, false);

      console.error(`Failed to save plan for trip: ${tripId}`, error);

      this.emitSaveStatus(tripId, 'error', error.message);
    }
  }
  public notifySaveStatus?: (
    tripId: string,
    status: 'saving' | 'saved' | 'error',
    errorMessage?: string,
  ) => void;
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
    await this.savePlan(tripId);
  }
}
