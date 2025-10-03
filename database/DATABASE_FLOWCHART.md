# Maharashtra WRD Database Architecture Flowchart

## 🏗️ Database Type & Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE TECHNOLOGY STACK                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Primary Database: PostgreSQL 15+                              │
│  ├── Reason: Advanced JSON support, UUID, Complex queries      │
│  ├── ACID Compliance: ✅                                       │
│  ├── Scalability: High                                         │
│  └── Government Grade Security: ✅                             │
│                                                                 │
│  Alternative Options:                                           │
│  ├── MySQL 8.0+ (Good alternative)                            │
│  ├── Microsoft SQL Server (Enterprise)                        │
│  └── SQLite (Development only)                                │
│                                                                 │
│  Supporting Technologies:                                       │
│  ├── Connection Pooling: PgBouncer                            │
│  ├── Caching: Redis                                           │
│  ├── Search: PostgreSQL Full-text Search                      │
│  └── File Storage: AWS S3 / Local File System                │
└─────────────────────────────────────────────────────────────────┘
```

## 🗺️ Database Schema Overview & Relationships

```
                    MAHARASHTRA WRD DATABASE SCHEMA
                           (10 Core Modules)

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER MGMT     │    │   WUA MGMT      │    │  AWARD SYSTEM   │
│                 │    │                 │    │                 │
│ • users         │◄──►│ • wua_orgs      │◄──►│ • applications  │
│ • admin_profiles│    │ • wua_members   │    │ • modules       │
│ • evaluators    │    │                 │    │ • questions     │
└─────────────────┘    └─────────────────┘    │ • responses     │
         │                       │             └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  EVALUATION     │    │   DOCUMENTS     │    │   WORKFLOW      │
│                 │    │                 │    │                 │
│ • assignments   │    │ • categories    │    │ • states        │
│ • scores        │    │ • app_docs      │    │ • history       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│  NOTIFICATIONS  │◄─────────────┘
                        │                 │
                        │ • notifications │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │ CONFIG & AUDIT  │
                        │                 │
                        │ • settings      │
                        │ • award_years   │
                        │ • activity_logs │
                        │ • reports       │
                        └─────────────────┘
