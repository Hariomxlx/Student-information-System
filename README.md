# USIS System Design & UML Diagrams

This document contains the architecture and design diagrams for the Unified Student Information System (USIS) as requested.

## 1. Entity-Relationship (ER) Diagram
```mermaid
erDiagram
    USER {
        ObjectId _id
        String name
        String email
        String password
        String role
    }
    STUDENT {
        ObjectId mentorId
        String enrollmentId
    }
    MENTOR {
        String department
    }
    ATTENDANCE {
        ObjectId studentId
        Date date
        String subject
        String status
    }
    GRADE {
        ObjectId studentId
        String subject
        Float marks
        String grade
    }
    NOTIFICATION {
        ObjectId userId
        String message
        Boolean isRead
    }

    USER ||--|| STUDENT : "inherits if role=student"
    USER ||--|| MENTOR : "inherits if role=mentor"
    STUDENT ||--o{ ATTENDANCE : "has"
    STUDENT ||--o{ GRADE : "receives"
    USER ||--o{ NOTIFICATION : "receives"
    MENTOR ||--o{ STUDENT : "advises"
```

## 2. Use Case Diagram
```mermaid
flowchart LR
    Student([Student])
    Mentor([Mentor])
    Admin([Admin])

    subgraph USIS [Unified Student Information System]
        UC1(Login / Authentication)
        UC2(View Dashboard & Analytics)
        UC3(Manage Attendance)
        UC4(Manage Grades & Performance)
        UC5(Real-time Chat)
        UC6(Receive Alerts & Notifications)
        UC7(Manage Users & System)
    end

    Student --> UC1
    Student --> UC2
    Student --> UC5
    Student --> UC6

    Mentor --> UC1
    Mentor --> UC3
    Mentor --> UC4
    Mentor --> UC5

    Admin --> UC1
    Admin --> UC7
```

## 3. Data Flow Diagrams (DFD)

### Level 0 (Context Diagram)
```mermaid
flowchart TD
    S[Student] <-->|Profile, Grades, Attendance, Alerts| USIS((USIS System))
    M[Mentor] <-->|Attendance Entry, Marks Entry, Chat| USIS
    A[Admin] <-->|User Management, System Config, Reports| USIS
```

### Level 1
```mermaid
flowchart TD
    S[Student] -->|Credentials| P1((1. Auth))
    P1 -->|JWT Token| S
    
    M[Mentor] -->|Attendance Data| P2((2. Attendance Module))
    P2 -->|Record| DB[(Database)]
    
    DB -->|Status Check| P3((3. Alert Engine))
    P3 -->|Low Attendance Alert| S
    
    M -->|Marks| P4((4. Grade Module))
    P4 --> DB
    
    S <-->|Messages| P5((5. Chat System))
    P5 <-->|Messages| M
```

### Level 2 (Attendance & Alert Sub-process)
```mermaid
flowchart TD
    P2_1((Fetch Roster)) --> |Students| M[Mentor]
    M --> |Submit Status| P2_2((Save Attendance))
    P2_2 --> |Write| DB[(DB)]
    
    DB --> |Read %| P3_1((Calculate Overall %))
    P3_1 --> P3_2{Is % < 75?}
    P3_2 -- Yes --> P3_3((Generate Warning))
    P3_2 -- No --> P3_4((No Action))
    
    P3_3 --> |Save Alert| DB
    P3_3 --> |Emit Event| WS((WebSockets))
    WS --> |Push Notification| S[Student]
```

## 4. UML Class Diagram
```mermaid
classDiagram
    class User {
        +String _id
        +String name
        +String email
        +String password
        +String role
        +login()
        +logout()
    }
    class Student {
        +String enrollmentId
        +String mentorId
        +getAttendance()
        +getGrades()
    }
    class Mentor {
        +String department
        +markAttendance()
        +enterGrades()
    }
    class AlertEngine {
        +checkAttendanceThreshold()
        +checkGradeThreshold()
        +triggerNotification()
    }
    
    User <|-- Student
    User <|-- Mentor
    AlertEngine ..> Student : "monitors"
```

## 5. Sequence Diagram (Authentication & Dashboard)
```mermaid
sequenceDiagram
    participant S as Student
    participant UI as React Frontend
    participant API as Express API
    participant DB as MongoDB
    
    S->>UI: Enter Email & Password
    UI->>API: POST /api/auth/login
    API->>DB: Find User & Verify Password
    DB-->>API: User Data
    API-->>UI: 200 OK + JWT Token
    UI->>UI: Save Token & Redirect
    
    UI->>API: GET /api/student/dashboard (Auth Header)
    API->>DB: Aggregate Attendance & Grades
    DB-->>API: Data Array
    API-->>UI: JSON Payload
    UI-->>S: Render Recharts & Profile
```

## 6. Activity Diagram (Marking Attendance)
```mermaid
stateDiagram-v2
    [*] --> SelectCourse
    SelectCourse --> FetchStudents
    FetchStudents --> MarkPresentAbsent
    MarkPresentAbsent --> Submit
    Submit --> SaveToDatabase
    SaveToDatabase --> TriggerAlertEngine
    
    state TriggerAlertEngine {
        [*] --> CheckPercentage
        CheckPercentage --> LessThan75 : if < 75%
        CheckPercentage --> OK : if >= 75%
        LessThan75 --> CreateNotification
        CreateNotification --> [*]
        OK --> [*]
    }
    
    TriggerAlertEngine --> [*]
```
