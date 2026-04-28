# Migration Guide: Django → Spring Boot

Quick reference for developers familiar with the Django version migrating to Spring Boot.

## Architecture Comparison

| Aspect | Django Version | Spring Boot Version |
|--------|---------------|-------------------|
| **Backend Framework** | Django 4.1 | Spring Boot 3.2 |
| **Language** | Python | Java 17 |
| **Database** | SQLite | PostgreSQL |
| **ORM** | Django ORM | JPA/Hibernate |
| **Authentication** | Session-based | JWT Token-based |
| **API Framework** | Django REST Framework | Spring REST |
| **Frontend** | React (same) | React (same) |

## Key Differences

### 1. Authentication

**Django** (Session-based):
```javascript
// Sends cookies automatically
fetch('http://localhost:8000/api/teams/', {
  credentials: 'include',
  headers: {
    'X-CSRFToken': csrfToken
  }
})
```

**Spring Boot** (JWT-based):
```javascript
// Must include JWT token in header
const user = JSON.parse(localStorage.getItem('user'));
fetch('http://localhost:8080/api/teams', {
  headers: {
    'Authorization': 'Bearer ' + user.token
  }
})
```

### 2. API Endpoints

**Django**:
- `/api/teams/` (trailing slash required)
- `/api/teams/{id}/join/` (action endpoints with trailing slash)

**Spring Boot**:
- `/api/teams` (no trailing slash)
- `/api/teams/{id}/join` (RESTful convention)

### 3. Project Structure

**Django**:
```
backend/
├── octofit_tracker/       # Project settings
│   ├── settings.py
│   ├── urls.py
├── teams/                 # App
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
└── manage.py
```

**Spring Boot**:
```
backend/src/main/java/com/octofit/tracker/
├── OctofitTrackerApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   └── TeamController.java
├── model/
│   └── Team.java
├── repository/
│   └── TeamRepository.java
└── security/
    ├── JwtUtils.java
    └── JwtAuthenticationFilter.java
```

### 4. Database Migrations

**Django**:
```bash
python manage.py makemigrations
python manage.py migrate
```

**Spring Boot**:
```yaml
# application.yml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Auto-creates/updates tables
```

### 5. Running the Application

**Django**:
```bash
python manage.py runserver
```

**Spring Boot**:
```bash
./mvnw spring-boot:run
```

## Data Model Comparison

### Team Model

**Django**:
```python
class Team(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    captain = models.ForeignKey(User, on_delete=models.CASCADE, related_name='captained_teams')
    members = models.ManyToManyField(User, related_name='teams')
    created_at = models.DateTimeField(auto_now_add=True)
```

**Spring Boot**:
```java
@Entity
@Table(name = "teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "captain_id")
    private User captain;
    
    @ManyToMany
    @JoinTable(name = "team_members")
    private Set<User> members;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

## Common Tasks

### Creating a New Endpoint

**Django**:
```python
# views.py
@action(detail=True, methods=['post'])
def join(self, request, pk=None):
    team = self.get_object()
    team.members.add(request.user)
    return Response({'message': 'Joined successfully'})
```

**Spring Boot**:
```java
// TeamController.java
@PostMapping("/{id}/join")
public ResponseEntity<?> joinTeam(@PathVariable Long id) {
    User user = getCurrentUser();
    Team team = teamRepository.findById(id).orElseThrow();
    team.getMembers().add(user);
    teamRepository.save(team);
    return ResponseEntity.ok(new MessageResponse("Joined successfully"));
}
```

### Database Queries

**Django**:
```python
# Get all teams
teams = Team.objects.all()

# Get teams by captain
teams = Team.objects.filter(captain=user)

# Get with related data
teams = Team.objects.select_related('captain').prefetch_related('members')
```

**Spring Boot**:
```java
// Get all teams
List<Team> teams = teamRepository.findAll();

// Get teams by captain
List<Team> teams = teamRepository.findByCaptainId(userId);

// Related data loaded via @ManyToOne(fetch = FetchType.EAGER)
// or @ManyToMany(fetch = FetchType.LAZY)
```

## Configuration Files

### Django `settings.py` → Spring Boot `application.yml`

**Django**:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

**Spring Boot**:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/octofit_db
    username: octofit_user
    password: octofit_pass

cors:
  allowed-origins: http://localhost:3000
```

## Testing

**Django**:
```python
from rest_framework.test import APITestCase

class TeamTests(APITestCase):
    def test_create_team(self):
        response = self.client.post('/api/teams/', {'name': 'Test'})
        self.assertEqual(response.status_code, 201)
```

**Spring Boot**:
```java
@SpringBootTest
@AutoConfigureMockMvc
class TeamControllerTests {
    @Test
    void testCreateTeam() throws Exception {
        mockMvc.perform(post("/api/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Test\"}"))
            .andExpect(status().isOk());
    }
}
```

## Frontend Changes

### Login Flow

**Django** (Session):
```javascript
// Login sets httpOnly cookie automatically
fetch('/api/auth/login/', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ username, password })
});

// Future requests automatically include session cookie
fetch('/api/teams/', { credentials: 'include' });
```

**Spring Boot** (JWT):
```javascript
// Login returns token in response
fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('user', JSON.stringify(data));
});

// Must manually include token in subsequent requests
const user = JSON.parse(localStorage.getItem('user'));
fetch('/api/teams', {
  headers: { 'Authorization': 'Bearer ' + user.token }
});
```

## Advantages of Spring Boot Version

1. **Stateless Authentication**: JWT tokens enable horizontal scaling
2. **Type Safety**: Java's strong typing catches errors at compile time
3. **Production Ready**: Spring Boot includes monitoring, health checks, metrics
4. **Enterprise Features**: Better support for microservices, cloud deployment
5. **PostgreSQL**: More powerful database with better concurrency
6. **IDE Support**: Excellent IDE integration with IntelliJ IDEA

## Advantages of Django Version

1. **Rapid Development**: Python is more concise than Java
2. **Admin Panel**: Built-in admin interface (Spring Boot requires custom solution)
3. **ORM Simplicity**: Django ORM is often easier to learn
4. **Less Boilerplate**: Less code required for basic CRUD operations

## Migration Checklist

When migrating from Django to Spring Boot:

- [ ] Update authentication to use JWT tokens
- [ ] Remove trailing slashes from API endpoints
- [ ] Update API calls to include Authorization header
- [ ] Change CSRF handling (not needed with JWT)
- [ ] Update database connection settings
- [ ] Port Django models to JPA entities
- [ ] Rewrite views as Spring REST controllers
- [ ] Update frontend to use localStorage instead of cookies
- [ ] Test all API endpoints
- [ ] Update deployment configuration

## Side-by-Side Feature Comparison

| Feature | Django | Spring Boot |
|---------|--------|-------------|
| User Registration | ✅ | ✅ |
| User Login | ✅ (Session) | ✅ (JWT) |
| Team Creation | ✅ | ✅ |
| Team Join/Leave | ✅ | ✅ |
| Activity Logging | ✅ | ✅ |
| Leaderboard | ✅ | ✅ |
| Admin Panel | ✅ Built-in | ❌ Not included |
| Database | SQLite | PostgreSQL |
| Horizontal Scaling | ⚠️ Limited | ✅ Excellent |

Both versions provide the same user-facing functionality!

---

**Pro Tip**: You can run both versions simultaneously to compare:
- Django: `http://localhost:8000` + `http://localhost:3000`
- Spring Boot: `http://localhost:8080` + `http://localhost:3001`

Just change the React port in the second frontend instance!
