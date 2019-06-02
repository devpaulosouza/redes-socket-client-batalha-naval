const WebSocketClient = require('websocket').w3cwebsocket;

export class Connection {
  constructor({
    onStart,
    onWaitPlayerJoin,
    onAttack,
    attack,
    onAllPlayersReady,
    onTurnChange,
    onFinished,
  }) {
    this.onStart = onStart;
    this.onAttack = onAttack;
    this.attack = attack;
    this.onWaitPlayerJoin = onWaitPlayerJoin;
    this.onAllPlayersReady = onAllPlayersReady;
    this.onTurnChange = onTurnChange;
    this.onFinished = onFinished;
  }

  async connect(ip, port, callback) {
    this.client = await WebSocketClient(`ws://${ip}:${port}/`);

    this.client.onopen = callback;

    this.client.onmessage = async e => {
      const payload = await JSON.parse(e.data);

      switch (payload.action) {
        case 'waitingOtherPlayer':
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
        case 'finished':
          this.onFinished(payload.data);
          break;
        default:
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
