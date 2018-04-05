import { IAction } from './action';
import { ICondition } from './condition';

export interface IMenuItem {
  id: string;
  /** ID of the group it belongs too */
  groupId?: string;
  /** As displayed in the GUI */
  title: string;
  description?: string;
  /** Should we display the item in the GUI */
  isVisible?: boolean;
  /** Is the menu item currently active, i.e. action is being run */
  isActive?: boolean;
  /** Is the menu item already activated */
  isActivated?: boolean;
  /** Can we run it only once or multiple times */
  multiple?: number;
  /** IDs of actions */
  actions?: string | string[];
  /** If there are multiple conditions, i.e. we are dealing with an array, combine them using AND */
  conditions: ICondition | ICondition[];
}
