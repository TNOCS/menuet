export enum RequestTypeEnum {
  OPEN,
  CLOSE,
  ENABLE,
  DISABLE
}

export enum RequestStatus {
  SUCCEEDED,
  FAILED,
  PENDING
}

export type RequestType = keyof typeof RequestTypeEnum;

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
  /** DIS/RPR Entity Identifier struct of the target Entity for this request */
  entityId: IEntityId;
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
