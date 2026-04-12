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
  const [tasks, setTasks] = useState([])
  const [isAddingQuest, setIsAddingQuest] = useState(false)
  const [newQuestSubject, setNewQuestSubject] = useState('')
  const [newQuestExercise, setNewQuestExercise] = useState('')

  const handleAddQuest = async () => {
    if (!newQuestSubject.trim() || !newQuestExercise.trim()) return;
    
    const token = localStorage.getItem('authToken')
    if (!token) return;

    try {
      const activeSubjectId = subjects.length > 0 ? subjects[0].id : 1; 

      const res = await fetch('http://localhost:5168/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskName: `${newQuestSubject.trim()}: ${newQuestExercise.trim()}`,
          status: 0, // TaskStatus.Todo
          subjectId: activeSubjectId,
          userId: 'temp', // Backend will inject the correct user ID
          dueDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString() // End of today
        })
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setNewQuestSubject('');
        setNewQuestExercise('');
        setIsAddingQuest(false);
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  }

  // Fake User Stats
  const userStats = {
    username: 'Scholar',
    level: 12,
    xp: 450,
    xpRequired: 1000,
    coins: 1250
  }
  
  // Study Sessions State
  const [sessions, setSessions] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          // Fetch sessions
          const resSessions = await fetch('http://localhost:5168/api/studysessions', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (resSessions.ok) {
            const data = await resSessions.json()
            console.log("Fetched Sessions from DB:", data)
            setSessions(data)
          } else if (resSessions.status === 401) {
            console.error('Session token expired!')
            localStorage.removeItem('authToken')
            navigate('/login')
            return // Stop execution if unauthorized
          } else {
            console.error('Failed to fetch sessions from DB. Status:', resSessions.status, await resSessions.text())
          }

          // Fetch subjects
          const resSubjects = await fetch('http://localhost:5168/api/subjects', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (resSubjects.ok) {
            const dataSubjects = await resSubjects.json()
            if (dataSubjects.length === 0) {
              // Create a default subject if user has none
              const createRes = await fetch('http://localhost:5168/api/subjects', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                  subjectName: 'General Study', 
                  colorHex: '#BD93F9', 
                  isDefault: true,
                  userId: 'temp' // Backend service overrides this, but [Required] validation needs it
                })
              })
              if (createRes.ok) {
                const newSub = await createRes.json()
                setSubjects([newSub])
              } else {
                console.error('Failed to create default subject:', await createRes.text());
              }
            } else {
              setSubjects(dataSubjects)
            }
          }

          // Fetch Tasks
          const resTasks = await fetch('http://localhost:5168/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (resTasks.ok) {
            const dataTasks = await resTasks.json()
            setTasks(dataTasks)
          }

        } catch (err) {
          console.error('Failed to fetch data:', err)
        }
      }
    }
    fetchData()
  }, [])

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
            // Assume we've just completed a session. Provide current time.
            const now = new Date().toISOString()
            const activeSubjectId = subjects.length > 0 ? subjects[0].id : 1; // Fallback to 1

            fetch('http://localhost:5168/api/studysessions', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                actualDurationMinutes: sessionLength,
                plannedDurationMinutes: sessionLength,
                plannedStartTime: now,
                actualStartTime: now,
                endTime: now,
                status: 2, // 2 = Completed
                pointsEarned: sessionLength * 10, // Example logic for points
                subjectId: activeSubjectId,
                userId: 'temp' // Required by backend model validation, overridden securely by backend
              })
            })
            .then(res => {
              if (res.ok) {
                console.log('Session saved successfully!')
                return res.json()
              } else {
                return res.text().then(text => { throw new Error(text) })
              }
            })
            .then(data => {
               // Update UI with new coins/XP if the backend returns it
               setSessions(prev => [...prev, data])
               console.log(data)
            })
            .catch(err => {
               console.error('Failed to save session:', err)
               alert('Error saving session: ' + err.message)
            })
          }

          // Play a sound or notify here
        }
      }
    }
    return () => clearInterval(interval)
  }, [isActive, isBreak, focusTimeLeft, breakTimeLeft, sessionLength, subjects])

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

  const toggleTask = async (taskId) => {
    const taskToToggle = tasks.find(t => t.id === taskId);
    if (!taskToToggle) return;
    
    // Toggle completed status: 0 = Todo, 2 = Done
    const newStatus = taskToToggle.status === 2 ? 0 : 2; 

    // Optimistically update UI
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await fetch(`http://localhost:5168/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...taskToToggle,
          status: newStatus
        })
      });
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Revert if failed
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, status: taskToToggle.status } : t
      ));
    }
  }

  const deleteTask = async (taskId) => {
    // Optimistically update UI
    const restoredTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId));

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5168/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
    } catch (err) {
      console.error('Failed to delete task:', err);
      setTasks(restoredTasks); // Revert on failure
    }
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

  // Activity Aggregation
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as start of week
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let todayCount = 0, todayMinutes = 0;
  let weekCount = 0, weekMinutes = 0;
  let monthCount = 0, monthMinutes = 0;

  sessions.forEach(s => {
    // Attempt actual start or planned start
    const dateStr = s.actualStartTime || s.plannedStartTime;
    if (!dateStr) return; // Skip if no valid date

    const sessionDate = new Date(dateStr);
    const duration = s.actualDurationMinutes || 0;

    if (sessionDate >= startOfMonth) {
      monthCount++;
      monthMinutes += duration;
    }
    if (sessionDate >= startOfWeek) {
      weekCount++;
      weekMinutes += duration;
    }
    if (sessionDate >= startOfToday) {
      todayCount++;
      todayMinutes += duration;
    }
  });

  const formatActivityTime = (minutes) => {
    if (minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

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
              {tasks.map(task => {
                const isCompleted = task.status === 2; // 2 -> Done
                return (
                  <li key={task.id} className={isCompleted ? 'task-completed' : ''} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={isCompleted} 
                        onChange={() => toggleTask(task.id)} 
                      />
                      <span>{task.taskName}</span>
                    </label>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--dash-gray, #888)', cursor: 'pointer', padding: '0 0.5rem', fontSize: '1rem' }}
                      title="Remove Quest"
                      aria-label="Remove Quest"
                    >
                      ✖
                    </button>
                  </li>
                )
              })}
            </ul>
            {isAddingQuest ? (
              <div className="add-quest-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Subject (e.g. Math, History)" 
                  value={newQuestSubject} 
                  onChange={(e) => setNewQuestSubject(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  autoFocus
                />
                <input 
                  type="text" 
                  placeholder="Exercise/Task" 
                  value={newQuestExercise} 
                  onChange={(e) => setNewQuestExercise(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-primary" onClick={handleAddQuest}>Add</button>
                  <button className="btn-ghost" onClick={() => setIsAddingQuest(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn-ghost" onClick={() => setIsAddingQuest(true)}>+ Add New Quest</button>
            )}
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

          <article className="dashboard-card stats-card" style={{ marginBottom: '0.5rem' }}>
            <h2>Today's Activity</h2>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-value">{todayCount}</span>
                <span className="activity-label">Sessions</span>
              </div>
              <div className="activity-item">
                <span className="activity-value">{formatActivityTime(todayMinutes)}</span>
                <span className="activity-label">Focus Time</span>
              </div>
            </div>
          </article>

          <article className="dashboard-card stats-card" style={{ marginBottom: '0.5rem' }}>
            <h2>This Week's Activity</h2>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-value">{weekCount}</span>
                <span className="activity-label">Sessions</span>
              </div>
              <div className="activity-item">
                <span className="activity-value">{formatActivityTime(weekMinutes)}</span>
                <span className="activity-label">Focus Time</span>
              </div>
            </div>
          </article>

          <article className="dashboard-card stats-card">
            <h2>Monthly Activity</h2>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-value">{monthCount}</span>
                <span className="activity-label">Sessions</span>
              </div>
              <div className="activity-item">
                <span className="activity-value">{formatActivityTime(monthMinutes)}</span>
                <span className="activity-label">Focus Time</span>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  )
}
