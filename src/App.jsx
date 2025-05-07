import React, { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import MessageLog from './components/MessageLog';
import { generateMap } from './utils/mapGenerator';
import { resolveCombat } from './utils/combat';
import './App.css';

const initialPlayer = {
  hp: 100,
  maxHp: 100,
  weapon: { name: 'Rusty Sword', damage: 5 },
  x: 1,
  y: 1,
  inventory: [],
};

function App() {
  const [map, setMap] = useState([]);
  const [player, setPlayer] = useState(initialPlayer);
  const [messages, setMessages] = useState(['Welcome to the dungeon!']);

  useEffect(() => {
    const newMap = generateMap(20, 20);
    newMap[player.y][player.x] = 'player';
    setMap(newMap);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      let dx = 0;
      let dy = 0;
      switch (e.key.toLowerCase()) {
        case 'w': dy = -1; break;
        case 's': dy = 1; break;
        case 'a': dx = -1; break;
        case 'd': dx = 1; break;
        default: return;
      }

      const newX = player.x + dx;
      const newY = player.y + dy;

      if (newY >= 0 && newY < map.length && newX >= 0 && newX < map[0].length) {
        const targetTile = map[newY][newX];
        let newMessages = [];

        if (typeof targetTile === 'object' && targetTile.type === 'enemy') {
          const result = resolveCombat({ ...player }, { ...targetTile });
          setPlayer(result.player);
          map[newY][newX] = result.enemy.hp > 0 ? result.enemy : 'floor';
          newMessages = result.messages;
        } else if (typeof targetTile === 'object' && targetTile.type === 'item') {
          newMessages.push(`You picked up ${targetTile.name}.`);
          player.inventory.push(targetTile);
          map[newY][newX] = 'floor';
          setPlayer({ ...player });
        } else if (targetTile === 'floor') {
          map[player.y][player.x] = 'floor';
          map[newY][newX] = 'player';
          setPlayer({ ...player, x: newX, y: newY });
        }

        setMessages((prev) => [...prev, ...newMessages]);
        setMap([...map]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [map, player]);

  return (
    <div className="App">
      <h1>Roguelike Dungeon Crawler</h1>
      <div className="game-container">
        <GameBoard map={map} />
        <div className="side-panel">
          <HUD player={player} />
          <MessageLog messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default App;