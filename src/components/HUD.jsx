function HUD({ stats, level, xp }) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <p><strong>// <div className="health-bar">
   <div className="health-fill" style={{ width: `${(stats.health / stats.maxHealth) * 100}%` }}></div>
 </div></strong> {stats.health} / {stats.maxHealth}</p>
        <p><strong>Weapon:</strong> {stats.weapon.name} (DMG: {stats.weapon.damage})</p>
        <p><strong>Level:</strong> {level}</p>
        <p><strong>XP:</strong> {xp} / {level * 20}</p>
      </div>
    );
  }
  
  export default HUD;