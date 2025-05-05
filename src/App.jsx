import { useState, useEffect } from 'react';
import { generateMap } from './utils/mapGenerator';
import GameBoard from './components/GameBoard';

function App() {
  const [map, setMap] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newMap = generateMap();

    // Find player location
    let pos = { x: 0, y: 0 };
    for (let y = 0; y < newMap.length; y++) {
      for (let x = 0; x < newMap[y].length; x++) {
        if (newMap[y][x].type === 'player') {
          pos = { x, y };
          break;
        }
      }
    }

    setMap(newMap);
    setPlayerPos(pos);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp') dy = -1;
      else if (e.key === 'ArrowDown') dy = 1;
      else if (e.key === 'ArrowLeft') dx = -1;
      else if (e.key === 'ArrowRight') dx = 1;
      else return;

      movePlayer(dx, dy);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, map]);

  function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (
      newY < 0 || newY >= map.length ||
      newX < 0 || newX >= map[0].length
    ) return;

    const destination = map[newY][newX];
    if (destination.type !== 'floor') return;

    const newMap = map.map(row => row.map(tile => ({ ...tile })));

    newMap[playerPos.y][playerPos.x].type = 'floor';
    newMap[newY][newX].type = 'player';

    setMap(newMap);
    setPlayerPos({ x: newX, y: newY });
  }

  return (
    <div>
      <h1>Roguelike Dungeon Crawler</h1>
      {map.length > 0 && <GameBoard map={map} />}
    </div>
  );
}

export default App;