```

## 📊 Detailed Table Structure & Relationships

### 1. USER MANAGEMENT MODULE
```
┌──────────────────────────────────────────────────────────────────┐
│                        USER MANAGEMENT                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐     ┌──────────────────┐     ┌──────────────┐   │
│  │    users    │────►│  admin_profiles  │     │  evaluators  │   │
│  ├─────────────┤     ├──────────────────┤     ├──────────────┤   │
│  │ id (PK)     │     │ id (PK)          │     │ id (PK)      │   │
│  │ username    │     │ user_id (FK)     │     │ user_id (FK) │   │
│  │ email       │     │ admin_level      │     │ eval_type    │   │
│  │ password    │     │ department       │     │ specializ.   │   │
│  │ full_name   │     │ designation      │     │ experience   │   │
│  │ mobile      │     │ permissions      │     │ status       │   │
│  │ user_type   │     └──────────────────┘     └──────────────┘   │
│  │ status      │                                                 │
│  │ created_at  │     User Types:                                 │
│  │ updated_at  │     • admin                                     │
│  │ last_login  │     • wua_member                                │
│  └─────────────┘     • evaluator                                │
│                      • super_admin                              │
└──────────────────────────────────────────────────────────────────┘
```

### 2. WUA MANAGEMENT MODULE
```
┌──────────────────────────────────────────────────────────────────┐
│                      WUA MANAGEMENT                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐          ┌─────────────────┐             │
│  │ wua_organizations  │◄────────►│  wua_members    │             │
│  ├────────────────────┤          ├─────────────────┤             │
│  │ id (PK)            │          │ id (PK)         │             │
│  │ name               │          │ wua_id (FK)     │             │
│  │ name_marathi       │          │ user_id (FK)    │             │
│  │ registration_no    │          │ member_name     │             │
│  │ registration_date  │          │ mobile          │             │
│  │ district           │          │ email           │             │
│  │ taluka             │          │ position        │             │
│  │ village            │          │ land_holding    │             │
│  │ address            │          │ status          │             │
│  │ contact_person     │          └─────────────────┘             │
│  │ contact_mobile     │                                          │
│  │ bank_details       │          Member Positions:              │
│  │ total_members      │          • president                    │
│  │ irrigated_area     │          • secretary                    │
│  │ status             │          • treasurer                    │
│  └────────────────────┘          • vice_president               │
│                                  • member                       │
└──────────────────────────────────────────────────────────────────┘
```

### 3. AWARD APPLICATION SYSTEM
```
┌──────────────────────────────────────────────────────────────────┐
│                    AWARD APPLICATION SYSTEM                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │ award_applications│───►│ assessment_modules│───►│ questions   │ │
│  ├──────────────────┤    ├──────────────────┤    ├─────────────┤ │
│  │ id (PK)          │    │ id (PK)          │    │ id (PK)     │ │
│  │ app_number       │    │ module_number    │    │ module_id   │ │
│  │ wua_id (FK)      │    │ module_name      │    │ question_no │ │
│  │ submitted_by     │    │ description      │    │ text        │ │
│  │ award_year       │    │ max_score        │    │ type        │ │
│  │ category         │    │ weightage        │    │ max_score   │ │
│  │ total_score      │    └──────────────────┘    │ options     │ │
│  │ status           │                            │ mandatory   │ │
│  │ submission_date  │    Modules:                └─────────────┘ │
│  │ remarks          │    1. Governance                          │ │
│  └──────────────────┘    2. Water Management                   │ │
│           │               3. Financial Management              │ │
│           ▼               4. Maintenance & Repairs             │ │
│  ┌──────────────────┐    5. Documentation & Data              │ │
│  │app_responses     │                                          │ │
│  ├──────────────────┤    Question Types:                      │ │
│  │ id (PK)          │    • yes_no                             │ │
│  │ application_id   │    • multiple_choice                    │ │
│  │ question_id      │    • numeric                            │ │
│  │ response_text    │    • text                               │ │
│  │ response_numeric │    • file_upload                        │ │
│  │ score_awarded    │                                          │ │
│  │ documents        │                                          │ │
│  └──────────────────┘                                          │ │
└──────────────────────────────────────────────────────────────────┘
```

### 4. EVALUATION SYSTEM
```
┌──────────────────────────────────────────────────────────────────┐
│                      EVALUATION SYSTEM                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐     ┌─────────────────────┐             │
│  │ evaluation_assignments│────►│  evaluation_scores  │             │
│  ├─────────────────────┤     ├─────────────────────┤             │
│  │ id (PK)             │     │ id (PK)             │             │
│  │ application_id (FK) │     │ assignment_id (FK)  │             │
│  │ evaluator_id (FK)   │     │ question_id (FK)    │             │
│  │ assigned_by (FK)    │     │ score_given         │             │
│  │ assigned_date       │     │ max_possible        │             │
│  │ due_date            │     │ comments            │             │
│  │ status              │     │ evidence_reviewed   │             │
│  │ completion_date     │     └─────────────────────┘             │
│  │ total_score         │                                         │
│  │ recommendation      │     Evaluation Flow:                   │
│  └─────────────────────┘     1. Application Submitted           │
│                              2. Admin Assigns Evaluator        │
│  Assignment Status:          3. Evaluator Reviews & Scores     │
│  • assigned                  4. Final Recommendation           │
│  • in_progress               5. Admin Final Decision           │
│  • completed                                                   │
│  • overdue                                                     │
└──────────────────────────────────────────────────────────────────┘
```

### 5. DOCUMENT MANAGEMENT
```
┌──────────────────────────────────────────────────────────────────┐
│                    DOCUMENT MANAGEMENT                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐     ┌─────────────────────┐             │
│  │ document_categories │────►│ application_documents│             │
│  ├─────────────────────┤     ├─────────────────────┤             │
│  │ id (PK)             │     │ id (PK)             │             │
│  │ category_name       │     │ application_id (FK) │             │
│  │ description         │     │ category_id (FK)    │             │
│  │ is_mandatory        │     │ document_name       │             │
│  │ max_file_size       │     │ original_filename   │             │
│  │ allowed_formats     │     │ file_path           │             │
│  └─────────────────────┘     │ file_size           │             │
│                              │ mime_type           │             │
│  Document Categories:        │ uploaded_by (FK)    │             │
│  • Registration Cert        │ is_verified         │             │
│  • Financial Statements     │ verified_by (FK)    │             │
│  • Water Management Plan    │ verification_date   │             │
│  • Infrastructure Photos    └─────────────────────┘             │
│  • Meeting Minutes                                               │
│  • Audit Reports            File Storage Options:              │
│                              • Local File System               │
│                              • AWS S3                          │
│                              • Azure Blob Storage             │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
                            APPLICATION LIFECYCLE FLOW

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    WUA      │    │    USER     │    │ APPLICATION │    │  DOCUMENTS  │
│  Register   │───►│   Login     │───►│   Create    │───►│   Upload    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                               │
                                               ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   FINAL     │    │ EVALUATION  │    │   ADMIN     │    │ SUBMISSION  │
