import React from 'react';
import './Gameboard.css';

const GameBoard = ({ map, player, entities, visibleTiles, tileSize }) => {
    if (!map || map.length === 0 || !player) {
        return <div>Loading map...</div>;
    }

    // Create a grid of tiles to render
    const grid = map.map((row, y) =>
        row.map((tile, x) => {
            const isVisible = visibleTiles.has(`${x},${y}`);
            const isPlayer = player.x === x && player.y === y;
            const entityOnTile = entities.find(entity => entity.x === x && entity.y === y);

            // Determine the class for the tile based on visibility and content
            let tileClass = `tile ${tile.type}`; // e.g., 'tile floor', 'tile wall'
            if (!isVisible) {
                tileClass += ' hidden'; // Apply fog of war
            }

            // Determine the content/entity to display on the tile
            let content = null;
            if (isVisible) {
                if (isPlayer) {
                    content = <div className="player">@</div>; // Player symbol
                } else if (entityOnTile) {
                    // Display entity symbol
                    if (entityOnTile.type === 'enemy') content = <div className="entity enemy">G</div>; // Goblin
                    if (entityOnTile.type === 'boss') content = <div className="entity boss">B</div>;   // Boss
                    if (entityOnTile.type === 'health') content = <div className="entity health">+</div>; // Health Potion
                    if (entityOnTile.type === 'weapon') content = <div className="entity weapon">W</div>; // Weapon
                } else {
                    // Empty floor tile
                    content = null; // Or a visual representation of a floor tile if needed
                }
            }


            return (
                <div
                    key={`${x}-${y}`}
                    className={tileClass}
                    style={{
                        width: `${tileSize}px`,
                        height: `${tileSize}px`,
                    }}
                >
                    {content}
                </div>
            );
        })
    );

    return (
        <div
            className="game-board"
            style={{
                width: `${map[0].length * tileSize}px`,
                height: `${map.length * tileSize}px`,
                display: 'grid',
                gridTemplateColumns: `repeat(${map[0].length}, ${tileSize}px)`,
                gridTemplateRows: `repeat(${map.length}, ${tileSize}px)`,
            }}
        >
            {grid}
        </div>
    );
};

export default GameBoard;