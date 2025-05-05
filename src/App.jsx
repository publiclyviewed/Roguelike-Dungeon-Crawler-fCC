import { useState, useEffect } from 'react';
import { generateMap, TILE_TYPES } from './utils/mapGenerator';
import GameBoard from './components/GameBoard';

function App() {
  const [map, setMap] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const newMap = generateMap();

    let pos = { x: 0, y: 0 };
    for (let y = 0; y < newMap.length; y++) {
      for (let x = 0; x < newMap[y].length; x++) {
        if (newMap[y][x].type === TILE_TYPES.PLAYER) {
          pos = { x, y };
          break;
        }
      }
    }

    const visibleMap = updateVisibility(newMap, pos.x, pos.y);
    setMap(visibleMap);
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
    if (destination.type === TILE_TYPES.WALL) return;

    const newMap = map.map(row => row.map(tile => ({ ...tile })));
    const tileType = destination.type;

    // Handle item pickup
    if (tileType === TILE_TYPES.ITEM) {
      setInventory(prev => [...prev, 'Mysterious Item']);
    }

    newMap[playerPos.y][playerPos.x].type = TILE_TYPES.FLOOR;
    newMap[newY][newX].type = TILE_TYPES.PLAYER;

    const updatedMap = updateVisibility(newMap, newX, newY);
    setMap(updatedMap);
    setPlayerPos({ x: newX, y: newY });
  }

  function updateVisibility(map, px, py, radius = 3) {
    return map.map((row, y) =>
      row.map((tile, x) => {
        const dist = Math.abs(x - px) + Math.abs(y - py);
        return {
          ...tile,
          visible: dist <= radius,
        };
      })
    );
  }

  return (
    <div>
      <h1>Roguelike Dungeon Crawler</h1>
      {map.length > 0 && <GameBoard map={map} />}

      <div style={{ marginTop: '1rem' }}>
        <h2>Inventory</h2>
        {inventory.length === 0 ? (
          <p>Nothing yet...</p>
        ) : (
          <ul>
            {inventory.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
