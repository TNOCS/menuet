import { IMenuItem } from "./menu-item";

export interface IMenuGroup {
  id: string;
  title: string;
  description?: string;
  children?: IMenuItem[];
}