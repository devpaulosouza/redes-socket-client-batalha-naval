import React, { Component } from 'react';

import { Button } from './styles';

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.initializeBoard = this.initializeBoard.bind(this);

    this.state = {
      board: this.initializeBoard(),
    };
  }

  initializeBoard = (size = 10) => new Array(size).fill(new Array(size).fill(0));

  render() {
    const { id } = this.props;
    const { board } = this.state;
    return board.map((line, i) => (
      <div className="row" key={`${id}-${i}`}>
        {line.map(button => (
          <Button>{button}</Button>
        ))}
      </div>
    ));
  }
}
