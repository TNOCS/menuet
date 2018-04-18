/* eslint-disable no-console */

import { register } from 'register-service-worker';

const log = console.log;
const errorLog = console.error;

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      log(
        'App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB'
      );
    },
    cached() {
      log('Content has been cached for offline use.');
    },
    updated() {
      log('New content is available; please refresh.');
    },
    offline() {
      log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      errorLog('Error during service worker registration:', error);
    }
  });
}
