# Quick Start - OctoFit Tracker (Spring Boot)

## First Time Setup (On New Mac)

### 1. Install Prerequisites
```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java 17
brew install openjdk@17
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Install Node.js
brew install node

# Install Docker
brew install --cask docker
open -a Docker
```

### 2. Clone and Setup Project
```bash
# Clone repository
git clone <your-repo-url>
cd octofit-tracker-springboot

# Start PostgreSQL
docker-compose up -d

# Setup Backend
cd backend
./mvnw clean install
./mvnw spring-boot:run

# In new terminal: Setup Frontend
cd frontend
npm install
npm start
```

## Daily Usage (After Initial Setup)

### Start Everything
```bash
# Terminal 1: Start Database
docker-compose up -d

# Terminal 2: Start Backend
cd backend && ./mvnw spring-boot:run

# Terminal 3: Start Frontend
cd frontend && npm start
```

### Stop Everything
```bash
# Stop Frontend: Ctrl+C in terminal
# Stop Backend: Ctrl+C in terminal
# Stop Database: docker-compose down
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432
  - DB: `octofit_db`
  - User: `octofit_user`
  - Pass: `octofit_pass`

## Key Commands

```bash
# Backend
./mvnw clean install          # Build project
./mvnw spring-boot:run        # Run backend
./mvnw test                   # Run tests

# Frontend
npm install                   # Install dependencies
npm start                     # Start dev server
npm run build                 # Build for production
npm test                      # Run tests

# Database
docker-compose up -d          # Start PostgreSQL
docker-compose down           # Stop PostgreSQL
docker-compose logs postgres  # View logs
docker exec -it octofit-postgres psql -U octofit_user -d octofit_db  # Connect
```

## First Login

1. Go to http://localhost:3000
2. Click **Register**
3. Create account (username, email, password)
4. Click **Login**
5. Start using the app!

## Troubleshooting Quick Fixes

```bash
# Port 8080 in use
lsof -ti:8080 | xargs kill -9

# Port 3000 in use
lsof -ti:3000 | xargs kill -9

# Reset database
docker-compose down -v
docker-compose up -d

# Clean backend
cd backend && ./mvnw clean

# Clean frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## Project Structure

```
octofit-tracker-springboot/
├── backend/               # Spring Boot API (Port 8080)
│   ├── src/main/java/    # Java source code
│   ├── pom.xml           # Maven dependencies
│   └── mvnw              # Maven wrapper
├── frontend/             # React app (Port 3000)
│   ├── src/              # React components
│   ├── package.json      # npm dependencies
│   └── public/           # Static files
├── docker-compose.yml    # PostgreSQL setup
├── README.md             # Overview
├── SETUP_GUIDE.md        # Detailed setup instructions
└── MIGRATION_GUIDE.md    # Django → Spring Boot guide
```

## Technology Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Security, JWT, JPA
- **Frontend**: React 18, Bootstrap 5, React Router
- **Database**: PostgreSQL 15 (Docker)
- **Build Tools**: Maven (backend), npm (frontend)

## Next Steps

1. ✅ Follow SETUP_GUIDE.md for detailed setup
2. ✅ Read MIGRATION_GUIDE.md if coming from Django
3. ✅ Test all features
4. ✅ Start building!

---

**Need Help?** See SETUP_GUIDE.md for detailed troubleshooting and configuration options.
