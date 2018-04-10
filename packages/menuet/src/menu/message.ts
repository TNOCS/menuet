export enum EventType {
  /** An action was activated (and finished successfully) */
  Activated,
  /** An action is active (but not yet finished) */
  Activate,
  /** An action is cancelled (but not yet finished) */
  Cancelled,
  /** An internal or external event has occurred */
  Inject
}

export interface IEventMessage {
  type: EventType;
  /** Optional event id */
  eventId?: string;
  /** Optional string payload */
  data?: string;
  /** Optional number payload */
  value?: number;
  /** Optional boolean payload */
  mode?: boolean;
}

export interface IInputMessage extends IEventMessage {}

export interface IOutputMessage extends IEventMessage {}
