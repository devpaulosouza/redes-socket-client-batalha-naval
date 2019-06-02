import React, { Component } from 'react';

import { Button } from './styles';

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.rotacionar = this.rotacionar.bind(this);
    this.initializeBoard = this.initializeBoard.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.renderPieces = this.renderPieces.bind(this);

    const { playerOne } = this.props;
    let pieces = undefined;

    if (playerOne) {
      pieces = {
        aircraftCarrier: { size: 5, quantity: 1, vertical: true },
        oilTanker: { size: 4, quantity: 2, vertical: true },
        destroyer: { size: 3, quantity: 3, vertical: true },
        submarine: { size: 2, quantity: 4, vertical: true },
      };
    }

    this.state = {
      board: this.initializeBoard(),
      boardSelected: undefined,
      selected: undefined,
      gameStatus: 'selecting',
      pieces,
    };
  }

  componentDidUpdate = () => {
    let { board } = this.state;
    const { attackBoard, uuid } = this.props;
    if (board && attackBoard && attackBoard.x) {
      if (
        attackBoard.uuid === uuid &&
        board[attackBoard.x][attackBoard.y] !== parseInt(attackBoard.value)
      ) {
        board[attackBoard.x][attackBoard.y] = attackBoard.value;

        this.setState(prevState => ({
          ...prevState,
          board,
        }));
      }
    }
  };

  rotacionar = () => {
    const { selected } = this.state;

    if (!selected) return;

    this.setState(prevState => ({
      ...prevState,
      selected: {
        ...prevState.selected,
        vertical: !prevState.selected.vertical,
      },
    }));
  };

  onClick = ({
    target: {
      dataset: { i, j },
    },
  }) => {
    const { playerOne, turn, attack } = this.props;
    const { selected } = this.state;

    // Se for a vez do jogador atacar e  click for no segundo tabuleiro
    if (!playerOne && turn) {
      attack(i, j);
    }
    // Se for na seleção dos barcos e o click for no primeiro tabuleiro
    else {
      if (selected) {
        this.setState(prevState => {
          document.matriz = prevState.boardSelected;
          return {
            ...prevState,
            board: prevState.boardSelected,
            selected: undefined,
          };
        });
      }
    }
  };

  onMouseOver = ({
    target: {
      dataset: { i, j },
    },
  }) => {
    const { selected } = this.state;
    const { board } = this.state;
    let newBoard = [];
    if (selected) {
      if (selected.vertical) {
        if (parseInt(i) - selected.size < -1) return;

        for (let m = 0; m < board.length; m++) {
          let array = [];
          for (let n = 0; n < board.length; n++) {
            const inRange =
              m > parseInt(i) - selected.size && m <= parseInt(i) && n === parseInt(j);

            if (inRange && board[m][n] !== 0) return;

            array.push(inRange ? selected.size : board[m][n]);
          }
          newBoard.push(array);
        }
      } else {
        if (parseInt(j) - selected.size < -1) return;

        for (let m = 0; m < board.length; m++) {
          let array = [];
          for (let n = 0; n < board.length; n++) {
            const inRange =
              m === parseInt(i) && (n > parseInt(j) - selected.size && n <= parseInt(j));

            if (inRange && board[m][n] !== 0) return;

            array.push(inRange ? selected.size : board[m][n]);
          }
          newBoard.push(array);
        }
      }

      this.setState(prevState => ({
        ...prevState,
        boardSelected: newBoard,
      }));
    }
  };

  randomize = () => {
    let newBoard = [];

    this.setState(prevState => ({
      ...prevState,
    }));
  };

  initializeBoard = (size = 10) => {
    let board = Array(size);
    for (let i = 0; i < size; i++) {
      board[i] = Array(size);
      for (let j = 0; j < size; j++) {
        board[i][j] = 0;
      }
    }
    return board;
  };

  selectPiece = (piece, key) => {
    let { pieces, selected } = this.state;

    if (selected) return;

    pieces[key].quantity = pieces[key].quantity - 1;

    this.setState(prevState => ({
      ...prevState,
      selected: piece,
      pieces,
      boardSelected: prevState.board,
    }));
  };

  renderBoard = () => {
    const { id, playerOne, turn } = this.props;
    const { board, boardSelected, selected } = this.state;

    let currentBoard = selected ? boardSelected : board;

    return currentBoard.map((line, i) => (
      <div className="row" key={`${id}-${i}`}>
        {line.map((button, j) => (
          <Button
            style={
              button > 0
                ? { background: 'blue', color: 'white' }
                : button < 0 && button !== -999
                ? { background: 'red', color: 'white', borderColor: 'black' }
                : button === -999
                ? { background: 'white', color: 'red', borderColor: 'red' }
                : {}
            }
            key={`btn-${id}-${i}-${j}`}
            data-i={i}
            data-j={j}
            onMouseOver={this.onMouseOver}
            onClick={this.onClick}
            disabled={(!playerOne && !turn) || button < 0}>
            <>
              {playerOne && button !== 0 && (button !== -999 ? Math.abs(button) : 0)}
              {!playerOne && button < 0 && (button !== -999 ? Math.abs(button) : 0)}
            </>
          </Button>
        ))}
      </div>
    ));
  };

  renderPieces = () => {
    const { playerOne, sendBoard } = this.props;

    const { pieces, board, gameStatus, selected } = this.state;

    if (gameStatus === 'waiting') {
      return <p>Aguardando o outro jogador...</p>;
    }

    if (playerOne && gameStatus === 'selecting') {
      return (
        <>
          <Button
            className="mr-2"
            style={
              selected && !selected.vertical
                ? { background: 'blue', color: 'white', width: 90 }
                : { width: 90 }
            }
            onClick={this.rotacionar}>
            Rotacionar
          </Button>
          {Object.keys(pieces).map((key, i) => {
            const piece = pieces[key];
            return (
              <>
                <Button
                  disabled={piece.quantity === 0}
                  className="mt-3"
                  onClick={() => this.selectPiece(piece, key)}
                  style={
                    selected && piece.size === selected.size
                      ? { background: 'blue', color: 'white', height: 35 * piece.size }
                      : { height: 35 * piece.size }
                  }
                  key={`piece-${i}`}>
                  {piece.size}
                </Button>
                <span className="mr-2 ml-1">x {piece.quantity}</span>
              </>
            );
          })}
          <button
            className="btn btn-success"
            disabled={
              Object.keys(pieces)
                .map(key => pieces[`${key}`])
                .map(p => p.quantity)
                .reduce((a, quantidade) => quantidade + a, 0) !== 0 || selected
            }
            onClick={() => {
              this.setState(prevState => ({ ...prevState, gameStatus: 'waiting' }));
              sendBoard(board);
            }}>
            Começar
          </button>
        </>
      );
    }
    return false;
  };

  render() {
    return (
      <>
        {this.renderBoard()}
        {this.renderPieces()}
      </>
    );
  }
}
