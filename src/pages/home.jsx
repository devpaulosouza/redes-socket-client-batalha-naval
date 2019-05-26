import React from 'react';
import { Board } from '../components';

export default function Home() {
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
