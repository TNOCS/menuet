import { IOutputMessage } from './message';

export interface IActionResult {
  /** Respond with a simple string in Markdown */
  response?: string;
  /** Alternatively, respond with one or more files (markdown or html) */
  files?: string | string[];
  /** Send a message to the outside world */
  message?: IOutputMessage;
}