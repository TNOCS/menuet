import { IInputMessage } from '../menu/message';
import { EventEmitter } from 'events';
import { ICommandOptions } from '../cli';
import { TestBedAdapter, Logger, LogLevel, IAdapterMessage } from 'node-test-bed-adapter';
import { ProduceRequest } from 'kafka-node';
import { ISendResponse } from 'node-test-bed-adapter/dist/lib/models/adapter-message';

const log = Logger.instance;

export interface INotificationService extends EventEmitter {
  defaultTopic: string;

  on(event: 'MessageReceived', listener: (eventMessage: IInputMessage) => void): this;
  send(pr: ProduceRequest, cb: (error: any, data?: ISendResponse) => void): void;
}

// export declare interface NotificationService {
//   on(event: 'MessageReceived', listener: (id: string) => void): this;
// }

export class NotificationService extends EventEmitter implements INotificationService {
  public defaultTopic: string;
  private id = 'MenuetService';
  private adapter: TestBedAdapter;

  constructor(options: ICommandOptions) {
    super();
    console.log('Register: ', options.schemas);
    this.defaultTopic = options.produce;
    this.adapter = new TestBedAdapter({
      kafkaHost: options.kafka,
      schemaRegistry: options.registry,
      clientId: this.id,
      fetchAllSchemas: true,
      autoRegisterSchemas: options.schemas,
      wrapUnions: 'auto',
      schemaFolder: './schemas',
      consume: [{
        topic: options.consume
      }],
      produce: [
        this.defaultTopic
      ],
      logging: {
        logToConsole: LogLevel.Debug,
        logToKafka: LogLevel.Warn
      }
    });
    this.adapter.on('error', (e) => console.error(e));
    this.adapter.on('ready', () => {
      this.adapter.on('message', message => this.handleMessage(message));
      log.debug(`Current simulation time: ${this.adapter.simTime}`);
      log.debug(`${this.id} is connected`);
    });
    this.adapter.connect();
  }

  public send(pr: ProduceRequest, cb: (error: any, data?: ISendResponse) => void) {
    log.debug('Sending message: ' + JSON.stringify(pr, null, 2));
    this.adapter.send(pr, cb);
  }

  private notify(message: IInputMessage) {
    this.emit('MessageReceived', message);
  }

  private handleMessage(message: IAdapterMessage) {
    const stringify = (m: string | Object) => typeof m === 'string' ? m : JSON.stringify(m, null, 2);
    if (message.topic !== 'vbs_action_response') {
      log.warn(`Received message from unknown topic: ${message.topic}: ${stringify(message.value)}.`);
    }
    const eventMessage = message.value as IInputMessage;
    log.debug('Message received: ' + stringify(message.value));
    this.notify(eventMessage);
  }
}
