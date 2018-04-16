import express, { Application, Request, Response } from 'express';
import socketIO from 'socket.io';
import cors from 'cors';
import chokidar from 'chokidar';
import { ICommandOptions } from './cli';
import { createServer, Server } from 'http';
import { MenuService } from './services/menu-service';
import { NotificationService } from './services/notification-service';
import { MenuServiceFactory } from './helpers/menu-service-factory';

const log = console.log;

/** Main application */
export class App {
  /** Port number where the service listens for clients */
  private readonly port: number;
  private readonly menuServiceFactory = new MenuServiceFactory();
  private readonly notificationService: NotificationService;
  private app!: Application;
  private server!: Server;
  private io!: SocketIO.Server;
  private menuServices?: MenuService[];

  constructor(private options: ICommandOptions) {
    this.notificationService = new NotificationService(options);
    this.port = options.port;
    this.initServer();
    this.createMenus();
    if (options.watch) {
      const watcher = chokidar.watch(options.file, { persistent: true });
      watcher
        .on('change', () => this.createMenus(true))
        .on('delete', () => process.exit(2));
    }
  }

  private initServer() {
    this.app = express();
    this.app.use(cors());
    this.server = createServer(this.app);
    this.io = socketIO(this.server);
    this.listen();
  }

  private createMenus(reload = false) {
    if (reload) {
      this.server.close();
      this.initServer();
      console.info('Menu configuration updated... reloading...');
      this.notificationService.removeAllListeners();
      if (this.menuServices && this.menuServices.length > 0) {
        // Tear down the services:
        this.menuServices.forEach(ms => ms.destroy());
        this.menuServiceFactory.destroy();
      }
    }
    this.menuServices = this.menuServiceFactory.create(this.options.file, this.app, this.notificationService);
    this.menuServices.forEach((ms) => ms.on('MenuUpdated', (menuId: string) => {
      console.log(`Menu ${menuId} updated... notifying clients.`);
      this.io.emit('MenuUpdated', menuId);
    }));
    if (this.menuServices) {
      this.app.get(
        '/menus',
        (_req: Request, res: Response) =>
          this.menuServices
            ? res.json(this.menuServices.map((ms) => ({ id: ms.id, title: ms.title })))
            : res.status(500).write('No menus have been defined!')
      );
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
