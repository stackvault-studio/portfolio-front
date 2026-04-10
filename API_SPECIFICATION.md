# Portfolio Backend API Specification

## Overview
This document outlines the REST API endpoints required for the portfolio frontend application. All endpoints should be implemented in Spring Boot with proper error handling, validation, and security.

## Base URL
```
http://localhost:8081/api
```

## Authentication
- All endpoints are public (no authentication required for portfolio viewing)
- Contact form submissions may require CAPTCHA or rate limiting

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": object|array|null,
  "message": string,
  "timestamp": string
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": object
  },
  "timestamp": string
}
```

---

## 1. Contact API

### POST /api/contact
Submit a contact form message.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "subject": "string (required)",
  "message": "string (required, min 20 chars)",
  "phone": "string (optional)",
  "company": "string (optional)",
  "projectBudget": "string (optional)",
  "projectTimeline": "string (optional)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "submittedAt": "2024-01-01T10:00:00Z"
  },
  "message": "Message sent successfully",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "name": "Name is required",
      "email": "Invalid email format"
    }
  },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## 2. Dashboard API

### GET /api/dashboard
Get dashboard statistics and skills overview.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalProjects": 15,
      "totalClients": 8,
      "totalCertifications": 12,
      "totalTechnologies": 25,
      "yearsExperience": 7
    },
    "skills": [
      {
        "category": "Backend",
        "technologies": [
          {
            "name": "Java",
            "rate": 95
          },
          {
            "name": "Spring Boot",
            "rate": 90
          }
        ]
      }
    ]
  },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## 3. Experience API

### GET /api/experience-timeline
Get all work experiences for timeline display.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company": "Vermeg",
      "position": "Senior Java Developer",
      "startDate": "2022-01-01",
      "endDate": null,
      "description": "Leading backend development...",
      "technologies": ["Java", "Spring Boot", "PostgreSQL"],
      "achievements": ["...", "..."],
      "location": "Tunis, Tunisia",
      "isCurrent": true
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### GET /api/work-experiences/{id}
Get detailed information about a specific work experience.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company": "Vermeg",
    "position": "Senior Java Developer",
    "startDate": "2022-01-01",
    "endDate": null,
    "description": "Detailed description...",
    "responsibilities": ["...", "..."],
    "technologies": ["Java", "Spring Boot"],
    "achievements": ["...", "..."],
    "projects": [
      {
        "name": "E-commerce Platform",
        "description": "...",
        "technologies": ["Java", "Spring Boot"],
        "role": "Lead Developer"
      }
    ],
    "location": "Tunis, Tunisia",
    "isCurrent": true
  },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## 4. Technologies API

### GET /api/technologies
Get all technologies with filtering and sorting options.

**Query Parameters:**
- `category` (optional): Filter by category (Backend, Frontend, Database, etc.)
- `proficiency` (optional): Filter by proficiency (beginner, intermediate, expert)
- `search` (optional): Search in name, category, or tags
- `sort` (optional): Sort by (name, experience, recent, projects) - default: name
- `limit` (optional): Limit results - default: 50
- `offset` (optional): Pagination offset - default: 0

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Java",
      "category": "Backend",
      "proficiency": "expert",
      "yearsOfExperience": 7,
      "projectsCount": 15,
      "recentlyUsed": true,
      "lastUsed": "December 2024",
      "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      "tags": ["Spring Boot", "Microservices", "REST APIs"],
      "recentProjects": ["E-commerce Platform", "Banking System"],
      "frameworks": ["Spring Boot", "Spring Security", "Hibernate"]
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### GET /api/technologies/categories
Get all unique technology categories.

**Response:**
```json
{
  "success": true,
  "data": ["Backend", "Frontend", "Database", "DevOps", "Cloud", "Testing", "Tools"],
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## 5. Education API

### GET /api/education
Get educational background timeline.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution": "University of Tunis",
      "degree": "Master's in Computer Science",
      "field": "Software Engineering",
      "startDate": "2015-09-01",
      "endDate": "2017-06-30",
      "grade": "Excellent",
      "description": "Specialized in enterprise software development...",
      "achievements": ["...", "..."],
      "location": "Tunis, Tunisia"
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## 6. Certifications API

### GET /api/certifications
Get professional certifications with filtering.

**Query Parameters:**
- `category` (optional): Filter by category (Technical, Cloud, etc.)
- `issuer` (optional): Filter by issuer (AWS, Oracle, etc.)
- `status` (optional): Filter by status (active, expired)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "category": "Cloud",
      "issueDate": "2023-03-15",
      "expiryDate": "2026-03-15",
      "credentialId": "AWS-SAA-123456",
      "credentialUrl": "https://aws.amazon.com/verification",
      "description": "Professional-level certification for AWS solutions architecture",
      "skills": ["AWS", "Cloud Architecture", "Scalability"],
      "status": "active"
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### GET /api/certifications/categories
Get all unique certification categories.

**Response:**
```json
{
  "success": true,
  "data": ["Technical", "Cloud", "Database", "DevOps", "Security"],
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## 7. Skills Progression API

### GET /api/skills-progression
Get skills progression data for visualization.

**Response:**
```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "year": 2017,
        "skills": [
          {
            "name": "Java",
            "level": "intermediate",
            "category": "Backend"
          }
        ],
        "education": "Master's Degree",
        "certifications": []
      }
    ],
    "categories": [
      {
        "name": "Backend",
        "skills": ["Java", "Spring Boot", "PostgreSQL"],
        "progression": [
          { "year": 2017, "count": 2 },
          { "year": 2024, "count": 8 }
        ]
      }
    ]
  },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

