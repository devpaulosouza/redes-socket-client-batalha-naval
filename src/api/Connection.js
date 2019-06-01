const WebSocketClient = require('websocket').w3cwebsocket;

export class Connection {
  constructor({ onStart, onWaitPlayerJoin, onAttack, attack, onAllPlayersReady, onTurnChange }) {
    this.onStart = onStart;
    this.onAttack = onAttack;
    this.attack = attack;
    this.onWaitPlayerJoin = onWaitPlayerJoin;
    this.onAllPlayersReady = onAllPlayersReady;
    this.onTurnChange = onTurnChange;
  }

  async connect(ip, port, callback) {
    this.client = await WebSocketClient(`ws://${ip}:${port}/`);

    this.client.onopen = callback;

    this.client.onmessage = async e => {
      const payload = await JSON.parse(e.data);

      console.log(payload);
      console.log(payload.action);

      switch (payload.action) {
        case 'waitingOtherPlayer':
          console.log('esperando');
          this.onWaitPlayerJoin();
          break;
        /* inicia a seleção dos barcos*/
        case 'started':
          this.onStart(payload.data);
          break;
        case 'turn':
          this.onTurnChange(payload.data);
          break;
        case 'allPlayersReady':
          this.onAllPlayersReady();
          break;
        case 'onAttack':
          this.onAttack(payload.data);
          break;
        default:
          console.log('não encontrou ação');
          break;
      }
    };

    this.client.onerror = e => {
      console.log(e);
    };
  }

  send(data) {
    this.client.send(data);
  }

  start(username) {
    this.client.send(JSON.stringify({ action: 'join', username }));
  }
}
