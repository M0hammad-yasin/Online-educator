## Online Educator Backend API Contract

- Base URL: `/api`
- Version: v1 (implicit)
- Content Type: `application/json` unless noted
- Authentication: JWT via cookie `token` or `Authorization` header

### Authentication

- Token sources:
  - Cookie: `token=<jwt>`
  - Header: `Authorization: Bearer <jwt>` (also accepts raw token in `Authorization`)
- On success, the decoded token is available as `req.user` with at least `role`.
- Error conditions:
  - Missing token → 401 AuthenticationError
  - Invalid token → 401 AuthorizationError

### Roles and Access Control

- Roles: `ADMIN`, `MODERATOR`, `TEACHER`, `STUDENT`
- Middlewares:
  - `auth`: requires a valid token
  - `hasRole(roles: Role | Role[])`: requires user role to be within roles
  - `isAdmin` / `isTeacher` / `isStudent` / `isModerator`: requires exact role
  - `roleBasedController(map: Record<Role, handler>)`: dispatch by role, else 403

### Response Envelope

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { "any": "shape" },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "hasNextPage": true
  }
}
```

Error:
```json
{
  "success": false,
  "message": "You are not authorized to access this route",
  "data": null,
  "error": {
    "type": "authorization_error",
    "message": "You are not authorized to access this route",
    "stack": "included in non-production"
  }
}
```

Error type mapping:
- ValidationError → `validation_error` (400)
- AuthenticationError → `authentication_error` (401)
- AuthorizationError → `authorization_error` (403)
- ConflictError → `conflict_error` (409)
- NotFoundError → `not_found_error` (404)
- BadRequestError → `bad_request_error` (400)
- Other / ServerError → `server_error` (5xx)

### Common Schemas (high-level)

Note: Exact validation resides in `server/src/validation/*.validate.js` (Zod). Shapes below reflect typical usage inferred from routes.

- Pagination query (`paginationSchema`)
  - `page` number ≥ 1 (optional, default 1)
  - `limit` number 1–100 (optional, default 10)
- Mongo ID (`mongoIdSchema`)
  - Params: `id` string (24-char hex)
- Login (`loginSchema`)
  - Body: `email` string (email), `password` string
- Access Control (`accessControlSchema`)
  - Query: `isActive` boolean (optional), `canLogin` boolean (optional), `roles` array of role strings (optional)
- Class Filters (`classFilterQuerySchema`)
  - Query: filters such as `teacherId`, `studentId`, `status`, `from`, `to` (ISO) as defined by schema
- Entity Schemas
  - Admin: `adminSchema`, `adminUpdateSchema`
  - Teacher: `teacherSchema`, `teacherUpdateSchema`
  - Student: `studentSchema`, `studentUpdateSchema`
  - Class: `classSchema`, `updateClassSchema`

### Status Codes

- 200 OK: Successful GET/PUT/PATCH/DELETE
- 201 Created: Successful creation
- 400 Bad Request: Validation error or malformed request
- 401 Unauthorized: Missing/invalid token
- 403 Forbidden: Insufficient role/permissions
- 404 Not Found: Resource/route not found
- 409 Conflict: Resource conflict (e.g., duplicate email)
- 500+ Server Error: Unhandled errors

### Not Found Route

Unknown routes return 404 with message: `Route <originalUrl> not found`.

---

## Admin Routes

Base: `/api/admin`

### POST /admin/register
**Description:** Create an admin account  
**Auth Required:** No  
**Role Required:** None

#### Request Body
```json
{
  "name": "string",
  "email": "string (email)",
  "password": "string",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (201)
```json
{
  "success": true,
  "message": "Admin created",
  "data": { "id": "string", "name": "string", "email": "string", "role": "ADMIN" }
}
```

#### Possible Errors
- 400 validation_error: invalid fields
- 409 conflict_error: email already exists

---

### POST /admin/login
**Description:** Admin login  
**Auth Required:** No  
**Role Required:** None

#### Request Body
```json
{ "email": "string (email)", "password": "string" }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "jwt", "user": { "id": "string", "email": "string", "role": "ADMIN" } }
}
```

#### Possible Errors
- 400 validation_error
- 401 authentication_error

---

### GET /admin/me
**Description:** Get current admin profile  
**Auth Required:** Yes  
**Role Required:** ADMIN

#### Response (200)
```json
{
  "success": true,
  "message": "Admin profile",
  "data": { "id": "string", "name": "string", "email": "string", "role": "ADMIN" }
}
```

#### Errors
- 401 authentication_error
- 403 authorization_error

---

### PATCH /admin/me
**Description:** Update current admin profile (partial)  
**Auth Required:** Yes  
**Role Required:** ADMIN

#### Request Body
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (200)
```json
{ "success": true, "message": "Admin updated", "data": { "id": "string" } }
```

---

### PUT /admin/update
**Description:** Update current admin profile (full)  
**Auth Required:** Yes  
**Role Required:** ADMIN

#### Request Body
```json
{
  "name": "string",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (200)
```json
{ "success": true, "message": "Admin updated", "data": { "id": "string" } }
```

---

### PUT /admin/update-password
**Description:** Change admin password  
**Auth Required:** Yes  
**Role Required:** ADMIN

#### Request Body
```json
{ "currentPassword": "string", "newPassword": "string" }
```

#### Response (200)
```json
{ "success": true, "message": "Password updated", "data": null }
```

#### Errors
- 400 validation_error
- 401 authentication_error
- 403 authorization_error (mismatch current password)

---

### GET /admin/logout
**Description:** Logout admin  
**Auth Required:** Yes  
**Role Required:** ADMIN

#### Response (200)
```json
{ "success": true, "message": "Logged out", "data": null }
```

---

### PUT /admin/verify-email
**Description:** Mark admin email as verified  
**Auth Required:** Yes  
**Role Required:** ADMIN

#### Response (200)
```json
{ "success": true, "message": "Email verified", "data": null }
```

---

## Teacher Routes

Base: `/api/teacher`

### GET /teacher/
**Description:** List teachers (paginated)  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query
```json
{ "page": 1, "limit": 10 }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Teachers",
  "data": [ { "id": "string", "name": "string", "email": "string" } ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### GET /teacher/select
**Description:** Lightweight teacher list for selects  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query
```json
{ "page": 1, "limit": 10 }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Teachers for selection",
  "data": [ { "id": "string", "name": "string" } ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### POST /teacher/class-day-count
**Description:** Aggregate teacher class counts per day  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query (validated on POST)
```json
{ "page": 1, "limit": 10 }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Class day counts",
  "data": [ { "teacherId": "string", "date": "YYYY-MM-DD", "count": 3 } ]
}
```

---

### POST /teacher/register
**Description:** Register a new teacher  
**Auth Required:** No  
**Role Required:** None

#### Request Body
```json
{
  "name": "string",
  "email": "string (email)",
  "password": "string",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (201)
```json
{
  "success": true,
  "message": "Teacher registered",
  "data": { "id": "string", "name": "string", "email": "string" }
}
```

#### Errors
- 400 validation_error
- 409 conflict_error

---

### POST /teacher/login
**Description:** Teacher login  
**Auth Required:** No  
**Role Required:** None

#### Request Body
```json
{ "email": "string (email)", "password": "string" }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "jwt", "user": { "id": "string", "role": "TEACHER" } }
}
```

---

### POST /teacher/logout
**Description:** Logout current teacher  
**Auth Required:** Yes  
**Role Required:** TEACHER

#### Response (200)
```json
{ "success": true, "message": "Logged out", "data": null }
```

---

### GET /teacher/me
**Description:** Get current teacher profile  
**Auth Required:** Yes  
**Role Required:** TEACHER

#### Response (200)
```json
{
  "success": true,
  "message": "Teacher profile",
  "data": { "id": "string", "name": "string", "email": "string", "role": "TEACHER" }
}
```

---

### PUT /teacher/me
**Description:** Update current teacher (full)  
**Auth Required:** Yes  
**Role Required:** TEACHER

#### Query (validated)
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (200)
```json
{ "success": true, "message": "Teacher updated", "data": { "id": "string" } }
```

---

### PATCH /teacher/me
**Description:** Update current teacher (partial)  
**Auth Required:** Yes  
**Role Required:** TEACHER

#### Request Body
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (200)
```json
{ "success": true, "message": "Teacher updated", "data": { "id": "string" } }
```

---

### GET /teacher/classes
**Description:** List teachers with classes  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query
```json
{
  "page": 1,
  "limit": 10,
  "teacherId": "string (optional)",
  "studentId": "string (optional)",
  "status": "string (optional)",
  "from": "ISO date (optional)",
  "to": "ISO date (optional)"
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "Teachers and classes",
  "data": [
    {
      "teacher": { "id": "string", "name": "string" },
      "classes": [ { "id": "string", "title": "string" } ]
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### GET /teacher/class-count
**Description:** Aggregated class counts per teacher  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query
Same as GET `/teacher/classes` with pagination and filters.

#### Response (200)
```json
{
  "success": true,
  "message": "Class counts by teacher",
  "data": [ { "teacherId": "string", "count": 12 } ]
}
```

---

### GET /teacher/class-day-count
**Description:** Daily class counts per teacher  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query
Same as GET `/teacher/classes` with pagination and filters.

#### Response (200)
```json
{
  "success": true,
  "message": "Class day counts",
  "data": [ { "teacherId": "string", "date": "YYYY-MM-DD", "count": 2 } ]
}
```

---

### GET /teacher/:id
**Description:** Get a teacher by ID  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Response (200)
```json
{ "success": true, "message": "Teacher", "data": { "id": "string", "name": "string" } }
```

---

### PUT /teacher/:id/access-control
**Description:** Modify teacher access (admin only)  
**Auth Required:** Yes  
**Role Required:** ADMIN

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Query
```json
{
  "isActive": "boolean (optional)",
  "canLogin": "boolean (optional)",
  "roles": ["ADMIN","MODERATOR","TEACHER","STUDENT"]
}
```

#### Response (200)
```json
{ "success": true, "message": "Access updated", "data": { "id": "string" } }
```

---

### PUT /teacher/:id
**Description:** Update teacher by admin/moderator  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Request Body
Fields per `teacherUpdateSchema` (e.g., `name`, `phone`, `avatar`).

#### Response (200)
```json
{ "success": true, "message": "Teacher updated", "data": { "id": "string" } }
```

---

### DELETE /teacher/:id
**Description:** Delete teacher  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Response (200)
```json
{ "success": true, "message": "Teacher deleted", "data": null }
```

---

## Student Routes

Base: `/api/student`

### GET /student/
**Description:** List students (paginated + filters)  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Query
```json
{
  "page": 1,
  "limit": 10,
  "teacherId": "string (optional)",
  "status": "string (optional)",
  "from": "ISO date (optional)",
  "to": "ISO date (optional)"
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "Students",
  "data": [ { "id": "string", "name": "string", "email": "string" } ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### GET /student/classes
**Description:** List students with classes  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query
Same filters/pagination as above.

#### Response (200)
```json
{
  "success": true,
  "message": "Students and classes",
  "data": [
    {
      "student": { "id": "string", "name": "string" },
      "classes": [ { "id": "string", "title": "string" } ]
    }
  ]
}
```

---

### GET /student/class-count
**Description:** Aggregated class counts per student  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Query
Same filters/pagination as above.

#### Response (200)
```json
{
  "success": true,
  "message": "Class counts by student",
  "data": [ { "studentId": "string", "count": 9 } ]
}
```

---

### POST /student/register
**Description:** Register a new student  
**Auth Required:** No  
**Role Required:** None

#### Request Body
```json
{
  "name": "string",
  "email": "string (email)",
  "password": "string",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (201)
```json
{
  "success": true,
  "message": "Student registered",
  "data": { "id": "string", "name": "string", "email": "string" }
}
```

---

### POST /student/login
**Description:** Student login  
**Auth Required:** No  
**Role Required:** None

#### Request Body
```json
{ "email": "string (email)", "password": "string" }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "jwt", "user": { "id": "string", "role": "STUDENT" } }
}
```

---

### POST /student/logout
**Description:** Logout current student  
**Auth Required:** Yes  
**Role Required:** STUDENT

#### Response (200)
```json
{ "success": true, "message": "Logged out", "data": null }
```

---

### GET /student/me
**Description:** Get current student profile  
**Auth Required:** Yes  
**Role Required:** STUDENT

#### Response (200)
```json
{
  "success": true,
  "message": "Student profile",
  "data": { "id": "string", "name": "string", "email": "string", "role": "STUDENT" }
}
```

---

### PUT /student/me
**Description:** Update current student (full)  
**Auth Required:** Yes  
**Role Required:** STUDENT

#### Query (validated)
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (200)
```json
{ "success": true, "message": "Student updated", "data": { "id": "string" } }
```

---

### PATCH /student/me
**Description:** Update current student (partial)  
**Auth Required:** Yes  
**Role Required:** STUDENT

#### Request Body
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (200)
```json
{ "success": true, "message": "Student updated", "data": { "id": "string" } }
```

---

### GET /student/select
**Description:** Lightweight student list for selects  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Query
```json
{ "page": 1, "limit": 10 }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Students for selection",
  "data": [ { "id": "string", "name": "string" } ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### GET /student/:id
**Description:** Get a student by ID  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Response (200)
```json
{ "success": true, "message": "Student", "data": { "id": "string", "name": "string" } }
```

---

### PUT /student/:id
**Description:** Update student by admin/moderator/teacher  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Query (validated)
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (url, optional)"
}
```

#### Response (200)
```json
{ "success": true, "message": "Student updated", "data": { "id": "string" } }
```

---

### DELETE /student/:id
**Description:** Delete student  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Response (200)
```json
{ "success": true, "message": "Student deleted", "data": null }
```

---

## Class Routes

Base: `/api/class`

### POST /class/create
**Description:** Create a new class  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Request Body
Fields per `classSchema` (e.g., `title`, `description`, `teacherId`, `studentIds`, `startTime`, `endTime`, `status`).

#### Response (201)
```json
{
  "success": true,
  "message": "Class created",
  "data": { "id": "string", "title": "string" }
}
```

#### Errors
- 400 validation_error

---

### GET /class/
**Description:** List classes (role-based data)  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER or STUDENT

#### Query
```json
{
  "page": 1,
  "limit": 10,
  "teacherId": "string (optional)",
  "studentId": "string (optional)",
  "status": "string (optional)",
  "from": "ISO date (optional)",
  "to": "ISO date (optional)"
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "Classes",
  "data": [ { "id": "string", "title": "string" } ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### GET /class/select
**Description:** Classes for quick selection (role-based)  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Query
```json
{ "page": 1, "limit": 10 }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Classes for selection",
  "data": [ { "id": "string", "title": "string" } ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### GET /class/count-by-group
**Description:** Count classes grouped by field (e.g., status/day)  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER or STUDENT

#### Query
Same class filter query.

#### Response (200)
```json
{
  "success": true,
  "message": "Counts by group",
  "data": [ { "group": "string", "count": 5 } ]
}
```

---

### GET /class/group
**Description:** Grouped classes  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER or STUDENT

#### Query
Same class filter query.

#### Response (200)
```json
{
  "success": true,
  "message": "Grouped classes",
  "data": [ { "group": "string", "classes": [ { "id": "string" } ] } ]
}
```

---

### GET /class/calander-view/
**Description:** Calendar-view data for classes  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER or STUDENT

#### Query
Same class filter query.

#### Response (200)
```json
{
  "success": true,
  "message": "Calendar view data",
  "data": [ { "date": "YYYY-MM-DD", "classes": [ { "id": "string" } ] } ]
}
```

---

### GET /class/count
**Description:** Count classes (role-based tally)  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER or STUDENT

#### Query
```json
{ "page": 1, "limit": 10 }
```

#### Response (200)
```json
{
  "success": true,
  "message": "Class count",
  "data": { "count": 123 }
}
```

---

### GET /class/:id
**Description:** Get class by ID  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER or STUDENT

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Response (200)
```json
{ "success": true, "message": "Class", "data": { "id": "string", "title": "string" } }
```

---

### PUT /class/:id
**Description:** Update class  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Request Body
Fields per `updateClassSchema`.

#### Response (200)
```json
{ "success": true, "message": "Class updated", "data": { "id": "string" } }
```

---

### DELETE /class/:id
**Description:** Delete class  
**Auth Required:** Yes  
**Role Required:** ADMIN or MODERATOR or TEACHER

#### Params
```json
{ "id": "string (mongoId)" }
```

#### Response (200)
```json
{ "success": true, "message": "Class deleted", "data": null }
```

---

## Moderator

There are no dedicated moderator routes in the provided routing files. Moderators are authorized across Teacher, Student, and Class endpoints where indicated by `hasRole([Role.MODERATOR, ...])`. If moderator-specific routes are added later (see `server/src/validation/moderator.validate.js` for schemas), follow the same structure as above.

---

## Global Error Examples

### 400 Validation Error
```json
{
  "success": false,
  "message": "fieldName: must be a valid email",
  "data": null,
  "error": { "type": "validation_error", "message": "fieldName: must be a valid email" }
}
```

### 401 Authentication Error (No token)
```json
{
  "success": false,
  "message": "No token provided",
  "data": null,
  "error": { "type": "authentication_error", "message": "No token provided" }
}
```

### 403 Authorization Error
```json
{
  "success": false,
  "message": "You are not authorized to access this route",
  "data": null,
  "error": { "type": "authorization_error", "message": "You are not authorized to access this route" }
}
```

### 404 Not Found (Unknown Route)
```json
{
  "success": false,
  "message": "Route /unknown/path not found",
  "data": null,
  "error": { "type": "not_found_error", "message": "Route /unknown/path not found" }
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error. Please try again later.",
  "data": null,
  "error": { "type": "server_error", "message": "Internal server error. Please try again later." }
}
```


