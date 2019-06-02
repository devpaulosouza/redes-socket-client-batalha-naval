import React, { useState } from 'react';
import { Board } from '../components';
import { Connection } from '../api/Connection';

export default function Game() {
  const [gameState, setGameState] = useState('waitingConnection');
  const [username, setUsername] = useState('');
  const [port, setPort] = useState('8484');
  const [ip, setIp] = useState('127.0.0.1');
  const [connection, setConnection] = useState();
  const [uuid, setUuid] = useState('');
  const [otherPlayer, setOtherPlayer] = useState();
  const [turn, setTurn] = useState('');
  const [attackBoard, setAttackBoard] = useState({ uuid: '', x: undefined, y: undefined });

  const startGame = () => {
    connection.connect(ip, port, () => connection.start(username));
  };

  const onStart = data => {
    setUuid(data.uuid);
    setOtherPlayer(data.otherPlayer);
    setGameState('startGame');
  };

  const onWaitPlayerJoin = () => {
    setGameState('waitingOtherPlayer');
  };

  const attack = (x, y) =>
    connection.send(JSON.stringify({ action: 'attack', x, y, uuid: otherPlayer.uuid }));

  const onAttack = data => setAttackBoard(data);

  const onAllPlayersReady = data => {
    setGameState('allPlayersReady');
  };

  const onTurnChange = data => {
    setTurn(data.turn);
  };

  const onFinished = data => {
    setGameState('finished');
    setTurn(data.winner);
  };

  const sendBoard = board => connection.send(JSON.stringify({ action: 'sendBoard', board }));

  if (!connection) {
    const conn = new Connection({
      onWaitPlayerJoin,
      onStart,
      attack,
      onAttack,
      onAllPlayersReady,
      onTurnChange,
      onFinished,
    });
    setConnection(conn);
  }

  if (gameState === 'waitingConnection' || gameState === 'waitingOtherPlayer') {
    return (
      <div className="container mt-5">
        <div className="form-row align-items-center">
          <div className="col-auto">
            <label htmlFor="userName" className="sr-only">
              username
            </label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="nickname"
              disabled={gameState !== 'waitingConnection'}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="ip" className="sr-only">
              port
            </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <span role="img" aria-label="port">
                    🌐
                  </span>
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="ip"
                disabled={gameState !== 'waitingConnection'}
                value={ip}
                onChange={e => setIp(e.target.value)}
              />
            </div>
          </div>
          <div className="col-auto">
            <label htmlFor="port" className="sr-only">
              ip
            </label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="port"
              disabled={gameState !== 'waitingConnection'}
              value={port}
              onChange={e => setPort(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button
              className="btn btn-success mb-2"
              disabled={gameState !== 'waitingConnection'}
              onClick={startGame}>
              começar
            </button>
          </div>
        </div>
        {gameState === 'waitingOtherPlayer' && <p>Aguardando outro jogador...</p>}
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="container">
        <h1>{uuid === turn ? 'Você venceu! =]' : 'Você perdeu =/'}</h1>
        <button className="btn btn-success" onClick={() => setGameState('waitingConnection')}>
          Jogar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="display-4 text-center">Batalha Naval</h1>
      <div className="row mt-4">
        <div className="col-md-6">
          <h3>{username}</h3>
          <Board
            attackBoard={attackBoard}
            id="board-1"
            uuid={uuid}
            playerOne
            sendBoard={sendBoard}
          />
        </div>
        <div className="col-md-6">
          <h3>{otherPlayer.username}</h3>
          <Board
            attackBoard={attackBoard}
            id="board-2"
            turn={turn === uuid}
            attack={attack}
            uuid={otherPlayer.uuid}
          />
          <h3>{turn === uuid && 'Sua vez...'}</h3>
        </div>
      </div>
    </div>
  );
}
