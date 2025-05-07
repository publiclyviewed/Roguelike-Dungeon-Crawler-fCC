// Simple map generation - creates rooms and connects them
export const generateMap = (size, dungeonLevel) => {
  const map = Array(size).fill(null).map(() => Array(size).fill({ type: 'wall' }));

  const rooms = [];
  const numRooms = 10 + dungeonLevel * 2; // More rooms on higher levels
  const maxRoomSize = 8;
  const minRoomSize = 4;

  // Attempt to create rooms
  for (let i = 0; i < numRooms * 5; i++) { // Try multiple times to place rooms
      const roomWidth = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
      const roomHeight = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
      const roomX = Math.floor(Math.random() * (size - roomWidth - 1)) + 1;
      const roomY = Math.floor(Math.random() * (size - roomHeight - 1)) + 1;

      let overlaps = false;
      for (const existingRoom of rooms) {
          // Simple overlap check with a small buffer
          if (roomX < existingRoom.x + existingRoom.width + 1 &&
              roomX + roomWidth + 1 > existingRoom.x &&
              roomY < existingRoom.y + existingRoom.height + 1 &&
              roomY + roomHeight + 1 > existingRoom.y) {
              overlaps = true;
              break;
          }
      }

      if (!overlaps) {
          rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
          // Carve out the room
          for (let y = roomY; y < roomY + roomHeight; y++) {
              for (let x = roomX; x < roomX + roomWidth; x++) {
                  map[y][x] = { type: 'floor' };
              }
          }
      }
  }

  // Connect rooms with corridors (simple implementation)
  for (let i = 0; i < rooms.length - 1; i++) {
      const room1 = rooms[i];
      const room2 = rooms[i + 1];

      // Connect centers of rooms
      connectRooms(map, room1, room2);
  }

  // Carve out the last room to connect back (optional, creates a loop)
   if (rooms.length > 1) {
       connectRooms(map, rooms[rooms.length - 1], rooms[0]);
   }


  // Ensure all floor tiles are reachable (more advanced techniques needed for guarantees)
  // For this simple version, we assume the connections make the map navigable.

  // Place player in the first room
  const playerStartRoom = rooms[0];
  const playerStart = {
      x: playerStartRoom.x + Math.floor(playerStartRoom.width / 2),
      y: playerStartRoom.y + Math.floor(playerStartRoom.height / 2)
  };

  const initialEntities = [];
  let entityIdCounter = 0; // Unique ID for entities

  // Helper to find a random empty floor tile
  const findEmptyFloor = () => {
      let x, y;
      do {
          x = Math.floor(Math.random() * size);
          y = Math.floor(Math.random() * size);
      } while (map[y][x].type !== 'floor' || (x === playerStart.x && y === playerStart.y) || initialEntities.some(e => e.x === x && e.y === y));
      return { x, y };
  };

  // Place Boss (in the last room)
  const bossRoom = rooms[rooms.length - 1];
  const bossPos = {
      x: bossRoom.x + Math.floor(bossRoom.width / 2),
      y: bossRoom.y + Math.floor(bossRoom.height / 2)
  };
   initialEntities.push({
       id: entityIdCounter++,
       type: 'boss',
       name: 'Dungeon Boss',
       x: bossPos.x,
       y: bossPos.y,
       health: 150 + dungeonLevel * 50,
       damage: { min: 15 + dungeonLevel * 3, max: 25 + dungeonLevel * 5 },
       level: 5 + dungeonLevel,
   });


  // Place Enemies
  const numEnemies = 5 + dungeonLevel * 3;
  for (let i = 0; i < numEnemies; i++) {
      const pos = findEmptyFloor();
      initialEntities.push({
          id: entityIdCounter++,
          type: 'enemy',
          name: 'Goblin', // Could have different enemy types
          x: pos.x,
          y: pos.y,
          health: 30 + dungeonLevel * 10,
          damage: { min: 5 + dungeonLevel, max: 10 + dungeonLevel * 2 },
          level: 1 + dungeonLevel,
      });
  }

  // Place Health Items
  const numHealthItems = Math.floor(numRooms / 2);
  for (let i = 0; i < numHealthItems; i++) {
       const pos = findEmptyFloor();
       initialEntities.push({
           id: entityIdCounter++,
           type: 'health',
           name: 'Health Potion',
           x: pos.x,
           y: pos.y,
           value: 30 + dungeonLevel * 5, // Restores health
       });
  }


  // Place Weapons
  const weapons = [
      { name: 'Dagger', damage: { min: 8, max: 15 } },
      { name: 'Sword', damage: { min: 12, max: 20 } },
      { name: 'Axe', damage: { min: 15, max: 25 } },
      { name: 'Greatsword', damage: { min: 20, max: 35 } },
  ];
  const numWeapons = Math.floor(numRooms / 3);
  for (let i = 0; i < numWeapons && i < weapons.length; i++) {
       const pos = findEmptyFloor();
       initialEntities.push({
           id: entityIdCounter++,
           type: 'weapon',
           name: weapons[i].name,
           x: pos.x,
           y: pos.y,
           damage: weapons[i].damage, // Base damage from the weapon
       });
  }


  return { map, playerStart, initialEntities };
};

// Helper function to connect two rooms with a corridor
const connectRooms = (map, room1, room2) => {
  const x1 = room1.x + Math.floor(room1.width / 2);
  const y1 = room1.y + Math.floor(room1.height / 2);
  const x2 = room2.x + Math.floor(room2.width / 2);
  const y2 = room2.y + Math.floor(room2.height / 2);

  // Dig horizontal corridor
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      map[y1][x] = { type: 'floor' };
  }

  // Dig vertical corridor
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      map[y][x2] = { type: 'floor' };
  }
};