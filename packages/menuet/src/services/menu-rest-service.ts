import { Application, Request, Response } from 'express';
import { MenuService } from './menu-service';

export class RestService {
  private route: string;

  constructor(app: Application, menuService: MenuService) {
    this.route = `/${menuService.id}`;
    app.get(this.route, (req: Request, res: Response) => {
      res.json(menuService.ui);
    });
    app.put(`${this.route}?:menuId`, (req: Request, res: Response) => {
      const menuId = req.params['menuId'];
      if (!menuId) {
        return res.status(500).write('Please provide menuId');
      }
      menuService.activateMenuItem(menuId, (error, data) => {
        if (error) {
          return res.status(500).write('Error processing activation: ' + error.message);
        }
        res.json(menuService.ui);
      });
    });
  }
}
