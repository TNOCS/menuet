import { IActionRequest, RequestStatus } from './../models/vbs-action';
import { ProduceRequest } from 'kafka-node';
import { TestBedAdapter, Logger, LogLevel, IAdapterMessage } from 'node-test-bed-adapter';

const log = Logger.instance;

class Consumer {
  private readonly id = 'EchoService';
  private adapter: TestBedAdapter;

  constructor() {
    this.adapter = new TestBedAdapter({
      kafkaHost: 'localhost:3501',
      schemaRegistry: 'localhost:3502',
      fetchAllSchemas: false,
      wrapUnions: false,
      clientId: this.id,
      consume: [{ topic: 'vbs_action_request' }],
      produce: ['vbs_action_response'],
      logging: {
        logToConsole: LogLevel.Debug,
      }
    });
    this.adapter.on('ready', () => {
      this.subscribe();
      console.log(`${this.id} is connected`);
    });
    this.adapter.connect();
  }

  private subscribe() {
    this.adapter.on('message', message => this.handleMessage(message));
    this.adapter.on('error', err => log.error(`Consumer received an error: ${err}`));
  }

  private handleMessage(message: IAdapterMessage) {
    const stringify = (m: string | Object) => typeof m === 'string' ? m : JSON.stringify(m, null, 2);
    console.log(`Received message: ${stringify(message.value)}`);
    switch (message.topic.toLowerCase()) {
      case 'vbs_action_request':
        console.log(`Processing VBS action request`);
        const pr = {
          topic: 'vbs_action_response',
          messages: {
            requestId: (message.value as IActionRequest).requestId,
            status: RequestStatus.Succeeded
          }
        } as ProduceRequest;
        console.debug('Sending message:');
        console.debug(stringify(pr));
        this.adapter.send(pr, (error, data) => {
          if (error) {
            console.error('Error sending message:' + stringify(error));
            return;
          }
          if (data) {
            console.debug('Message send successfully:' + stringify(data));
            return;
          }
        });
        break;
      default:
        log.debug(`Received ${message.topic} message with key ${stringify(message.key)}: ${stringify(message.value)}`);
        break;
    }
  }
}

new Consumer();
