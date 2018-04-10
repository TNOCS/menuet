import { EventType } from './message';

export interface ICondition {
  eventId: string;
  event?: EventType;
  data?: string;
  value?: number;
}
