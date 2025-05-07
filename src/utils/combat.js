export function resolveCombat(player, enemy) {
  const playerAttack = Math.floor(Math.random() * player.weapon.damage) + 1;
  const enemyAttack = Math.floor(Math.random() * enemy.attack) + 1;

  enemy.hp -= playerAttack;
  const messages = [`You attack the ${enemy.type} for ${playerAttack} damage.`];

  if (enemy.hp > 0) {
    player.hp -= enemyAttack;
    messages.push(`The ${enemy.type} hits you back for ${enemyAttack} damage.`);
  } else {
    messages.push(`You defeated the ${enemy.type}!`);
  }

  return {
    player,
    enemy,
    messages,
  };
}
