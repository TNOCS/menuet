import { Application } from 'express';
import { IMenu } from './../menu/menu';

export class MenuService {
  constructor(menu: IMenu, app: Application) {}
}