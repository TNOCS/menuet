import { IAction } from './../menu/action';
import { EventEmitter } from 'events';
import { IMenuItem } from '../menu/menu-item';

export declare interface ActionService {
  on(event: 'MenuItemActivated', listener: (id: string) => void): this;
}

/** Performs all the actions */
export class ActionService extends EventEmitter {
  constructor(private actions?: IAction[]) { super(); }

  public activateMenuItem(menuItem: IMenuItem) {
    this.emit('MenuItemActivated', menuItem.id);
    if (!menuItem.actions) {
      return { canCancel: false, timeout: 0 };
    }
    const actionIds = typeof menuItem.actions === 'string' ? [menuItem.actions] : menuItem.actions;
    const actions = actionIds.map(a => this.getActionById(a));
    const canCancel = actions.reduce((p, c) => p && (c ? c.canInterrupt || false : false), true);
    const timeout = actions.reduce((p, c) => c ? p > c.timeout ? p : c.timeout : p, 0);
    actions.forEach(a => a && this.execute(a));
    return { canCancel, timeout };
  }

  private execute(action: IAction) {
    console.log(`Executing action with id ${action.id}.`);
  }

  private getActionById(actionId: string) {
    return this.actions && this.actions.filter((a) => a.id === actionId).shift();
  }
}
