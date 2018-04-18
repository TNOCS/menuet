import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Application } from 'express';
import { ProduceRequest } from 'kafka-node';
import { IAction } from './../menu/action';
import { INotificationService } from './../services/notification-service';
import { IMenuConfiguration } from '../menu/menu-configuration';
import { MenuService } from '../services/menu-service';
import { ActionService } from '../services/action-service';
import { RestService } from '../services/menu-rest-service';
import { IInputMessage } from './../menu/message';

/**
 * This class is responsible for creating menu services.
 */
export class MenuServiceFactory {
  private actionService?: ActionService;
  private events: IInputMessage[] = [];

  public create(file: string, app: Application, notificationService: INotificationService) {
    const menuConfiguration = this.readConfiguration(file);
    notificationService.on('MessageReceived', (eventMessage) => this.messageReceived(eventMessage));
    const actionService = new ActionService(menuConfiguration.actions);
    actionService.on('ActionActivated', (action: IAction) => this.actionActivated(action, notificationService));
    const menuServices = menuConfiguration.menus.map((menu) => new MenuService(menu, actionService));
    menuServices.map(ms => new RestService(app, ms));
    this.actionService = actionService;
    return menuServices;
  }

  public destroy() {
    this.actionService && this.actionService.removeAllListeners();
    this.events = [];
  }

  private messageReceived(eventMessage: IInputMessage) {
    const requestId = eventMessage.requestId;
    const status = eventMessage.status;
    const activeEvents = this.events.filter(e => (e.requestId < 0 || e.requestId === requestId) && e.status === status);
    activeEvents.forEach(ae => {
      ae.eventId && this.actionService && this.actionService.notify(ae.eventId);
      this.events.splice(this.events.indexOf(ae), 1);
    });
  }

  private actionActivated(action: IAction, notificationService: INotificationService) {
    const result = action.result;
    if (result && result.event) {
      result.event.requestId = result.message ? result.message.requestId : -1;
      this.events.push(result.event);
    }
    if (!result || !result.message) {
      console.info(`Action with id ${action.id} has nothing to send...`);
      return;
    }
    const pr = {} as ProduceRequest;
    pr.topic = result.message.topic || notificationService.defaultTopic;
    pr.messages = result.message;
    notificationService.send(pr, (error, data) => {
      if (error) {
        console.error(`ActionActivated error: ${error}`);
      } else if (data) {
        console.log(`ActionActivated data: ${JSON.stringify(data, null, 2)}`);
      }
    });
  }

  private readConfiguration(file: string) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.yaml' && ext !== '.json') {
      console.error(`Cannot read menu configuration file - only yaml and json supported: ${file}`);
      process.exit(2);
    }
    const data = fs.readFileSync(file, 'utf8');
    const menuConfiguration =
      ext === '.json' ? JSON.parse(data) as IMenuConfiguration : yaml.safeLoad(data) as IMenuConfiguration;
    return menuConfiguration;
  }
}
