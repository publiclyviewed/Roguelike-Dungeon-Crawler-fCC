import React from 'react';
import './HUD.css';

function HUD({ player }) {
  return (
    <div className="hud">
      <h2>Player Stats</h2>
      <p><strong>HP:</strong> {player.hp} / {player.maxHp}</p>
      <p><strong>Weapon:</strong> {player.weapon.name} (Damage: {player.weapon.damage})</p>
      <h3>Inventory</h3>
      <ul>
        {player.inventory.length === 0 ? <li>(empty)</li> : player.inventory.map((item, i) => (
          <li key={i}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HUD;
