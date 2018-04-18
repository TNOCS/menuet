import axios from 'axios';

export const baseURL = 'http://' + window.location.host;
// export const baseURL = 'http://localhost:8123';

export const restClient = axios.create({
  baseURL,
  timeout: 5000
});
