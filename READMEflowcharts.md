┌─────────────────────────────────────────────────────────────┐
│                         USER (Browser)                      │
│                     React Frontend UI                       │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ HTTP Requests (JSON)
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Client)                  │
│                                                             │
│ Pages:                                                      │
│  - Login/Register                                           │
│  - Dashboard                                                │
│  - Subjects Page                                            │
│  - Tasks Page                                               │
│  - Timer Page                                               │
│  - Weekly Report Card Page                                  │
│                                                             │
│ Components:                                                 │
│  - Avatar + XP Display                                      │
│  - Task List                                                │
│  - Subject Cards                                            │
│  - Timer Widget                                             │
│  - Weekly Summary Card                                      │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Calls API Endpoints
                ▼
┌─────────────────────────────────────────────────────────────┐
│                   .NET WEB API (Backend)                    │
│                 Controllers / Minimal API                   │
│                                                             │
│ Endpoints:                                                  │
│  - AuthController (Login/Register)                          │
│  - SubjectController (CRUD subjects)                        │
│  - TaskController (CRUD tasks + complete task)              │
│  - TimerController (Start/Stop session)                     │
│  - ReportController (Weekly report card)                    │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Uses
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (Business Logic)           │
│                                                             │
│ Services:                                                   │
│  - AuthService                                              │
│  - SubjectService                                           │
│  - TaskService                                              │
│  - TimerService                                             │
│  - XPService                                                │
│  - WeeklyReportService                                      │
│                                                             │
│ Rules:                                                      │
│  - Completing task → gives XP                               │
│  - XP belongs to subject + avatar                           │
│  - Timer session → adds study time                          │
│  - Weekly report → summarizes sessions + XP                 │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Entity Framework Core
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (SQL Server)                   │
│                                                             │
│ Tables:                                                     │
│  - Users                                                    │
│  - Subjects                                                 │
│  - Tasks                                                    │
│  - StudySessions                                            │
│  - SubjectXP                                                │
│  - AvatarProgress                                           │
│  - WeeklyReports (optional - can be calculated instead)     │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Returns Data
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     API sends JSON back                     │
│                                                             │
│ Example responses:                                          │
│  - Subject list                                              │
│  - Updated XP values                                         │
│  - Task completion result                                    │
│  - Weekly report summary                                     │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                 REACT updates UI with results               │
│                                                             │
│  - Avatar levels up                                         │
│  - XP bar increases                                         │
│  - Weekly card shows progress                               │
│  - Tasks marked completed                                   │
└─────────────────────────────────────────────────────────────┘
