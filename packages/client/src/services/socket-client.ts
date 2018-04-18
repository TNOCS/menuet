import io from 'socket.io-client';

console.log('Doc: ' + document.URL);
console.log('Host: ' + window.location.host);
console.log('Port: ' + window.location.port);
export const socketClient = io('http://' + window.location.host);