## Rate Limiting
- Contact form: 5 submissions per hour per IP
- General API endpoints: 100 requests per minute per IP

## CORS Configuration
Allow origins: `http://localhost:3000`, `http://localhost:5173` (Vite dev server)

## Data Validation Rules
- Email: Valid email format
- Name: 2-100 characters, alphanumeric and spaces only
- Subject: 5-200 characters
- Message: 20-2000 characters
- Phone: Valid phone number format (optional)
- Company: 0-100 characters (optional)
- Project fields: 0-500 characters (optional)

## Caching Strategy
- Dashboard data: Cache for 1 hour
- Technologies: Cache for 30 minutes
- Experience/Certifications: Cache for 1 hour
- Education: Cache for 24 hours

## Database Schema Overview
```sql
-- Contact Messages
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(100),
  project_budget VARCHAR(100),
  project_timeline VARCHAR(100),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET
);

-- Technologies
CREATE TABLE technologies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  proficiency VARCHAR(20) NOT NULL,
  years_experience INTEGER NOT NULL,
  projects_count INTEGER DEFAULT 0,
  recently_used BOOLEAN DEFAULT true,
  last_used VARCHAR(50),
  logo_url TEXT,
  tags TEXT[],
  recent_projects TEXT[],
  frameworks TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Experience
CREATE TABLE work_experience (
  id SERIAL PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  technologies TEXT[],
  achievements TEXT[],
  location VARCHAR(100),
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  institution VARCHAR(200) NOT NULL,
  degree VARCHAR(200) NOT NULL,
  field VARCHAR(200),
  start_date DATE NOT NULL,
  end_date DATE,
  grade VARCHAR(50),
  description TEXT,
  achievements TEXT[],
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications
CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  issuer VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(100),
  credential_url TEXT,
  description TEXT,
  skills TEXT[],
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Notes
1. Use Spring Boot 3.x with Spring WebFlux for reactive endpoints
2. Implement proper exception handling with @ControllerAdvice
3. Use Bean Validation for request validation
4. Implement caching with Redis or Caffeine
5. Add comprehensive logging and monitoring
6. Use DTOs for request/response objects
7. Implement proper security headers
8. Add API documentation with OpenAPI/Swagger