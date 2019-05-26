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
      selected: undefined,
      pieces,
    };
  }

  onMouseOver = ({ target }) => {
    const { selected } = this.state;
    if (selected) {
      console.log(target);
    }
  };

  componentDidUpdate = () => console.log(this.state);

  initializeBoard = (size = 10) => new Array(size).fill(new Array(size).fill(0));

  selectPiece = (piece, key) => {
    let { pieces } = this.state;

    pieces[key].quantity = pieces[key].quantity - 1;

    this.setState(prevState => ({
      ...prevState,
      selected: piece,
      pieces,
    }));
  };

  renderBoard = () => {
    const { id } = this.props;
    const { board } = this.state;
    return board.map((line, i) => (
      <div className="row" key={`${id}-${i}`}>
        {line.map((button, j) => (
          <Button key={`btn-${id}-${i}-${j}`} data-i={i} data-j={j} onMouseOver={this.onMouseOver}>
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
