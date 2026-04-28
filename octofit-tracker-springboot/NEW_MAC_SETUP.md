# 🚀 OctoFit Tracker Setup - Spring Boot Version

**Copy and paste these commands on your new Mac to get the app running!**

---

## Step 1: Install Prerequisites

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java 17
brew install openjdk@17

# Add Java to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@17' >> ~/.zshrc
source ~/.zshrc

# Verify Java installation
java -version
# Should show: openjdk version "17.x.x"

# Install Node.js and npm
brew install node

# Verify Node installation
node --version  # Should be v18+ 
npm --version

# Install Docker Desktop
brew install --cask docker

# Open Docker Desktop
open -a Docker

# Wait 30 seconds for Docker to start, then verify
docker --version
docker-compose --version
```

---

## Step 2: Get the Project

```bash
# Navigate to your projects folder
cd ~/Documents  # or wherever you want the project

# Clone from GitHub (replace with your actual repo URL)
git clone <your-github-repo-url> octofit-tracker-springboot
cd octofit-tracker-springboot

# OR if copying files directly from another Mac:
# Just place the octofit-tracker-springboot folder here and cd into it
```

---

## Step 3: Start PostgreSQL Database

```bash
# Make sure you're in the project root
cd octofit-tracker-springboot

# Start PostgreSQL with Docker (runs in background)
docker-compose up -d

# Verify PostgreSQL is running
docker ps
# Should show: octofit-postgres container on port 5432

# Optional: Test database connection
docker exec -it octofit-postgres psql -U octofit_user -d octofit_db
# Type \q to exit if it works
```

---

## Step 4: Start the Backend (Spring Boot)

```bash
# Open a new terminal tab/window
cd octofit-tracker-springboot/backend

# Make Maven wrapper executable (if needed)
chmod +x mvnw

# Build the project (first time - takes 5-10 minutes)
./mvnw clean install

# Run the backend
./mvnw spring-boot:run

# Wait for: "Started OctofitTrackerApplication"
# Backend will be at: http://localhost:8080
```

**Keep this terminal running!**

---

## Step 5: Start the Frontend (React)

```bash
# Open ANOTHER new terminal tab/window
cd octofit-tracker-springboot/frontend

# Install dependencies (first time - takes 2-5 minutes)
npm install

# Start the React app
npm start

# Browser will auto-open to: http://localhost:3000
```

**Keep this terminal running too!**

---

## Step 6: Test the Application

### Create Your First User

1. Browser should open automatically to **http://localhost:3000**
2. Click **"Register"**
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Register"** → Should see "Registration successful!"
5. Click **"Login"** → Enter credentials → Should go to Dashboard

### Test Creating a Team

1. Click **"Teams"** in navigation
2. Click **"Create Team"** button
3. Enter:
   - Team Name: `Team Awesome`
   - Description: `The best team ever!`
4. Click **"Create Team"** → Should appear under "My Teams"

### Test Logging an Activity

1. Click **"Activities"** in navigation
2. Click **"Log Activity"** button
3. Fill in:
   - Activity Type: `Running`
   - Date: Today's date
   - Duration: `30` minutes
   - Distance: `5` km
   - Calories: `300`
4. Click **"Save Activity"** → Should appear in list

### Check Leaderboard

1. Click **"Leaderboard"** in navigation
2. You should see your username with stats!

---

## ✅ Success! Your app is running!

**Access Points:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432

---

## 🛑 How to Stop the App

```bash
# Stop Frontend: Press Ctrl+C in frontend terminal
# Stop Backend: Press Ctrl+C in backend terminal
# Stop Database: Run this command
docker-compose down
```

---

## 🔄 How to Restart (Daily Use)

After the first setup, you only need:

```bash
# Terminal 1: Start Database
cd octofit-tracker-springboot
docker-compose up -d

# Terminal 2: Start Backend
cd octofit-tracker-springboot/backend
./mvnw spring-boot:run

# Terminal 3: Start Frontend
cd octofit-tracker-springboot/frontend
npm start
```

---

## 🆘 Troubleshooting

### Port 8080 already in use
```bash
lsof -ti:8080 | xargs kill -9
```

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database won't connect
```bash
docker-compose down
docker-compose up -d
```

### Maven build fails
```bash
cd backend
./mvnw clean
./mvnw clean install
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Docker not running
```bash
open -a Docker
# Wait 30 seconds, then try docker ps
```

---

## 📚 More Help

- **Detailed Setup**: See `SETUP_GUIDE.md`
- **Django Comparison**: See `MIGRATION_GUIDE.md`
- **Quick Reference**: See `QUICKSTART.md`

---

## 🎉 That's it! Happy coding!

Your OctoFit Tracker is now running with:
- ✅ Spring Boot 3.2 + Java 17 backend
- ✅ PostgreSQL 15 database
- ✅ React 18 frontend
- ✅ JWT authentication
- ✅ Full CRUD operations

Go to http://localhost:3000 and start using it!
