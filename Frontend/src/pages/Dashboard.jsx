import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Timer State
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60)
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [customMinutes, setCustomMinutes] = useState(25)
  const [sessionLength, setSessionLength] = useState(25) // The total duration of the current focus session

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review Math Chapter 4', completed: false },
    { id: 2, text: 'Write History Essay Outline', completed: true },
    { id: 3, text: 'Read Biology Notes', completed: false },
  ])

  // Fake User Stats
  const userStats = {
    username: 'Scholar',
    level: 12,
    xp: 450,
    xpRequired: 1000,
    coins: 1250
  }

  useEffect(() => {
    let interval = null
    if (isActive) {
      if (isBreak) {
        if (breakTimeLeft > 0) {
          interval = setInterval(() => {
            setBreakTimeLeft(time => time - 1)
          }, 1000)
        } else {
          // Break is completely done! Switch back to focus session and continue.
          setIsBreak(false)
        }
      } else {
        if (focusTimeLeft > 0) {
          interval = setInterval(() => {
            setFocusTimeLeft(time => time - 1)
          }, 1000)
        } else {
          // Focus time is completed!
          setIsActive(false)
          
          // Submit the completed session to the backend
          const token = localStorage.getItem('authToken')
          if (token) {
            // Adjust URL to match your backend port and the exact endpoint route
            fetch('http://localhost:5168/api/studysessions', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                actualDurationMinutes: sessionLength,
                plannedDurationMinutes: sessionLength,
                // Adjust model properties as your backend dictates
              })
            })
            .then(res => {
              if (res.ok) {
                console.log('Session saved successfully!')
                return res.json()
              }
            })
            .then(data => {
               // Update UI with new coins/XP if the backend returns it
               console.log(data)
            })
            .catch(err => console.error('Failed to save session:', err))
          }

          // Play a sound or notify here
        }
      }
    }
    return () => clearInterval(interval)
  }, [isActive, isBreak, focusTimeLeft, breakTimeLeft, sessionLength])

  const toggleTimer = () => setIsActive(!isActive)
  
  const resetFocusTimer = (minutes) => {
    setIsActive(false)
    setFocusTimeLeft(minutes * 60)
    setSessionLength(minutes)
  }

  const resetBreakTimer = (minutes) => {
    setIsActive(false)
    setBreakTimeLeft(minutes * 60)
  }

  const cancelSession = () => {
    setIsActive(false)
    setIsBreak(false)
    setFocusTimeLeft(customMinutes ? customMinutes * 60 : 25 * 60)
    setBreakTimeLeft(5 * 60)
  }

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  // Formatting time
  const focusMinutes = Math.floor(focusTimeLeft / 60)
  const focusSeconds = focusTimeLeft % 60
  
  const breakMinutes = Math.floor(breakTimeLeft / 60)
  const breakSeconds = breakTimeLeft % 60

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-info">
          <p className="dashboard-kicker">Welcome back, Scholar!</p>
          <h1>Focus Dashboard</h1>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-grid">
        {/* Left Column: Timer & Tasks */}
        <div className="dashboard-main-col">
          
          <article className="dashboard-card timer-card" style={{ position: 'relative' }}>
            <button 
              onClick={cancelSession} 
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'transparent', 
                border: 'none', 
                fontSize: '1.25rem', 
                lineHeight: '1',
                cursor: 'pointer',
                color: 'var(--dash-gray, #888)'
              }}
              title="Cancel Session"
              aria-label="Cancel Session"
            >
              ✖
            </button>
            {isBreak ? (
              <>
                <div className="timer-header">
                  <h2>Focus Session</h2>
                  <div className="timer-display-small" style={{ color: 'var(--dash-gray)' }}>
                    {String(focusMinutes).padStart(2, '0')}:{String(focusSeconds).padStart(2, '0')} (Paused)
                  </div>
                </div>
                <h2>Break Time</h2>
                <div className="timer-display">
                  {String(breakMinutes).padStart(2, '0')}:{String(breakSeconds).padStart(2, '0')}
                </div>
              </>
            ) : (
              <>
                <h2>Focus Session</h2>
                <div className="timer-display">
                  {String(focusMinutes).padStart(2, '0')}:{String(focusSeconds).padStart(2, '0')}
                </div>
              </>
            )}
            <div className="timer-controls">
              <button className="btn-primary" onClick={toggleTimer}>
                {isActive ? 'Pause' : 'Start'}
              </button>
              <button className="btn-secondary" onClick={() => { setIsBreak(false); resetFocusTimer(25); }}>
                Pomodoro (25m)
              </button>
              <button className="btn-secondary" onClick={() => { setIsBreak(true); resetBreakTimer(5); setIsActive(true); }}>
                Short Break (5m)
              </button>
            </div>
            
            <div className="custom-timer">
              <input 
                type="number" 
                className="timer-input" 
                min="1" 
                max="120"
                value={customMinutes} 
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
              />
              <button 
                className="btn-ghost" 
                onClick={() => { setIsBreak(false); resetFocusTimer(customMinutes); }}
              >
                Custom Focus
              </button>
              <button 
                className="btn-ghost" 
                onClick={() => { setIsBreak(true); resetBreakTimer(customMinutes); setIsActive(true); }}
              >
                Custom Break
              </button>
            </div>
          </article>

          <article className="dashboard-card task-card">
            <h2>Today's Quests</h2>
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className={task.completed ? 'task-completed' : ''}>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(task.id)} 
                    />
                    <span>{task.text}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button className="btn-ghost">+ Add New Quest</button>
          </article>

        </div>

        {/* Right Column: Avatar & Stats */}
        <div className="dashboard-side-col">
          
          <article className="dashboard-card avatar-card">
            <h2>{userStats.username}</h2>
            <div className="avatar-display">
              <div className="avatar-placeholder">🧑‍🎓</div>
            </div>
            
            <div className="stats-section">
              <div className="stat-row">
                <span className="stat-label">Level {userStats.level}</span>
                <span className="stat-value">{userStats.xp} / {userStats.xpRequired} XP</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${(userStats.xp / userStats.xpRequired) * 100}%` }}
                ></div>
              </div>
              
              <div className="stat-row coins-row">
                <span className="stat-label">🪙 Coins</span>
                <span className="stat-value text-gold">{userStats.coins}</span>
              </div>
            </div>
          </article>

          <article className="dashboard-card stats-card">
            <h2>Activity</h2>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-value">4</span>
                <span className="activity-label">Sessions Today</span>
              </div>
              <div className="activity-item">
                <span className="activity-value">120m</span>
                <span className="activity-label">Focus Time</span>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  )
}
