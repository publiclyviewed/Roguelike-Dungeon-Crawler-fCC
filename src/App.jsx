import React, { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import MessageLog from './components/MessageLog';
import { generateMap } from './utils/mapGenerator';
import { handleCombat } from './utils/combat';
import './App.css';

// Constants for the game
const MAP_SIZE = 40; // Map is a square MAP_SIZE x MAP_SIZE
const TILE_SIZE = 16; // Size of each tile in pixels (for rendering)
const VISIBILITY_RANGE = 5; // How far the player can see
const MAX_LEVEL = 10; // Max player level

const App = () => {
    const [map, setMap] = useState([]);
    const [player, setPlayer] = useState(null);
    const [entities, setEntities] = useState([]); // Includes enemies, items, boss
    const [visibleTiles, setVisibleTiles] = useState(new Set());
    const [messageLog, setMessageLog] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const [dungeonLevel, setDungeonLevel] = useState(1); // Could be expanded for multiple levels

    const gameBoardRef = useRef(null); // Ref to focus the game board for keyboard input

    // --- Game Initialization ---
    useEffect(() => {
        initializeGame();
    }, [dungeonLevel]); // Re-initialize if dungeon level changes

    const initializeGame = () => {
        setMessageLog([]); // Clear messages for a new game/level
        addMessage(`Welcome to Dungeon Level ${dungeonLevel}!`);

        const { map, playerStart, initialEntities } = generateMap(MAP_SIZE, dungeonLevel);

        setMap(map);
        setPlayer({
            x: playerStart.x,
            y: playerStart.y,
            health: 100,
            maxHealth: 100,
            level: 1,
            xp: 0,
            xpToNextLevel: 50,
            weapon: { name: 'Fists', damage: { min: 5, max: 10 } },
            inventory: [],
            damage: { min: 5, max: 10 }, // Base damage
        });
        setEntities(initialEntities);
        setGameStatus('playing');

        // Focus the game board for keyboard input
        if (gameBoardRef.current) {
            gameBoardRef.current.focus();
        }
    };

    // --- Message Log ---
    const addMessage = (message) => {
        setMessageLog(prevLog => [...prevLog, message].slice(-10)); // Keep last 10 messages
    };

    // --- Fog of War / Visibility ---
    const calculateVisibleTiles = (playerX, playerY) => {
        const newVisibleTiles = new Set(visibleTiles);
        for (let dx = -VISIBILITY_RANGE; dx <= VISIBILITY_RANGE; dx++) {
            for (let dy = -VISIBILITY_RANGE; dy <= VISIBILITY_RANGE; dy++) {
                const tileX = playerX + dx;
                const tileY = playerY + dy;

                // Check bounds
                if (tileX >= 0 && tileX < MAP_SIZE && tileY >= 0 && tileY < MAP_SIZE) {
                     // Optional: Add line-of-sight checking for more realistic fog
                     // For simplicity, we'll use a simple square for now.
                    newVisibleTiles.add(`${tileX},${tileY}`);
                }
            }
        }
        setVisibleTiles(newVisibleTiles);
    };

    // Calculate initial visible tiles when player state is set
    useEffect(() => {
        if (player) {
            calculateVisibleTiles(player.x, player.y);
        }
    }, [player ? `${player.x},${player.y}` : null]); // Recalculate when player position changes


    // --- Player Movement and Interaction ---
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (gameStatus !== 'playing' || !player) return;

            let newPlayerX = player.x;
            let newPlayerY = player.y;
            let moved = false;

            switch (event.key) {
                case 'ArrowUp':
                    newPlayerY -= 1;
                    moved = true;
                    break;
                case 'ArrowDown':
                    newPlayerY += 1;
                    moved = true;
                    break;
                case 'ArrowLeft':
                    newPlayerX -= 1;
                    moved = true;
                    break;
                case 'ArrowRight':
                    newPlayerX += 1;
                    moved = true;
                    break;
                default:
                    break;
            }

            if (moved) {
                attemptMove(newPlayerX, newPlayerY);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [player, entities, map, gameStatus]); // Depend on state that affects movement logic

    const attemptMove = (x, y) => {
        // Check boundaries
        if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) {
            addMessage("You can't move there!");
            return;
        }

        // Check for wall collision (assuming 'wall' is the tile type)
        if (map[y][x].type === 'wall') {
            addMessage("You hit a wall!");
            return;
        }

        // Check for entity collision (enemies, items, boss)
        const targetEntity = entities.find(entity => entity.x === x && entity.y === y);

        if (targetEntity) {
            // Interaction logic
            if (targetEntity.type === 'enemy' || targetEntity.type === 'boss') {
                // Initiate combat
                startCombat(targetEntity);
            } else if (targetEntity.type === 'health') {
                // Pick up health
                pickupItem(targetEntity);
                // After pickup, the player moves onto the tile
                movePlayerTo(x, y);
            } else if (targetEntity.type === 'weapon') {
                 // Pick up weapon
                 pickupItem(targetEntity);
                 // After pickup, the player moves onto the tile
                 movePlayerTo(x, y);
            }
            // If it's an enemy/boss, combat happens and player doesn't move onto the tile yet
        } else {
            // No entity, just move
            movePlayerTo(x, y);
        }
    };

    const movePlayerTo = (x, y) => {
        setPlayer(prevPlayer => ({ ...prevPlayer, x, y }));
        // Visibility is updated via the useEffect hook that watches player position
    };

    // --- Combat ---
    const startCombat = (enemy) => {
        addMessage(`You encountered a ${enemy.name}!`);

        // Pass necessary state and update functions to the combat handler
        const combatResult = handleCombat(player, enemy, addMessage);

        if (combatResult.playerLost) {
            setGameStatus('lost');
            addMessage("You were defeated!");
        } else if (combatResult.enemyLost) {
            // Remove the defeated enemy
            setEntities(prevEntities => prevEntities.filter(e => e.id !== enemy.id));
            addMessage(`You defeated the ${enemy.name}!`);

            // Handle XP and leveling
            const xpGained = enemy.level * 10; // Simple XP formula
            addMessage(`You gained ${xpGained} XP.`);
            const newPlayerXP = player.xp + xpGained;
            let newPlayerLevel = player.level;
            let xpToNext = player.xpToNextLevel;
            let playerDamage = { ...player.damage };

            // Leveling up
            while (newPlayerXP >= xpToNext && newPlayerLevel < MAX_LEVEL) {
                 newPlayerLevel++;
                 xpToNext = Math.floor(xpToNext * 1.5); // XP required increases
                 playerDamage.min += 2; // Increase base damage on level up
                 playerDamage.max += 3;
                 addMessage(`You reached Level ${newPlayerLevel}!`);
            }

            setPlayer(prevPlayer => ({
                 ...prevPlayer,
                 xp: newPlayerXP,
                 level: newPlayerLevel,
                 xpToNextLevel: xpToNext,
                 damage: playerDamage,
                 weapon: { // Recalculate weapon damage based on new level
                     ...prevPlayer.weapon,
                      damage: {
                         min: (playerDamage.min + prevPlayer.weapon.baseDamage.min),
                         max: (playerDamage.max + prevPlayer.weapon.baseDamage.max)
                      }
                 }
            }));

            // Check for win condition if the defeated enemy was the boss
            if (enemy.type === 'boss') {
                 setGameStatus('won');
                 addMessage("You defeated the Boss! You win!");
            } else {
                 // After defeating a non-boss enemy, player moves onto the tile
                 movePlayerTo(enemy.x, enemy.y);
            }

        } else {
            // Combat ongoing, update player health
             setPlayer(prevPlayer => ({
                 ...prevPlayer,
                 health: combatResult.playerHealth
             }));
        }
    };

    // --- Item Pickup ---
    const pickupItem = (item) => {
        if (item.type === 'health') {
            const healthRestored = item.value;
            const newHealth = Math.min(player.health + healthRestored, player.maxHealth);
            setPlayer(prevPlayer => ({ ...prevPlayer, health: newHealth }));
            addMessage(`You used a health potion and restored ${healthRestored} health!`);
        } else if (item.type === 'weapon') {
             // Equip the new weapon if it's better (simple check based on max damage)
             if (item.damage.max + player.damage.max > player.weapon.damage.max) {
                 addMessage(`You found a ${item.name}! You equip it.`);
                 setPlayer(prevPlayer => ({
                     ...prevPlayer,
                     weapon: {
                         name: item.name,
                         baseDamage: item.damage, // Store base weapon damage
                         damage: { // Calculate total damage including player base damage
                             min: prevPlayer.damage.min + item.damage.min,
                             max: prevPlayer.damage.max + item.damage.max
                         }
                     },
                     inventory: [...prevPlayer.inventory, prevPlayer.weapon] // Add old weapon to inventory
                 }));
             } else {
                  addMessage(`You found a ${item.name}, but your current weapon is better.`);
                  // Could add to inventory or just leave it/destroy it
                  setPlayer(prevPlayer => ({
                      ...prevPlayer,
                      inventory: [...prevPlayer.inventory, item]
                  }));
             }
        }

        // Remove the item from the entities list
        setEntities(prevEntities => prevEntities.filter(e => e.id !== item.id));
    };

    // --- Game Over/Win Screen ---
    const renderGameOverlay = () => {
        if (gameStatus === 'won') {
            return (
                <div className="game-overlay">
                    <h2>Victory!</h2>
                    <p>You defeated the Boss and won the game!</p>
                    <button onClick={initializeGame}>Play Again</button>
                </div>
            );
        } else if (gameStatus === 'lost') {
            return (
                <div className="game-overlay">
                    <h2>Game Over</h2>
                    <p>You were defeated in the dungeon.</p>
                    <button onClick={initializeGame}>Try Again</button>
                </div>
            );
        }
        return null;
    };


    // Ensure the game board is focused when the game starts or is reset
    useEffect(() => {
        if (gameStatus === 'playing' && gameBoardRef.current) {
            gameBoardRef.current.focus();
        }
    }, [gameStatus]);


    return (
        <div className="app-container" tabIndex={0} ref={gameBoardRef}> {/* tabIndex makes it focusable */}
            {renderGameOverlay()}
            <div className="game-area">
                <GameBoard
                    map={map}
                    player={player}
                    entities={entities}
                    visibleTiles={visibleTiles}
                    tileSize={TILE_SIZE}
                />
                <div className="info-area">
                    <HUD player={player} dungeonLevel={dungeonLevel} />
                    <MessageLog messages={messageLog} />
                </div>
            </div>
        </div>
    );
};

export default App;