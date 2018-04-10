export interface ILocation {
  latitude: number;
  longitude: number;
  altitude: number;
}

/**
 * Notify listeners of a particular event that has occurred.
 */
export interface EventMessage {
  /** Unique identifier of the event */
  eventId: string;
  location?: ILocation;
  message?: string;
  count?: number;
  status?: boolean;
}

