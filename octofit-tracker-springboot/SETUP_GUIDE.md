# OctoFit Tracker Setup Guide - Spring Boot + PostgreSQL + React

Complete step-by-step guide for setting up OctoFit Tracker on a new Mac with Spring Boot backend, PostgreSQL database, and React frontend.

## Table of Contents

1. [Prerequisites Installation](#prerequisites-installation)
2. [Project Setup](#project-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites Installation

### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Java 17

```bash
# Install Java 17 (required for Spring Boot 3.x)
brew install openjdk@17

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
java -version
# Should show: openjdk version "17.x.x"
```

### 3. Install Node.js and npm

```bash
# Install Node.js (version 18 or higher)
brew install node

# Verify installation
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
```

### 4. Install Docker Desktop

```bash
# Install Docker
brew install --cask docker

# Open Docker Desktop application
open -a Docker

# Wait for Docker to start, then verify
docker --version
docker-compose --version
```

### 5. Install Git (if not installed)

```bash
brew install git
git --version
```

---

## Project Setup

### 1. Clone the Repository

```bash
# Navigate to your projects directory
cd ~/Documents  # or wherever you keep your projects

# Clone the repository
git clone <your-repository-url>
cd octofit-tracker-springboot

# Verify project structure
ls -la
# Should see: backend/, frontend/, docker-compose.yml, README.md
```

### 2. Project Structure Overview

```
octofit-tracker-springboot/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/octofit/tracker/
│   │   │   └── resources/application.yml
│   ├── pom.xml                # Maven dependencies
│   └── .gitignore
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .gitignore
├── docker-compose.yml          # PostgreSQL setup
└── README.md
```

---

## Database Setup

### 1. Start PostgreSQL with Docker

```bash
# Make sure Docker Desktop is running first!
# Check with: docker ps

# From the project root directory
docker-compose up -d

# Verify PostgreSQL is running
docker ps
# Should show: octofit-postgres container running on port 5432
```

### 2. Verify Database Connection

```bash
# Connect to PostgreSQL
docker exec -it octofit-postgres psql -U octofit_user -d octofit_db

# You should see: octofit_db=#
# Type \q to exit
```

### 3. Database Configuration

The database is automatically configured with:
- **Database Name**: `octofit_db`
- **Username**: `octofit_user`
- **Password**: `octofit_pass`
- **Port**: `5432`
- **Host**: `localhost`

These settings are in `backend/src/main/resources/application.yml`

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Build the Project (First Time)

```bash
# This will download all Maven dependencies
./mvnw clean install

# If you get permission denied:
chmod +x mvnw
./mvnw clean install
```

**Note**: First build will take 5-10 minutes as it downloads all dependencies.

### 3. Configure Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```bash
# Create .env file
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=octofit_db
DB_USERNAME=octofit_user
DB_PASSWORD=octofit_pass
JWT_SECRET=your-very-secure-secret-key-change-this-in-production-minimum-256-bits
EOF
```

### 4. Run the Backend

```bash
# From the backend/ directory
./mvnw spring-boot:run
```

**Expected Output**:
```
Started OctofitTrackerApplication in X.XXX seconds
```

The backend will be running on **http://localhost:8080**

### 5. Verify Backend is Running

Open a new terminal and run:

```bash
curl http://localhost:8080/api/teams
# Should return: []
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
# Open a new terminal (keep backend running)
cd octofit-tracker-springboot/frontend
```

### 2. Install Dependencies

```bash
npm install
```

**Note**: This will take 2-5 minutes.

### 3. Run the Frontend

```bash
npm start
```

**Expected Output**:
```
Compiled successfully!
You can now view octofit-tracker-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The frontend will automatically open in your browser at **http://localhost:3000**

---

## Running the Application

### Quick Start (After Initial Setup)

You need **3 terminal windows**:

#### Terminal 1: PostgreSQL (if not running)
```bash
cd octofit-tracker-springboot
docker-compose up -d
```

#### Terminal 2: Backend
```bash
cd octofit-tracker-springboot/backend
./mvnw spring-boot:run
```

#### Terminal 3: Frontend
```bash
cd octofit-tracker-springboot/frontend
npm start
```

### Stopping the Application

```bash
# Stop frontend: Press Ctrl+C in frontend terminal

# Stop backend: Press Ctrl+C in backend terminal

# Stop PostgreSQL:
docker-compose down
```

---

## Testing the Application

### 1. Create a User Account

1. Open http://localhost:3000
2. Click **"Register"**
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Register"**
5. You should see: "Registration successful! Please login."

### 2. Login

1. Click **"Login"**
2. Enter:
   - Username: `testuser`
   - Password: `password123`
3. You should be redirected to the Dashboard

### 3. Test Creating a Team

1. Click **"Teams"** in navigation
2. Click **"Create Team"**
3. Fill in:
   - Team Name: `Team Awesome`
   - Description: `The best fitness team!`
4. Click **"Create Team"**
5. Team should appear in **"My Teams"** section

### 4. Test Logging an Activity

1. Click **"Activities"** in navigation
2. Click **"Log Activity"**
3. Fill in:
   - Activity Type: `Running`
   - Date: Today's date
   - Duration: `30` minutes
   - Distance: `5` km
   - Calories: `300`
4. Click **"Save Activity"**
5. Activity should appear in the list

### 5. Test Leaderboard

1. Click **"Leaderboard"** in navigation
2. You should see your username with your activity stats
3. Try toggling between "This Week", "This Month", and "All Time"

---

## API Endpoints Reference

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login (returns JWT token)
- **GET** `/api/auth/me` - Get current user info

### Teams
- **GET** `/api/teams` - Get all teams
- **POST** `/api/teams` - Create team (requires auth)
- **GET** `/api/teams/{id}` - Get team details
- **POST** `/api/teams/{id}/join` - Join team
- **POST** `/api/teams/{id}/leave` - Leave team
- **DELETE** `/api/teams/{id}` - Delete team (captain only)

### Activities
- **GET** `/api/activities` - Get my activities
- **POST** `/api/activities` - Log activity
- **GET** `/api/activities/{id}` - Get activity details
- **PUT** `/api/activities/{id}` - Update activity
- **DELETE** `/api/activities/{id}` - Delete activity

### Leaderboard
- **GET** `/api/leaderboard?period=week` - Get leaderboard
  - Parameters: `period` (week, month, all)

---

## Troubleshooting

### Backend won't start

**Problem**: `Port 8080 already in use`

```bash
# Find process using port 8080
lsof -ti:8080

# Kill the process
kill -9 $(lsof -ti:8080)

# Then restart backend
./mvnw spring-boot:run
```

**Problem**: `Could not connect to database`

```bash
# Check if PostgreSQL container is running
docker ps

# If not running, start it
docker-compose up -d

# Check logs
docker-compose logs postgres
```

**Problem**: `JAVA_HOME not set`

```bash
# Set JAVA_HOME in ~/.zshrc
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@17' >> ~/.zshrc
source ~/.zshrc

# Verify
echo $JAVA_HOME
```

### Frontend won't start

**Problem**: `Port 3000 already in use`

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
npm start
```

**Problem**: `Module not found` errors

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

**Problem**: `Cannot connect to backend`

- Verify backend is running on port 8080
- Check browser console for errors
- Check CORS settings in `backend/src/main/resources/application.yml`

### Database Issues

**Problem**: Can't connect to PostgreSQL

```bash
# Check if Docker is running
docker ps

# Restart PostgreSQL container
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

**Problem**: Database data is lost

```bash
# Check if volume exists
docker volume ls | grep octofit

# Database data persists in Docker volume: octofit-tracker-springboot_postgres_data
```

**Problem**: Need to reset database

```bash
# Stop and remove containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Backend will recreate tables on next startup
```

### JWT Token Issues

**Problem**: "Not authenticated" errors

- Check if you're logged in
- Check browser localStorage for 'user' key
- Check if token is included in requests (Authorization header)
- Token expires after 24 hours - login again

### Build Issues

**Problem**: Maven build fails

```bash
# Clean Maven cache
./mvnw clean

# Try build again
./mvnw clean install

# If still failing, update Maven wrapper
./mvnw -N wrapper:wrapper
```

---

## Development Tips

### Hot Reload

- **Backend**: Spring Boot DevTools is included - code changes will auto-reload
- **Frontend**: React auto-reloads on file save

### Database Management

View data in PostgreSQL:

```bash
# Connect to database
docker exec -it octofit-postgres psql -U octofit_user -d octofit_db

# Useful commands:
\dt                    # List tables
\d users               # Describe users table
SELECT * FROM users;   # View all users
SELECT * FROM teams;   # View all teams
\q                     # Quit
```

### Viewing Logs

```bash
# Backend logs: Visible in terminal running ./mvnw spring-boot:run

# Frontend logs: Check browser console (F12)

# PostgreSQL logs:
docker-compose logs -f postgres
```

### IDE Setup (Optional)

**IntelliJ IDEA** (Recommended for Java):
1. File → Open → Select `backend/pom.xml`
2. Import as Maven project
3. Set SDK to Java 17
4. Run `OctofitTrackerApplication.java`

**VS Code**:
1. Install extensions:
   - Java Extension Pack
   - Spring Boot Extension Pack
   - ESLint (for frontend)
2. Open project root folder
3. Backend will auto-configure

---

## Production Deployment (Future)

For production deployment, you'll need to:

1. **Backend**:
   - Build JAR: `./mvnw clean package`
   - Configure production database
   - Set strong JWT secret
   - Use environment variables for sensitive data

2. **Frontend**:
   - Build: `npm run build`
   - Serve static files from `build/` directory
   - Update API_URL to production backend

3. **Database**:
   - Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
   - Set up backups
   - Use SSL connections

---

## Next Steps

Now that your application is running:

1. ✅ Create user accounts
2. ✅ Test all features
3. 📝 Customize the application
4. 🎨 Add your own styling
5. 🚀 Deploy to production

---

## Support

If you encounter issues not covered in this guide:

1. Check the logs (backend terminal, browser console, PostgreSQL logs)
2. Verify all services are running (`docker ps`, backend terminal, frontend terminal)
3. Check port conflicts (8080, 3000, 5432)
4. Review database connection settings
5. Ensure Java 17 and Node.js 18+ are installed

---

## Summary

**Ports Used**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

**Default Credentials**:
- Database: `octofit_user` / `octofit_pass`
- Application: Create your own user via /register

**Key Technologies**:
- Backend: Spring Boot 3.2, Spring Security, JWT, JPA, PostgreSQL
- Frontend: React 18, React Router, Bootstrap 5
- Database: PostgreSQL 15
- Containerization: Docker

Enjoy building with OctoFit Tracker! 🎉
