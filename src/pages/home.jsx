import React, { useState } from 'react';
import { Board } from '../components';
import { Connection } from '../api/Connection';

export default function Game() {
  const [gameState, setGameState] = useState('waiting');
  const [username, setUsername] = useState('');
  const [port, setPort] = useState('8484');
  const [ip, setIp] = useState('127.0.0.1');

  const startGame = () => {
    const conn = new Connection({ onStart: () => setGameState('playing') });
    conn.connect(ip, port, () => conn.start(username));
  };

  if (gameState === 'waiting') {
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
              value={port}
              onChange={e => setPort(e.target.port)}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-success mb-2" onClick={startGame}>
              começar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="display-4 text-center">Batalha Naval</h1>
      <div className="row mt-4">
        <div className="col-md-6">
          <Board id="board-1" playerOne />
        </div>
        <div className="col-md-6">
          <Board id="board-2" />
        </div>
      </div>
    </div>
  );
}
