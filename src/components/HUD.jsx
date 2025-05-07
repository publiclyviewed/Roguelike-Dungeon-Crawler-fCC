import React from 'react';
import './HUD.css';

const HUD = ({ player, dungeonLevel }) => {
    if (!player) return null; // Don't render until player data is available

    // Calculate XP percentage for progress bar (optional)
    const xpPercentage = (player.xp / player.xpToNextLevel) * 100;
     const healthPercentage = (player.health / player.maxHealth) * 100;

    return (
        <div className="hud">
            <h3>Player Status</h3>
            <p>Level: {player.level}</p>
            <p>Health: {player.health} / {player.maxHealth}</p>
            <div className="health-bar-container">
                 <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
            </div>
            <p>Weapon: {player.weapon.name} (Damage: {player.weapon.damage.min}-{player.weapon.damage.max})</p>
            <p>XP: {player.xp} / {player.xpToNextLevel}</p>
             {/* Optional XP Bar */}
             {player.level < 10 && ( // Don't show XP bar at max level
                 <div className="xp-bar-container">
                     <div className="xp-bar" style={{ width: `${xpPercentage}%` }}></div>
                 </div>
             )}
            <p>Dungeon Level: {dungeonLevel}</p>
            {/* Add other stats like inventory later if desired */}
        </div>
    );
};

export default HUD;