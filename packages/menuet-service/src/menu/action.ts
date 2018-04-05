import { IActionResult } from './action-result';
export interface IAction {
  id: string;
  description?: string;
  /** The time in seconds to complete the action. */
  timeout: number;
  /** The time that is still remaining to finish the action. */
  timeRemaining?: number;
  /** Result of the action, e.g. sending a message, or displaying content */
  result?: IActionResult;
  /** If true, an action can be interrupted and continued at a later stage, i.e. the timeRemaining is not reset on cancel. */
  canInterrupt?: boolean;
}