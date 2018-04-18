import { Application, Request, Response } from 'express';
import { MenuService } from './menu-service';

export class RestService {
  private route: string;
  private menuId: string;

  constructor(app: Application, menuService: MenuService) {
    this.menuId = menuService.id;
    this.route = `/menus/${menuService.id}`;
    app.get(this.route, (_req: Request, res: Response) => {
      res.json(menuService.ui);
    });
    app.put(`${this.route}/:menuItemId`, (req: Request, res: Response) => {
      const menuItemId = req.params['menuItemId'];
      console.log(`Accessing menu ${this.menuId}/${menuItemId}...`);
      if (!menuItemId) {
        res.status(500).write('Please provide menuItemId');
        return;
      }
      menuService.activateMenuItem(menuItemId, (error, _data) => {
        if (error) {
          res.status(500).write('Error processing activation: ' + error.message);
          return;
        }
        res.sendStatus(200);
      });
    });
  }
}
