import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:8080/api';

// Auth Service
const AuthService = {
  login: (username, password) => {
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
      });
  },

  register: (username, email, password) => {
    return fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    }).then(response => response.json());
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getAuthHeader: () => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      return { 'Authorization': 'Bearer ' + user.token };
    }
    return {};
  }
};

// Login Component
function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');
    
    AuthService.login(username, password)
      .then((data) => {
        if (data.token) {
          window.location.href = '/dashboard';
        } else {
          setMessage(data.message || 'Login failed');
        }
      })
      .catch(() => {
        setMessage('Login failed. Please check your credentials.');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Login</h3>
              {message && <div className="alert alert-danger">{message}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              <p className="mt-3 text-center">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Register Component
function Register() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage('');
    
    AuthService.register(username, email, password)
      .then((data) => {
        if (data.message && data.message.includes('successfully')) {
          setMessage('Registration successful! Please login.');
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          setMessage(data.message || 'Registration failed');
        }
      })
      .catch(() => {
        setMessage('Registration failed. Please try again.');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Register</h3>
              {message && (
                <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                  />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Register</button>
              </form>
              <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation() {
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

  if (!currentUser) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <i className="bi bi-activity"></i> OctoFit Tracker
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/activities">Activities</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/teams">Teams</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <span className="navbar-text me-3">
                Welcome, {currentUser.username}!
              </span>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// Dashboard Component
function Dashboard() {
  const [stats, setStats] = React.useState({
    totalActivities: 0,
    totalDuration: 0,
    thisWeekDuration: 0,
    myTeams: 0
  });

  React.useEffect(() => {
    // Fetch user stats
    fetch(`${API_URL}/activities`, {
      headers: AuthService.getAuthHeader()
    })
      .then(res => res.json())
      .then(activities => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
        const thisWeekDuration = activities
          .filter(a => new Date(a.activityDate) >= weekAgo)
          .reduce((sum, a) => sum + a.duration, 0);
        
        setStats(prev => ({
          ...prev,
          totalActivities: activities.length,
          totalDuration,
          thisWeekDuration
        }));
      })
      .catch(err => console.error('Failed to fetch activities:', err));

    fetch(`${API_URL}/teams`, {
      headers: AuthService.getAuthHeader()
    })
      .then(res => res.json())
      .then(teams => {
        const myTeams = teams.filter(t => t.isCaptain || t.isMember).length;
        setStats(prev => ({ ...prev, myTeams }));
      })
      .catch(err => console.error('Failed to fetch teams:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Activities</h5>
              <h3>{stats.totalActivities}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">This Week</h5>
              <h3>{stats.thisWeekDuration} min</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Time</h5>
              <h3>{stats.totalDuration} min</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">My Teams</h5>
              <h3>{stats.myTeams}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4>Quick Actions</h4>
        <div className="list-group">
          <Link to="/activities" className="list-group-item list-group-item-action">
            Log a new activity
          </Link>
          <Link to="/teams" className="list-group-item list-group-item-action">
            Join a team
          </Link>
          <Link to="/leaderboard" className="list-group-item list-group-item-action">
            View leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// Activities Component (simplified - needs full implementation)
function Activities() {
  const [activities, setActivities] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    activityType: 'running',
    duration: '',
    distance: '',
    calories: '',
    notes: '',
    activityDate: new Date().toISOString().split('T')[0]
  });

  React.useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = () => {
    fetch(`${API_URL}/activities`, {
      headers: AuthService.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error('Failed to fetch activities:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeader()
      },
      body: JSON.stringify({
        ...formData,
        duration: parseInt(formData.duration),
        distance: formData.distance ? parseFloat(formData.distance) : null,
        calories: formData.calories ? parseInt(formData.calories) : null
      })
    })
      .then(res => res.json())
      .then(() => {
        fetchActivities();
        setShowForm(false);
        setFormData({
          activityType: 'running',
          duration: '',
          distance: '',
          calories: '',
          notes: '',
          activityDate: new Date().toISOString().split('T')[0]
        });
      })
      .catch(err => console.error('Failed to create activity:', err));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Activities</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Log Activity'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Log New Activity</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Activity Type</label>
                  <select
                    className="form-control"
                    value={formData.activityType}
                    onChange={e => setFormData({...formData, activityType: e.target.value})}
                  >
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="walking">Walking</option>
                    <option value="gym">Gym</option>
                    <option value="yoga">Yoga</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.activityDate}
                    onChange={e => setFormData({...formData, activityDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData.distance}
                    onChange={e => setFormData({...formData, distance: e.target.value})}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Calories</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.calories}
                    onChange={e => setFormData({...formData, calories: e.target.value})}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Save Activity</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {activities.map(activity => (
          <div key={activity.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)}
                </h5>
                <p className="card-text">
                  <strong>Date:</strong> {activity.activityDate}<br />
                  <strong>Duration:</strong> {activity.duration} minutes<br />
                  {activity.distance && <><strong>Distance:</strong> {activity.distance} km<br /></>}
                  {activity.calories && <><strong>Calories:</strong> {activity.calories}<br /></>}
                  {activity.notes && <><strong>Notes:</strong> {activity.notes}</>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Teams Component (copy from Django version but use JWT auth)
function Teams() {
  const [teams, setTeams] = React.useState([]);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [teamName, setTeamName] = React.useState('');
  const [teamDescription, setTeamDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    fetch(`${API_URL}/teams`, {
      headers: AuthService.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Failed to fetch teams:', err));
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    setLoading(true);
    
    fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeader()
      },
      body: JSON.stringify({ name: teamName, description: teamDescription })
    })
      .then(res => res.json())
      .then(() => {
        fetchTeams();
        setShowCreateModal(false);
        setTeamName('');
        setTeamDescription('');
      })
      .catch(err => console.error('Failed to create team:', err))
      .finally(() => setLoading(false));
  };

  const handleJoinTeam = (teamId) => {
    fetch(`${API_URL}/teams/${teamId}/join`, {
      method: 'POST',
      headers: AuthService.getAuthHeader()
    })
      .then(() => fetchTeams())
      .catch(err => console.error('Failed to join team:', err));
  };

  const myTeams = teams.filter(t => t.isCaptain || t.isMember);
  const availableTeams = teams.filter(t => !t.isCaptain && !t.isMember);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teams</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Create Team
        </button>
      </div>

      {showCreateModal && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Create New Team</h5>
            <form onSubmit={handleCreateTeam}>
              <div className="mb-3">
                <label>Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={teamDescription}
                  onChange={e => setTeamDescription(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                {loading ? 'Creating...' : 'Create Team'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <h4>My Teams</h4>
      <div className="row">
        {myTeams.map(team => (
          <div key={team.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">{team.description}</p>
                <p className="card-text">
                  <small>
                    Captain: {team.captainName} | Members: {team.memberCount}
                  </small>
                </p>
                {team.isCaptain && <span className="badge bg-primary">Captain</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="mt-4">Browse Teams</h4>
      <div className="row">
        {availableTeams.map(team => (
          <div key={team.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">{team.description}</p>
                <p className="card-text">
                  <small>
                    Captain: {team.captainName} | Members: {team.memberCount}
                  </small>
                </p>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleJoinTeam(team.id)}
                >
                  Join Team
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Leaderboard Component
function Leaderboard() {
  const [period, setPeriod] = React.useState('week');
  const [leaderboard, setLeaderboard] = React.useState([]);

  React.useEffect(() => {
    fetch(`${API_URL}/leaderboard?period=${period}`)
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error('Failed to fetch leaderboard:', err));
  }, [period]);

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      <div className="btn-group mb-4" role="group">
        <button
          className={`btn btn-outline-primary ${period === 'week' ? 'active' : ''}`}
          onClick={() => setPeriod('week')}
        >
          This Week
        </button>
        <button
          className={`btn btn-outline-primary ${period === 'month' ? 'active' : ''}`}
          onClick={() => setPeriod('month')}
        >
          This Month
        </button>
        <button
          className={`btn btn-outline-primary ${period === 'all' ? 'active' : ''}`}
          onClick={() => setPeriod('all')}
        >
          All Time
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Total Duration (min)</th>
            <th>Total Calories</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.userId}>
              <td>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && index + 1}
              </td>
              <td>{entry.username}</td>
              <td>{entry.totalDuration}</td>
              <td>{entry.totalCalories || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main App Component
function App() {
  const currentUser = AuthService.getCurrentUser();

  return (
    <Router>
      {currentUser && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Login />} />
        <Route path="/activities" element={currentUser ? <Activities /> : <Login />} />
        <Route path="/teams" element={currentUser ? <Teams /> : <Login />} />
        <Route path="/leaderboard" element={currentUser ? <Leaderboard /> : <Login />} />
        <Route path="/" element={currentUser ? <Dashboard /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