│  DECISION   │◄───│  PROCESS    │◄───│  REVIEW     │◄───│  COMPLETE   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NOTIFICATIONS                                │
│  • Email notifications                                              │
│  • SMS alerts                                                      │
│  • In-app notifications                                            │
│  • Status updates                                                  │
└─────────────────────────────────────────────────────────────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AUDIT & REPORTING                             │
│  • Activity logs                                                   │
│  • Performance metrics                                             │
│  • Statistical reports                                             │
│  • Compliance tracking                                             │
└─────────────────────────────────────────────────────────────────────┘
```

## 🏗️ Database Architecture Layers

```
┌──────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│                                                                  │
│  Next.js Frontend ────► API Routes ────► Business Logic         │
└──────────────────────────────────────────────────────────────────┘
                                    │
┌──────────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                           │
│                                                                  │
│  ORM/Query Builder:                                              │
│  • Prisma (Recommended)                                         │
│  • TypeORM                                                      │
│  • Sequelize                                                    │
└──────────────────────────────────────────────────────────────────┘
                                    │
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │    Redis    │  │ File System │              │
│  │   (Main)    │  │  (Cache)    │  │ (Documents) │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└──────────────────────────────────────────────────────────────────┘
                                    │
┌──────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                             │
│                                                                  │
│  • Docker Containers                                            │
│  • Load Balancers                                               │
│  • Backup Systems                                               │
│  • Monitoring Tools                                             │
└──────────────────────────────────────────────────────────────────┘
```

## 📈 Scalability & Performance Strategy

```
                          PERFORMANCE OPTIMIZATION

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   INDEXING      │    │     CACHING     │    │  PARTITIONING   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Primary Keys  │    │ • Redis Cache   │    │ • By Year       │
│ • Foreign Keys  │    │ • Query Cache   │    │ • By Status     │
│ • Search Fields │    │ • Session Cache │    │ • By District   │
│ • Status Fields │    │ • File Cache    │    │ • Archive Data  │
│ • Date Ranges   │    └─────────────────┘    └─────────────────┘
└─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    MONITORING & ANALYTICS                        │
│                                                                  │
│ • Query Performance Monitoring                                   │
│ • Database Connection Pooling                                    │
│ • Automated Backup & Recovery                                    │
│ • Real-time Health Checks                                        │
│ • Usage Analytics & Reporting                                    │
└──────────────────────────────────────────────────────────────────┘
```

This comprehensive database schema supports:
- ✅ **10 Core Modules** with 25+ interconnected tables
- ✅ **Government-grade security** with audit trails
- ✅ **Scalable architecture** supporting thousands of applications
- ✅ **Multi-language support** (English/Marathi)
- ✅ **Document management** with verification workflow
- ✅ **Role-based access control** for different user types
- ✅ **Complete evaluation system** with scoring mechanisms
- ✅ **Notification system** for real-time updates
- ✅ **Comprehensive reporting** and analytics capabilities