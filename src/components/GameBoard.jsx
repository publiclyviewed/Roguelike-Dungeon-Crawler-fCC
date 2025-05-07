import React from 'react';
import './GameBoard.css';

const tileSymbols = {
  wall: '#',
  floor: '.',
  player: '@',
};

function GameBoard({ map }) {
  return (
    <div className="game-board">
      {map.map((row, y) => (
        <div key={y} className="row">
          {row.map((tile, x) => (
            <span key={x} className={`tile ${typeof tile === 'object' ? tile.type : tile}`}>
              {typeof tile === 'object' ? tile.symbol || '?' : tileSymbols[tile] || '?'}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
