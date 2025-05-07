// combat.js

export function handleCombat(player, enemy, setPlayerStats, setMap, map, playerPos) {
  const damageDealt = player.weapon.damage;
  const damageTaken = enemy.damage;

  // Player attacks enemy
  enemy.health -= damageDealt;

  // Update the message log
  const messages = [];
  messages.push(`You hit the ${enemy.type === 'BOSS' ? 'boss' : 'enemy'} for ${damageDealt} damage!`);

  if (enemy.health > 0) {
    // Enemy retaliates if still alive
    setPlayerStats(prevStats => ({
      ...prevStats,
      health: Math.max(0, prevStats.health - damageTaken),
    }));
    messages.push(`The ${enemy.type === 'BOSS' ? 'boss' : 'enemy'} attacks you for ${damageTaken} damage!`);
  } else {
    // Enemy defeated, update player stats and map
    setPlayerStats(prevStats => ({
      ...prevStats,
      xp: prevStats.xp + enemy.xp,
    }));
    messages.push(`You defeated the ${enemy.type === 'BOSS' ? 'boss' : 'enemy'}! Gained ${enemy.xp} XP.`);

    // Replace enemy tile with a floor tile
    const newMap = map.map(row => row.map(tile => ({ ...tile })));
    newMap[playerPos.y][playerPos.x] = {
      ...newMap[playerPos.y][playerPos.x],
      type: 'FLOOR', // Make the enemy tile a floor
      visible: true,
    };
    setMap(newMap);
  }

  return messages;
}
