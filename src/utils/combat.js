// Function to simulate a turn in combat
const takeCombatTurn = (attacker, defender, addMessage) => {
  const damage = Math.floor(Math.random() * (attacker.damage.max - attacker.damage.min + 1)) + attacker.damage.min;
  const newDefenderHealth = Math.max(0, defender.health - damage);

  addMessage(`${attacker.name} attacks ${defender.name} for ${damage} damage.`);

  return { newHealth: newDefenderHealth, damageDealt: damage };
};

// Main combat handler function
export const handleCombat = (player, enemy, addMessage) => {
  let currentPlayerHealth = player.health;
  let currentEnemyHealth = enemy.health;
  let playerLost = false;
  let enemyLost = false;

  // Simple turn-based combat loop (could be expanded to multiple rounds)
  // In this version, one round of combat happens instantly when engaging.
  // The player attacks first.

  // Player's turn
  const playerAttackResult = takeCombatTurn(
      { name: 'You', damage: player.weapon.damage }, // Player uses weapon damage
      enemy,
      addMessage
  );
  currentEnemyHealth = playerAttackResult.newHealth;

  if (currentEnemyHealth <= 0) {
      enemyLost = true;
  } else {
      // Enemy's turn (if still alive)
      const enemyAttackResult = takeCombatTurn(
          { name: enemy.name, damage: enemy.damage }, // Enemy uses its damage
          { name: 'You', health: currentPlayerHealth },
          addMessage
      );
      currentPlayerHealth = enemyAttackResult.newHealth;

      if (currentPlayerHealth <= 0) {
          playerLost = true;
      }
  }

  // Return the state after the round of combat
  return {
      playerHealth: currentPlayerHealth,
      enemyHealth: currentEnemyHealth,
      playerLost: playerLost,
      enemyLost: enemyLost
  };
};