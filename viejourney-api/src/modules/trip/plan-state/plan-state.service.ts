import { Injectable } from '@nestjs/common';
import { TripService } from '../trip.service';
import { randomUUID } from 'crypto';

export interface Note {
  id: string;
  text: string;
}

export interface Plan {
  notes: Note[];
  expenses: { placeholder1: string; placeholder2: string };
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
    } else {
      const update: Plan[T] = {
        ...plan[section],
        ...(item as Partial<Plan[T]>),
      };
      plan[section] = update;
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
        (plan[section] as Item[]).splice(index, 1);
      }
      this.scheduleSave(tripId);
    }
  }

  savePlan(tripId: string) {
    const plan = this.planStates.get(tripId);
    if (!plan) return;
    // NOTE: Persist plan state in db
  }

  private scheduleSave(tripId: string) {
    const state = this.planStates.get(tripId);
    if (!state) return;
    if (state.timeout) clearTimeout(state.timeout);
    state.timeout = setTimeout(
      () => this.savePlan(tripId),
      this.saveDelayMillis,
    );
  }

  private getOrCreatePlan(tripId: string): Plan {
    let state = this.planStates.get(tripId);
    if (!state) {
      state = {
        plan: { notes: [], expenses: { placeholder1: '', placeholder2: '' } },
      };
      this.planStates.set(tripId, state);
    }
    return state.plan;
  }
}
