export enum EventTypeEnum {
  /** An action was activated (and finished successfully) */
  Activated,
  /** An action is cancelled (but not yet finished) */
  Cancelled,
  /** An internal or external event has occurred */
  Inject
}

export type EventType = keyof typeof EventTypeEnum;
