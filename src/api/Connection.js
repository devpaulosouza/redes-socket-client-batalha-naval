const WebSocketClient = require('websocket').w3cwebsocket;

export class Connection {
  constructor({ onStart, onAttack, attack }) {
    this.onStart = onStart;
    this.onAttack = onAttack;
    this.attack = attack;
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
        case 'onAttack':
          this.onAttack(payload.data);
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

  send(data) {
    this.client.send(data);
  }

  start(username) {
    this.client.send(JSON.stringify({ action: 'start', username }));
  }
}
