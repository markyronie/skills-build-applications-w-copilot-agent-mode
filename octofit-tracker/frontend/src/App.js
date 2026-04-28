import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Component for Dashboard
function Dashboard() {
  return (
    <div className="container mt-4">
      <h2>Welcome to OctoFit Tracker! 🏃‍♂️</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Today's Activity</h5>
              <h3>0 minutes</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Weekly Total</h5>
              <h3>0 minutes</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Team Rank</h5>
              <h3>-</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="alert alert-info mt-3">
        <h5>Get Started!</h5>
        <p>Log your first activity to start tracking your fitness journey.</p>
      </div>
    </div>
  );
}

// Component for Activities
function Activities() {
  return (
    <div className="container mt-4">
      <h2>Activity Log</h2>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Log New Activity</h5>
          <form>
            <div className="mb-3">
              <label className="form-label">Activity Type</label>
              <select className="form-select">
                <option>Running</option>
                <option>Walking</option>
                <option>Cycling</option>
                <option>Strength Training</option>
                <option>Swimming</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Duration (minutes)</label>
              <input type="number" className="form-control" placeholder="30" />
            </div>
            <div className="mb-3">
              <label className="form-label">Distance (optional, km)</label>
              <input type="number" step="0.1" className="form-control" placeholder="5.0" />
            </div>
            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows="2" placeholder="How did it go?"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Log Activity</button>
          </form>
        </div>
      </div>
      <div className="mt-4">
        <h5>Recent Activities</h5>
        <div className="alert alert-secondary">
          No activities logged yet. Start tracking your workouts!
        </div>
      </div>
    </div>
  );
}

// Component for Teams
function Teams() {
  const [showBrowseModal, setShowBrowseModal] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [teamName, setTeamName] = React.useState('');
  const [teamDescription, setTeamDescription] = React.useState('');
  const [myTeams, setMyTeams] = React.useState([]);
  const [availableTeams, setAvailableTeams] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const API_URL = 'http://localhost:8000/api';

  // Function to get CSRF token from cookies
  const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // Fetch all teams when component mounts
  React.useEffect(() => {
    // First, ensure CSRF token is set
    fetch(`${API_URL}/csrf/`, {
      credentials: 'include',
    }).then(() => {
      // Then fetch teams
      fetchTeams();
    });
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/teams/`, {
        credentials: 'include',  // Include cookies for authentication
      });
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setAvailableTeams(data);
      // Filter teams where current user is member (for now, show all as available)
      setMyTeams(data.filter(team => team.is_captain || team.is_member));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (teamName.trim()) {
      setLoading(true);
      try {
        const csrfToken = getCSRFToken();
        const response = await fetch(`${API_URL}/teams/`, {
          method: 'POST',
          credentials: 'include',  // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,  // Include CSRF token
          },
          body: JSON.stringify({
            name: teamName,
            description: teamDescription,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to create team');
        }

        const newTeam = await response.json();
        alert(`Team "${teamName}" created successfully! 🎉`);
        setTeamName('');
        setTeamDescription('');
        setShowCreateModal(false);
        fetchTeams(); // Refresh the teams list
      } catch (err) {
        alert(`Error: ${err.message}\n\nNote: You need to be logged in to create teams. Please login at http://localhost:8000/admin/ first.`);
        console.error('Error creating team:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleJoinTeam = async (team) => {
    setLoading(true);
    try {
      const csrfToken = getCSRFToken();
      const response = await fetch(`${API_URL}/teams/${team.id}/join/`, {
        method: 'POST',
        credentials: 'include',  // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,  // Include CSRF token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to join team');
      }

      alert(`You joined "${team.name}"! 🎉`);
      setShowBrowseModal(false);
      fetchTeams(); // Refresh the teams list
    } catch (err) {
      alert(`Error: ${err.message}\n\nNote: You need to be logged in to join teams. Please login at http://localhost:8000/admin/ first.`);
      console.error('Error joining team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Teams</h2>
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Join a Team</h5>
              <p>Collaborate with classmates and compete together!</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowBrowseModal(true)}
              >
                Browse Teams
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create a Team</h5>
              <p>Start your own fitness team</p>
              <button 
                className="btn btn-success" 
                onClick={() => setShowCreateModal(true)}
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* My Teams Section */}
      <div className="mt-4">
        <h5>My Teams</h5>
        {loading && <div className="alert alert-info">Loading teams...</div>}
        {error && <div className="alert alert-danger">Error: {error}</div>}
        {!loading && myTeams.length === 0 ? (
          <div className="alert alert-secondary">
            You haven't joined any teams yet.
          </div>
        ) : (
          <div className="row">
            {myTeams.map(team => (
              <div key={team.id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {team.name}
                      <span className="badge bg-primary ms-2">
                        {team.is_captain ? 'Captain' : 'Member'}
                      </span>
                    </h5>
                    <p className="card-text">{team.description}</p>
                    <small className="text-muted">👥 {team.member_count} members</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Browse Teams Modal */}
      {showBrowseModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Browse Available Teams</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowBrowseModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {loading && <div className="alert alert-info">Loading teams...</div>}
                <div className="list-group">
                  {availableTeams.map(team => (
                    <div key={team.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{team.name}</h5>
                          <p className="mb-1">{team.description}</p>
                          <small className="text-muted">👥 {team.member_count} members</small>
                        </div>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleJoinTeam(team)}
                          disabled={loading || team.is_member}
                        >
                          {team.is_member ? 'Joined' : 'Join'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowBrowseModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Team</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateTeam}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Team Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      placeholder="What's your team about?"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="alert alert-info">
                    <small>💡 You will become the team captain and can invite other students to join.</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for Leaderboard
function Leaderboard() {
  return (
    <div className="container mt-4">
      <h2>🏆 Leaderboard</h2>
      <div className="btn-group mt-3 mb-3" role="group">
        <button type="button" className="btn btn-primary">This Week</button>
        <button type="button" className="btn btn-outline-primary">This Month</button>
        <button type="button" className="btn btn-outline-primary">All Time</button>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Top Students</h5>
          <div className="alert alert-info">
            Start logging activities to appear on the leaderboard!
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Total Minutes</th>
                <th>Activities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No data available yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Component for Profile
function Profile() {
  return (
    <div className="container mt-4">
      <h2>My Profile</h2>
      <div className="card mt-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 text-center">
              <div className="bg-secondary rounded-circle mx-auto" 
                   style={{width: '150px', height: '150px', lineHeight: '150px', fontSize: '64px'}}>
                🏃
              </div>
            </div>
            <div className="col-md-9">
              <h4>Student Name</h4>
              <p className="text-muted">Mergington High School</p>
              <hr />
              <div className="row">
                <div className="col-md-4">
                  <strong>Total Activities:</strong> 0
                </div>
                <div className="col-md-4">
                  <strong>Total Minutes:</strong> 0
                </div>
                <div className="col-md-4">
                  <strong>Member Since:</strong> April 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <h5>Achievements</h5>
          <div className="alert alert-secondary">
            Complete activities to earn achievements!
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <strong>🏃 OctoFit Tracker</strong>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Dashboard</Link>
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
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-light text-center text-muted mt-5 py-3">
          <div className="container">
            <p className="mb-0">© 2026 OctoFit Tracker - Mergington High School</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
