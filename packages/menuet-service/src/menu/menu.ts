import { IMenuGroup } from './menu-group';
import { IMenuItem } from './menu-item';

export interface IMenu {
  /** Unique ID, also used as the route */
  id: string;
  /** Display title in the GUI */
  title: string;
  /** Optional URL of a logo */
  logo?: string;
  /** Description of the menu */
  description?: string;
  /** Groups in the menu */
  menuGroups: IMenuGroup[];
  /** Actual menu items (that should belong to a group) */
  menuItems: IMenuItem[];
}