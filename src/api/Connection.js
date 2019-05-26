const WebSocketClient = require('websocket').w3cwebsocket;

export class Connection {
  constructor({ onStart }) {
    this.onStart = onStart;
  }

  async connect(ip, port, callback) {
    this.client = await WebSocketClient(`ws://${ip}:${port}/`);

    this.client.onopen = callback;

    this.client.onmessage = async e => {
      const payload = await JSON.parse(e.data);

      switch (payload.action) {
        case 'started':
          this.onStart();
          break;
        default:
          break;
      }
      console.log(e.data);
    };

    this.client.onerror = e => {
      console.log(e);
    };
  }

  start(username, callback) {
    this.client.send(JSON.stringify({ action: 'start', username }));
  }
}
