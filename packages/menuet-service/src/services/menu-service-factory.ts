import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { IMenuConfiguration } from '../menu/menu-configuration';
import { MenuService } from './menu-service';
import { Application } from 'express';

/**
 * This class is responsible for creating menu services.
 */
export class MenuServiceFactory {
  public create(file: string, app: Application) {
    const menuConfiguration = this.readConfiguration(file);
    return menuConfiguration.menus.map(menu => new MenuService(menu, app));
  }

  private readConfiguration(file: string) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.yaml' && ext !== '.json') {
      console.error(`Cannot read menu configuration file - only yaml and json supported: ${file}`)
      process.exit(2);
    }
    const data = fs.readFileSync(file, 'utf8')
    const menuConfiguration = ext === '.json'
      ? JSON.parse(data) as IMenuConfiguration
      : yaml.safeLoad(data) as IMenuConfiguration;
    return menuConfiguration;
  }
}