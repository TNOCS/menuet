import { MenuServiceFactory } from './services/menu-service-factory';
import express, { Request } from 'express';
import { Application, Response } from 'express';
import socketIO from 'socket.io';
import cors from 'cors';
import chokidar from 'chokidar';
import { ICommandOptions } from './cli';
import { createServer, Server } from 'http';
import { MenuService } from './services/menu-service';

const log = console.log;

/** Main application */
export class App {
  /** Port number where the service listens for clients */
  private readonly port: number;
  private readonly menuServiceFactory = new MenuServiceFactory();
  private started = false;
  private app: Application;
  private server: Server;
  private io: SocketIO.Server;
  private menuServices?: MenuService[];

  constructor(private options: ICommandOptions) {
    this.port = options.port;
    this.app = express();
    this.app.use(cors());
    this.server = createServer(this.app);
    this.io = socketIO(this.server);
    this.createMenus();
    this.listen();
    if (options.watch) {
      const watcher = chokidar.watch(options.file, { persistent: true });
      watcher
        .on('add', () => this.createMenus(true))
        .on('change', () => this.createMenus(true))
        .on('delete', () => process.exit(2));
    }
  }

  private createMenus(reload = false) {
    if (reload) {
      console.info('Menu configuration updated... reloading...');
    }
    this.menuServices = this.menuServiceFactory.create(this.options.file, this.app);
    if (this.menuServices) {
      this.app.get('/menus', (req: Request, res: Response) => this.menuServices ? res.json(this.menuServices.map(ms => ms.id)) : res.status(500).write('No menus have been defined!') );
    }
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      log(`Running server on port ${this.port}.`);
    });

    this.io.on('connect', (socket: SocketIO.Socket) => {
      log(`Connected client on port ${this.port}`);
      // socket.emit('session_update', this.fws.getAllSessions());
      socket.on('message', (m: any) => {
        log('[server](message): %s', JSON.stringify(m));
        this.io.emit('session_update', m);
      });

      socket.on('disconnect', () => {
        log('Client disconnected');
      });
    });
  }
}
