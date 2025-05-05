// Map tile types: floor, wall, player, enemy, item, boss

const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;

export const TILE_TYPES = {
  FLOOR: 'floor',
  WALL: 'wall',
  PLAYER: 'player',
  ENEMY: 'enemy',
  ITEM: 'item',
  BOSS: 'boss'
};

export function generateMap() {
  const map = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      const isWall = Math.random() < 0.1; // 10% chance to be a wall
      row.push({
        type: isWall ? TILE_TYPES.WALL : TILE_TYPES.FLOOR,
        visible: false,
        x,
        y
      });
    }
    map.push(row);
  }

  // Place player at a random floor tile
  placeEntityRandomly(map, TILE_TYPES.PLAYER);

  // Place enemies, items, boss
  for (let i = 0; i < 10; i++) placeEntityRandomly(map, TILE_TYPES.ENEMY);
  for (let i = 0; i < 6; i++) placeEntityRandomly(map, TILE_TYPES.ITEM);
  placeEntityRandomly(map, TILE_TYPES.BOSS);

  return map;
}

function placeEntityRandomly(map, type) {
  let placed = false;
  while (!placed) {
    const x = Math.floor(Math.random() * MAP_WIDTH);
    const y = Math.floor(Math.random() * MAP_HEIGHT);
    const tile = map[y][x];
    if (tile.type === TILE_TYPES.FLOOR) {
      tile.type = type;
      placed = true;
    }
  }
}
