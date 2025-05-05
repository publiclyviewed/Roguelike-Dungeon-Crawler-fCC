import './GameBoard.css';

function GameBoard({ map }) {
  return (
    <div className="game-board">
      {map.map((row, y) => (
        <div key={y} className="row">
          {row.map((tile, x) => (
            <div
              key={x}
              className={`tile ${tile.visible ? tile.type : 'hidden'}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
