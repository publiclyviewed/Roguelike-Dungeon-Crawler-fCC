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
  // Place enemies with stats
for (let i = 0; i < 10; i++) {
    const enemyTile = {
      type: TILE_TYPES.ENEMY,
      visible: false,
      health: 30 + Math.floor(Math.random() * 20),
      damage: 5 + Math.floor(Math.random() * 5),
      xp: 10 + Math.floor(Math.random() * 10)
    };
    placeCustomEntity(map, enemyTile);
  }
  
  for (let i = 0; i < 6; i++) {
    const rand = Math.random();
    const itemTile = {
      type: TILE_TYPES.ITEM,
      visible: false,
      subtype: rand < 0.5 ? 'health' : 'weapon'
    };
  
    if (itemTile.subtype === 'weapon') {
      itemTile.weapon = {
        name: 'Sword',
        damage: 10 + Math.floor(Math.random() * 5)
      };
    }
  
    placeCustomEntity(map, itemTile);
  }
  
  const bossTile = {
    type: TILE_TYPES.BOSS,
    visible: false,
    health: 100,
    damage: 15,
    xp: 50
  };
  placeCustomEntity(map, bossTile);
  
  function placeCustomEntity(map, entity) {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * MAP_WIDTH);
      const y = Math.floor(Math.random() * MAP_HEIGHT);
      const tile = map[y][x];
      if (tile.type === TILE_TYPES.FLOOR) {
        map[y][x] = {
          ...entity,
          x,
          y
        };
        placed = true;
      }
    }
  }
  

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
