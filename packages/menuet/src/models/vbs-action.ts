export const enum RequestType {
  On = 'ON',
  Off = 'OFF',
  Auto = 'Auto'
}

export const enum RequestStatus {
  Succeeded = 'SUCCEEDED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export const enum RequestGroup {
  MnhznWest = 'MnhznWest',
  MnhznCentrum = 'MnhznCentrum',
  MnhznZuid = 'MnhznZuid',
  MnhznOost = 'MnhznOost',
  MnhznAll = 'MnhznAll',
  Camera = 'Camera',
  PrisonNetwork = 'PrisonNetwork'
}

export type RequestStatusType = keyof typeof RequestStatus;

/** DIS/RPR Entity ID struct */
export interface IEntityId {
  siteId: number;
  applicationId: number;
  enityId: number;
}

/**
 * Request to make a change to an object or entity present in the VBS Simulation Environment.
 */
export interface IActionRequest {
  /** Unique identifier of the Action Request */
  requestId: number;
  group: RequestGroup;
  type: RequestType;
}

/**
 * Response to provide feeedback for an earlier ActionRequest to make a change to an object or entity present in the VBS Simulation Environment.
 */
export interface IActionResponse {
  /** Unique identifier of the corresponding Action Request */
  requestId: number;
  status: RequestStatus;
  /** Optional message indicating the reason for the status response if not succeeded */
  message?: string;
}
