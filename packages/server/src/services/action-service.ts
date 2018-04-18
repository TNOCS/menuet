import { IAction } from './../menu/action';
import { EventEmitter } from 'events';
import { IMenuItem } from '../menu/menu-item';

export interface ActionService {
  on(event: 'MenuItemActivated', listener: (id: string) => void): this;
  on(event: 'ActionActivated', listener: (action: IAction) => void): this;
  on(event: 'EventReceived', listener: (eventId: string) => void): this;
}

/** Performs all the actions */
export class ActionService extends EventEmitter {
  private index = 0;

  constructor(private actions?: IAction[]) {
    super();
  }

  public activateMenuItem(menuItem: IMenuItem) {
    this.emit('MenuItemActivated', menuItem.id);
    if (!menuItem.actions) {
      return { canCancel: false, timeout: 0 };
    }
    const actionIds = typeof menuItem.actions === 'string' ? [ menuItem.actions ] : menuItem.actions;
    const actions = actionIds.map((a) => this.getActionById(a));
    const canCancel = actions.reduce((p, c) => p && (c ? c.canInterrupt || false : false), true);
    const timeout = actions.reduce((p, c) => (c ? (p > c.timeout ? p : c.timeout) : p), 0);
    actions.forEach((a) => a && this.execute(a));
    return { canCancel, timeout };
  }

  public notify(eventId: string) {
    this.emit('EventReceived', eventId);
  }

  private execute(action: IAction) {
    console.log(`Executing action with id ${action.id}.`);
    if (action.result && action.result.message) {
      action.result.message.requestId = this.index++;
      console.log(`Request ID ${action.result.message.requestId}.`);
    }
    this.emit('ActionActivated', action);
  }

  private getActionById(actionId: string) {
    return this.actions && this.actions.filter((a) => a.id === actionId).shift();
  }
}
