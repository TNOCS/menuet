import { ICondition } from './../menu/condition';
import { IMenuItem } from './../menu/menu-item';
import { IMenuGroup } from './../menu/menu-group';
import { IMenu } from './../menu/menu';
import { ActionService } from './action-service';
import { EventType } from '../menu/message';
import { clone } from '../helpers/utils';

export class MenuService {
  private uiState: IMenuGroup[];
  private activeGroup?: IMenuGroup;
  private activeItem?: IMenuItem;
  private activeResult: any;
  /** The menu is performing some action, and cannot be used */
  private isProcessing = false;
  /** The processing can be cancelled */
  private canCancel?: boolean;
  /** Remaining processing time */
  private processingDone?: Date;
  /** Keep a log for debugging purposes */
  private log: string[] = [];
  /** Timer handle */
  private handle?: NodeJS.Timer;

  constructor(private menu: IMenu, private actionService: ActionService) {
    this.uiState = this.createGUI(menu);
    actionService.on('MenuItemActivated', (id) => this.menuItemActivated(id));
  }

  public get id() { return this.menu.id; }

  public get ui() {
    return {
      state: clone(this.uiState),
      isProcessing: this.isProcessing,
      canCancel: this.canCancel
    };
  }

  /** A menu item was activated: process all related actions, if any */
  public activateMenuItem(menuId: string, cb?: (error?: Error, data?: any) => void) {
    if (this.isProcessing) {
      cb && cb(Error(`MenuItem with id ${menuId} cannot be activated - already processing!`));
    }
    const menuItem = this.getMenuItemById(menuId);
    if (!menuItem) {
      cb && cb(Error(`MenuItem with id ${menuId} cannot be found!`));
      return;
    }
    const { canCancel, timeout } = this.actionService.activateMenuItem(menuItem);
    this.canCancel = canCancel;
    this.startProcessing(timeout);
  }

  /** Start processing one or more actions */
  private startProcessing(timeout = 5, cb?: (error?: Error, data?: boolean) => void) {
    const now = new Date();
    const done = new Date(now.setSeconds(now.getSeconds() + timeout));
    if (this.isProcessing && this.handle && this.processingDone && done > this.processingDone) {
      this.cancelProcessing();
    }
    this.handle = setTimeout(() => {
      this.isProcessing = false;
      if (cb) cb(undefined, true);
    }, timeout);
    this.isProcessing = true;
    this.processingDone = done;
  }

  /** Cancel processing one or more actions */
  private cancelProcessing() {
    if (this.handle) {
      clearTimeout(this.handle);
    }
    this.isProcessing = false;
    this.canCancel = true;
  }

  private menuItemActivated(id: string) {
    this.uiState.forEach(
      (g) =>
        g.children &&
        g.children.forEach((mi) => {
          if (!mi.conditions) {
            return;
          }
          const conditions = mi.conditions instanceof Array ? mi.conditions : [ mi.conditions ];
          mi.isVisible = conditions.reduce(
            (p, c) => p || (c.eventId === id && (c.event ? c.event === 'Activated' : true)),
            false
          );
        })
    );
  }

  private getMenuItemById(menuId: string) {
    return this.uiState.reduce(
      (p, c) => {
        return p || (c.children && c.children.filter((mi) => mi.id === menuId).shift());
      },
      {} as IMenuItem
    );
  }

  /** Create the GUI from scratch */
  private createGUI(menu: IMenu) {
    return menu.menuGroups.map((g) => {
      g.children = menu.menuItems
        .filter((mi) => mi.groupId === g.id)
        .map((mi) =>
          Object.assign({ isVisible: true, multiple: 1, isActivated: false, isActive: false } as IMenuItem, mi)
        );
      return g;
    });
  }
}
