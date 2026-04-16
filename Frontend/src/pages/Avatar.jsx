import './Avatar.css'

export default function Avatar() {
  // Mock data representing the user's progress and stats.
  // In a real application, this data would likely be fetched from an API.
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

  // Calculate the percentage of XP earned towards the next level
  // Used to dynamically set the width of the XP progress bar
  const progressPercentage = (stats.xp / stats.xpRequired) * 100

  return (
    <div className="avatar-page">
      {/* Page header providing context and introduction */}
      <header className="avatar-header">
        <h1>Your Avatar</h1>
        <p>Watch your avatar grow as you maintain your study habits!</p>
      </header>
      
      {/* Main viewer section that displays the user's current avatar and level */}
      <section className="avatar-viewer">
        <div className="avatar-card">
          {/* Visual representation of the avatar (e.g., a sapling emoji for now) */}
          <div className="avatar-stage">
            <div className="avatar-sprite">🌱</div>
          </div>
          
          {/* Text details about the user's level and title */}
          <div className="avatar-info">
            <h2>Level {stats.level}</h2>
            <p className="avatar-title">{stats.title}</p>
            
            {/* XP progress bar section */}
            <div className="xp-container">
              <div className="xp-labels">
                <span>XP</span>
                <span>{stats.xp} / {stats.xpRequired}</span>
              </div>
              <div className="xp-bar-bg">
                {/* Dynamically apply the calculated width percentage to the fill */}
                <div 
                  className="xp-bar-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid displaying the user's various study and engagement statistics */}
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
