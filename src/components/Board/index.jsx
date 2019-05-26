import React, { Component } from 'react';

import { Button } from './styles';

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.initializeBoard = this.initializeBoard.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.renderPieces = this.renderPieces.bind(this);

    const { renderPieces } = this.props;
    let pieces = undefined;

    if (renderPieces) {
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
      pieces,
    };
  }

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
        for (let m = 0; m < board.length; m++) {
          let array = [];
          for (let n = 0; n < board.length; n++) {
            array.push(m === parseInt(i) && n === parseInt(j) ? selected.size : board[i][j]);
          }
          newBoard.push(array);
        }

        this.setState(prevState => ({
          ...prevState,
          boardSelected: newBoard,
        }));
      }
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
    const { id } = this.props;
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
            onMouseOver={this.onMouseOver}>
            {button}
          </Button>
        ))}
      </div>
    ));
  };

  renderPieces = () => {
    const { renderPieces } = this.props;

    const { pieces } = this.state;

    if (renderPieces) {
      return Object.keys(pieces).map((key, i) => {
        const piece = pieces[key];
        return (
          <Button
            onClick={() => this.selectPiece(piece, key)}
            style={{ height: 35 * piece.size }}
            key={`piece-${i}`}>
            {piece.size}
          </Button>
        );
      });
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
