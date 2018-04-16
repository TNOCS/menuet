import { RequestStatus } from './../models/vbs-action';

export interface IMessage {
  requestId: number;
  /** Optional event id */
  eventId?: string;
  /** Optional string payload */
  message?: string;
  /** Optional number payload */
  value?: number;
  /** Optional boolean payload */
  mode?: boolean;
}

export interface IInputMessage extends IMessage {
  status: RequestStatus;
}

export interface IOutputMessage extends IMessage {
  topic?: string;
}
