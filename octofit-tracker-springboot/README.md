# OctoFit Tracker - Spring Boot + PostgreSQL + React

This is the Spring Boot version of OctoFit Tracker with PostgreSQL database and React frontend.

## Prerequisites

- Java 17 or higher
- Node.js 18+ and npm
- Docker Desktop (for PostgreSQL)
- Git

## Project Structure

```
octofit-tracker-springboot/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/octofit/tracker/
│   │   │   │       ├── OctofitTrackerApplication.java
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   ├── pom.xml
│   └── .gitignore
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .gitignore
├── docker-compose.yml          # PostgreSQL setup
└── README.md
```

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd octofit-tracker-springboot
```

### 2. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432 with:
- Database: `octofit_db`
- Username: `octofit_user`
- Password: `octofit_pass`

### 3. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on: http://localhost:8080

### 4. Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team (authenticated)
- `GET /api/teams/{id}` - Get team by ID
- `PUT /api/teams/{id}` - Update team (captain only)
- `DELETE /api/teams/{id}` - Delete team (captain only)
- `POST /api/teams/{id}/join` - Join team
- `POST /api/teams/{id}/leave` - Leave team

### Activities
- `GET /api/activities` - Get user's activities
- `POST /api/activities` - Log new activity
- `GET /api/activities/{id}` - Get activity by ID
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity

### Leaderboard
- `GET /api/leaderboard?period=week` - Get leaderboard (week/month/all)

## Database Schema

### Users Table
- id (Long, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, Encrypted)
- created_at (Timestamp)
- updated_at (Timestamp)

### Teams Table
- id (Long, Primary Key)
- name (String)
- description (String)
- captain_id (Long, Foreign Key -> Users)
- created_at (Timestamp)
- updated_at (Timestamp)

### Team_Members Table (Join Table)
- team_id (Long, Foreign Key -> Teams)
- user_id (Long, Foreign Key -> Users)

### Activities Table
- id (Long, Primary Key)
- user_id (Long, Foreign Key -> Users)
- activity_type (String: running, cycling, swimming, etc.)
- duration (Integer, minutes)
- distance (Double, kilometers)
- calories (Integer)
- notes (String)
- activity_date (Date)
- created_at (Timestamp)

## Environment Variables

Create `.env` file in backend/ directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=octofit_db
DB_USERNAME=octofit_user
DB_PASSWORD=octofit_pass
JWT_SECRET=your-secret-key-here-change-in-production
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
./mvnw clean package
java -jar target/octofit-tracker-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
```

## Troubleshooting

### PostgreSQL Connection Issues

1. Check Docker is running: `docker ps`
2. Check PostgreSQL logs: `docker-compose logs postgres`
3. Verify connection: `docker exec -it octofit-postgres psql -U octofit_user -d octofit_db`

### Backend Won't Start

1. Check Java version: `java -version` (should be 17+)
2. Clean Maven cache: `./mvnw clean`
3. Check PostgreSQL is running
4. Verify application.yml settings

### Frontend Issues

1. Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
2. Check backend is running on port 8080
3. Clear browser cache

## License

MIT License
