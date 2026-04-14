import './Avatar.css'

export default function Avatar() {
  // Let's use some fake data to make the styling look good!
  const stats = {
    level: 1,
    title: "Novice Scholar",
    xp: 240,
    xpRequired: 500,
    focusHours: 12,
    streak: 3,
    coins: 150,
    finishedTasks: 27
  }

  const progressPercentage = (stats.xp / stats.xpRequired) * 100

  return (
    <div className="avatar-page">
      <header className="avatar-header">
        <h1>Your Avatar</h1>
        <p>Watch your avatar grow as you maintain your study habits!</p>
      </header>
      
      <section className="avatar-viewer">
        <div className="avatar-card">
          <div className="avatar-stage">
            <div className="avatar-sprite">🌱</div>
          </div>
          <div className="avatar-info">
            <h2>Level {stats.level}</h2>
            <p className="avatar-title">{stats.title}</p>
            
            <div className="xp-container">
              <div className="xp-labels">
                <span>XP</span>
                <span>{stats.xp} / {stats.xpRequired}</span>
              </div>
              <div className="xp-bar-bg">
                <div 
                  className="xp-bar-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="avatar-stats">
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <h3>Focus Time</h3>
          <p>{stats.focusHours} hours</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>Tasks</h3>
          <p>{stats.finishedTasks} done</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <h3>Current Streak</h3>
          <p>{stats.streak} days</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🪙</div>
          <h3>Coins</h3>
          <p>{stats.coins}</p>
        </div>
      </section>
    </div>
  )
}
