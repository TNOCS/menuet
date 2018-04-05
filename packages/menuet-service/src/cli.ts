import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import * as npmPackage from '../package.json';
import { App } from './app';

export interface ICommandOptions {
  /** Port to use for the client */
  port: number;
  /** Topic to publish actions to */
  produce: string;
  /** Topic to receive to */
  consume: string;
  /** Input menu structure */
  file: string;
  /** Kafka host */
  kafka: string;
  /** Kafka schema registry */
  registry: string;
  /** Display help output */
  help: boolean;
  /** Watch the menu configuration for updates */
  watch: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: OptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      typeLabel: '{underline Boolean}',
      description: 'Show help text.'
    },
    {
      name: 'file',
      alias: 'f',
      type: String,
      defaultOption: true,
      defaultValue: 'config/menu.yaml',
      typeLabel: '{underline String}',
      description: 'Input yaml or json file containing the menu structure [config/menu.yaml].'
    },
    {
      name: 'consume',
      alias: 'i',
      type: String,
      defaultValue: 'menuet-in',
      typeLabel: '{underline String}',
      description: 'Topic to consume messages from.'
    },
    {
      name: 'produce',
      alias: 'o',
      type: String,
      defaultValue: 'menuet-out',
      typeLabel: '{underline String}',
      description: 'Topic to consume messages from.'
    },
    {
      name: 'port',
      alias: 'p',
      type: Number,
      defaultValue: 8123,
      typeLabel: '{underline Number}',
      description: 'Client port'
    },
    {
      name: 'kafka',
      alias: 'k',
      type: String,
      defaultValue: 'localhost:3501',
      typeLabel: '{underline String}',
      description: 'Kafka broker url [localhost:3501].'
    },
    {
      name: 'registry',
      alias: 'r',
      type: String,
      defaultValue: 'localhost:3502',
      typeLabel: '{underline String}',
      description: 'Schema Registry url [localhost:3502].'
    },
    {
      name: 'watch',
      alias: 'w',
      type: Boolean,
      defaultValue: false,
      typeLabel: '{underline Boolean}',
      description: 'Watch the menu configuration file for changes.'
    }
  ];

  static sections = [
    {
      header: `${npmPackage.name.toUpperCase()}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}`
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [
        {
          desc: '01. TBD',
          example: '$ menuet...'
        }
      ]
    }
  ];
}

const options: ICommandOptions = commandLineArgs(CommandLineInterface.optionDefinitions);
let file = path.join(process.cwd(), options.file);
let configFileExists = fs.existsSync(file);
if (!configFileExists) {
  file = path.join(__dirname, '..', options.file);
  configFileExists = fs.existsSync(file);
}
options.file = file;
if (options.help || !configFileExists) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  if (!configFileExists) {
    console.error(`Menu file does not exist: ${options.file}!`);
    process.exit(1);
  } else {
    process.exit(0);
  }
} else {
  options.kafka = options.kafka.replace('http://', '');
  options.registry = options.registry.replace('http://', '');
  new App(options);
}
