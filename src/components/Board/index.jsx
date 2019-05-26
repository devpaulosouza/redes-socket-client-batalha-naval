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
        aircraftCarrier: { size: 5, quantity: 1, vertical: false },
        oilTanker: { size: 4, quantity: 2, vertical: true },
        destroyer: { size: 3, quantity: 3, vertical: true },
        submarine: { size: 2, quantity: 4, vertical: true },
      };
    }

    this.state = {
      board: this.initializeBoard(),
      boardSelected: undefined,
      selected: undefined,
      pieces,
    };
  }

  rotacionar = () => {
    this.setState(prevState => ({
      ...prevState,
      selected: {
        ...prevState.selected,
        vertical: !prevState.selected.vertical,
      },
    }));
  };

  onClick = () => {
    const { selected } = this.state;

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

  componentDidUpdate = () => console.log(this.state);

  initializeBoard = (size = 10) => new Array(size).fill(new Array(size).fill(0));

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
    const { id, playerOne } = this.props;
    const { board, boardSelected, selected } = this.state;

    let currentBoard = selected ? boardSelected : board;

    return currentBoard.map((line, i) => (
      <div className="row" key={`${id}-${i}`}>
        {line.map((button, j) => (
          <Button
            style={button > 0 ? { background: 'blue', color: 'white' } : {}}
            key={`btn-${id}-${i}-${j}`}
            data-i={i}
            data-j={j}
            onMouseOver={this.onMouseOver}
            onClick={this.onClick}>
            {playerOne && button}
          </Button>
        ))}
      </div>
    ));
  };

  renderPieces = () => {
    const { playerOne } = this.props;

    const { pieces } = this.state;

    if (playerOne) {
      return (
        <>
          <Button className="mr-2" style={{ width: 90 }} onClick={this.rotacionar}>
            Rotacionar
          </Button>
          {Object.keys(pieces).map((key, i) => {
            const piece = pieces[key];
            return (
              <>
                <Button
                  className="mt-3"
                  onClick={() => this.selectPiece(piece, key)}
                  style={{ height: 35 * piece.size }}
                  key={`piece-${i}`}
                  disabled={piece.quantity === 0}>
                  {piece.size}
                </Button>
                <span className="mr-2 ml-1">x {piece.quantity}</span>
              </>
            );
          })}
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
