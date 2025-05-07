const TILE_TYPES = {
  WALL: 0,
  FLOOR: 1,
  PLAYER: 2,
  ENEMY: 3,
  ITEM: 4,
  EXIT: 5,
};

export function generateMap(width, height) {
  const map = Array.from({ length: height }, () => Array(width).fill(TILE_TYPES.WALL));

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      map[y][x] = TILE_TYPES.FLOOR;
    }
  }

  const playerPos = placeRandom(map, TILE_TYPES.PLAYER);
  const enemies = placeEnemies(map, 5);
  const items = placeItems(map, 4);
  const exit = placeRandom(map, TILE_TYPES.EXIT);

  return { map, playerPos, enemies, items, exit };
}

function placeRandom(map, type) {
  let x, y;
  do {
    x = Math.floor(Math.random() * map[0].length);
    y = Math.floor(Math.random() * map.length);
  } while (map[y][x] !== 1);
  map[y][x] = type;
  return { x, y };
}

function placeEnemies(map, count) {
  const enemies = [];
  for (let i = 0; i < count; i++) {
    const pos = placeRandom(map, 3);
    enemies.push({
      ...pos,
      hp: 8 + Math.floor(Math.random() * 4),
      attack: 2 + Math.floor(Math.random() * 3),
      type: ['Goblin', 'Slime', 'Skeleton'][Math.floor(Math.random() * 3)],
    });
  }
  return enemies;
}

function placeItems(map, count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const pos = placeRandom(map, 4);
    items.push({
      ...pos,
      type: Math.random() > 0.5 ? 'potion' : 'weapon',
      effect:
        Math.random() > 0.5
          ? { heal: 10 + Math.floor(Math.random() * 10) }
          : {
              damage: 3 + Math.floor(Math.random() * 4),
              name: ['Dagger', 'Sword', 'Axe'][Math.floor(Math.random() * 3)],
            },
    });
  }
  return items;
}
