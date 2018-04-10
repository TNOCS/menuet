import { IAction } from './action';
import { IMenu } from './menu';

export interface IMenuConfiguration {
  author?: string;
  version?: string;
  menus: IMenu[];
  actions?: IAction[];
}