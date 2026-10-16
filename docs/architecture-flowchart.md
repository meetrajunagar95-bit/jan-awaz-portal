# 🏛️ Jan Awaz Portal Architecture & Diagrams
### *Sir Bhavsinhji Polytechnic Institute of Technology*

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph ClientLayer["Client Layer (Responsive Devices)"]
        A[Mobile Citizen Browser]
        B[Desktop Citizen Browser]
        C[Admin / Officer Terminal]
    end

    subgraph VercelEdge["Vercel Cloud Platform (Serverless 24x7)"]
        subgraph FrontendPages["Next.js App Router (React 19)"]
            D["Homepage (/)"]
            E["Submit Grievance (/submit)"]
            F["Track Grievance (/track)"]
            G["My Grievances (/my-complaints)"]
            H["Admin Dashboard (/admin/dashboard)"]
            I["Admin Grievance Manager (/admin/complaints)"]
        end

        subgraph APIRoutes["Serverless API Microservices (/api)"]
            J["Auth API: login, register, me, logout"]
            K["Complaints API: GET, POST, PATCH"]
            L["Statistics & Analytics API: /api/stats"]
        end

        subgraph SecurityMiddleware["Security & Validation Layer"]
            M["Zod Schema Validator"]
            N["In-Memory Rate Limiter"]
            O["JWT & bcryptjs Verification"]
            P["XSS & NoSQL Sanitizer"]
        end
    end

    subgraph CloudDatabase["MongoDB Atlas Cloud (AWS Mumbai Region)"]
        Q[("jan_awaz_db")]
        R["Collection: users"]
        S["Collection: complaints (with timeline)"]
        Q --- R
        Q --- S
    end

    ClientLayer --> FrontendPages
    FrontendPages --> SecurityMiddleware
    SecurityMiddleware --> APIRoutes
    APIRoutes -->|Cached Mongoose Connection| CloudDatabase
```

---

## 2. Complaint Lifecycle State Transition Diagram

```mermaid
stateDiagram-v2
    [*] --> Pending: Citizen submits grievance (/submit)
    note right of Pending: Unique ID generated (e.g. JA-2026-0001)\nInitial timeline entry created
    
    Pending --> InProgress: Officer reviews & dispatches field crew
    note right of InProgress: Action remark logged in audit trail
    
    InProgress --> Resolved: Repair work finished on-ground
    note right of Resolved: Verified with closing remarks
    
    Pending --> Rejected: Invalid / Duplicate / Out of Jurisdiction
    InProgress --> Rejected: Non-actionable upon inspection
    
    Resolved --> [*]
    Rejected --> [*]
```

---

## 3. Authentication & JWT Cookie Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Municipal Officer
    participant Browser as Web Browser
    participant API as /api/auth/login
    participant DB as MongoDB Atlas

    Admin->>Browser: Enters email and password
    Browser->>API: POST /api/auth/login
    API->>API: Rate limit check (Max 7/min)
    API->>DB: Query User by email (+password)
    DB-->>API: Return hashed password
    API->>API: bcrypt.compare(plain, hashed)
    alt Passwords Match
        API->>API: Sign JWT with userId, name, role
        API-->>Browser: Set-Cookie: jan_awaz_token (httpOnly, secure)
        Browser->>Admin: Redirect to /admin/dashboard
    else Passwords Do Not Match
        API-->>Browser: 401 Unauthorized
        Browser->>Admin: Show error message
    end
```
