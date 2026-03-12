# Business Requirement Document (BRD)
## CloudFly EdTech — Learning Management System

**Document Version:** 1.0
**Date:** March 2026
**Prepared by:** CloudFly EdTech Team
**Status:** Active Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objectives](#2-business-objectives)
3. [Stakeholders & User Roles](#3-stakeholders--user-roles)
4. [Platform Overview](#4-platform-overview)
5. [Functional Requirements](#5-functional-requirements)
   - 5.1 Authentication & Registration
   - 5.2 Course Management
   - 5.3 Learning Experience
   - 5.4 Live Sessions
   - 5.5 Payments & Enrollment
   - 5.6 Assessments & Quizzes
   - 5.7 Projects & Submissions
   - 5.8 Certificates
   - 5.9 Community Forum
   - 5.10 Cloud-Credits (Gamification)
   - 5.11 Admin Panel
   - 5.12 Instructor Panel
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Data Models & Collections](#7-data-models--collections)
8. [API Reference Summary](#8-api-reference-summary)
9. [Payment Flows](#9-payment-flows)
10. [Access Control Matrix](#10-access-control-matrix)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Development Phases](#12-development-phases)
13. [Glossary](#13-glossary)

---

## 1. Executive Summary

CloudFly EdTech is a full-stack, production-ready Learning Management System (LMS) designed to deliver structured online education through two models:

- **Short Courses** — Self-paced, video-based learning with quizzes and certificates. One-time payment or free access.
- **Long-term Cohort Courses** — Instructor-led programs with live video sessions, project reviews, peer interaction, and mentorship.

The platform targets learners in India and internationally, offering multi-currency payment support (Stripe for global, Razorpay for India), verifiable certificates, AI-assisted note-taking, live WebRTC classrooms, and a gamification system called **Cloud-Credits**.

**Live URL:** https://cloudfly-edtech.vercel.app
**Repository:** https://github.com/developerscloudfly/cloudfly-edtech

---

## 2. Business Objectives

| # | Objective | Description |
|---|-----------|-------------|
| B1 | Deliver quality education | Provide structured, expert-led courses accessible globally |
| B2 | Monetise learning content | Enable instructors to sell courses via Stripe (global) and Razorpay (India) |
| B3 | Increase learner retention | Gamification (Cloud-Credits), live sessions, and community forum increase engagement |
| B4 | Verify learning outcomes | Issue shareable, verifiable certificates upon course completion |
| B5 | Scale operations | Admin panel provides full control over users, courses, and payments |
| B6 | Build community | Forum threads, real-time chat, and mentorship connect learners with instructors |

---

## 3. Stakeholders & User Roles

### 3.1 Roles

| Role | Description | Access Level |
|------|-------------|-------------|
| **Guest** | Unauthenticated visitor browsing the platform | Public pages only |
| **Student** | Registered learner who enrols in and watches courses | Student portal |
| **Instructor** | Subject-matter expert who creates and delivers courses | Instructor portal |
| **Admin** | Platform operator with full management rights | Admin portal + all areas |

### 3.2 Role Assignment

- New registrations default to **Student**
- **Instructors** are created by Admin or registered with instructor role
- **Admin** role can only be assigned through the Admin panel or the initial seed process

---

## 4. Platform Overview

### 4.1 Architecture

```
Browser (Next.js App)
    │
    ├── Vercel (Next.js 16 + API Routes)
    │       ├── Public Pages (landing, courses, auth)
    │       ├── Student Portal  (/dashboard, /learn, /live, /forum …)
    │       ├── Instructor Portal (/instructor/*)
    │       ├── Admin Portal (/admin/*)
    │       └── REST API (/api/*)
    │               ├── MongoDB Atlas (data)
    │               ├── Stripe / Razorpay (payments)
    │               ├── LiveKit Cloud (WebRTC)
    │               ├── YouTube Data API (video embedding + recording upload)
    │               └── Cloudinary (file/image storage)
    │
    └── Railway (Socket.io Real-time Server)
            ├── Mentorship chat
            ├── In-room live chat
            └── Forum reply notifications
```

### 4.2 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn/ui |
| Backend API | Next.js API Routes (serverless), Mongoose, NextAuth.js v5 |
| Database | MongoDB Atlas |
| Real-time | Express + Socket.io (Railway) |
| Auth | NextAuth.js v5 — JWT strategy, Credentials provider |
| Payments | Stripe (global), Razorpay (India) |
| Video | YouTube Data API v3 (private embed + recording upload) |
| Live Classes | LiveKit Cloud (WebRTC) |
| File Storage | Cloudinary |
| Hosting | Vercel (web app), Railway (real-time server) |
| CI/CD | GitHub Actions — type-check + lint on every PR |

---

## 5. Functional Requirements

---

### 5.1 Authentication & Registration

#### FR-AUTH-01 — User Registration
- Users can register with: Full Name, Email, Password
- Password must be at least 6 characters
- Email must be unique across the platform
- Password is hashed using bcrypt (12 salt rounds) before storage
- Default role assigned on registration: `student`

#### FR-AUTH-02 — User Login
- Login using email and password (Credentials provider)
- A JWT session token is issued on successful login (valid for 30 days)
- Failed login returns a clear error message

#### FR-AUTH-03 — Session Management
- Sessions use JWT strategy (stateless, edge-compatible)
- Token contains: user ID, name, email, role, avatar
- Unauthenticated access to protected routes redirects to `/login`
- After login, users are redirected based on their role:
  - Admin → `/admin/dashboard`
  - Instructor → `/instructor/dashboard`
  - Student → `/dashboard`

#### FR-AUTH-04 — Route Protection (Middleware)
- `proxy.ts` middleware guards all protected routes
- Role-based redirect for wrong-role access
- Public routes (landing, courses, login, register) are always accessible

---

### 5.2 Course Management

#### FR-COURSE-01 — Course Types
| Type | Description |
|------|-------------|
| **Short** | Self-paced, one-time payment, video lessons + quizzes |
| **Long (Cohort)** | Instructor-led with live sessions, has start/end dates |

#### FR-COURSE-02 — Course Fields
Each course has:
- Title, URL slug (auto-generated), description
- Type (short / long)
- Level (beginner / intermediate / advanced)
- Price (0 = free)
- Freemium flag: number of free modules for guests
- Tags (searchable keywords)
- Thumbnail image (Cloudinary URL)
- Status: `draft` → `published` → `archived`
- Enrollment count, total duration (minutes)
- Instructor reference

#### FR-COURSE-03 — Course Catalog (`/courses`)
- Displays all `published` courses
- Filter by: type, level, price range, tags
- Sort by: newest, most popular, price
- Cmd+K search overlay (keyboard shortcut)
- Skeleton loading on all async content

#### FR-COURSE-04 — Course Detail Page (`/courses/[slug]`)
- Instructor profile, photo, bio
- Learning outcomes (bullet list)
- Full curriculum accordion (modules and lessons)
- Lock icon on paid lessons beyond free preview
- Enroll / Pay CTA button
- Shows freemium preview badge on free modules

#### FR-COURSE-05 — Course CRUD (Instructor / Admin)
- Instructors create courses via a multi-step wizard
- Admin can view, publish, archive, or force-delete any course
- Creating a course sets status to `draft` by default
- Only `published` courses appear in the public catalog

---

### 5.3 Learning Experience

#### FR-LEARN-01 — Lesson View (`/learn/[courseId]/[lessonId]`)
The lesson page is split into two panes:

**Left Pane — Video Lane:**
- Embeds private YouTube video via YouTube IFrame API
- Playback speed control
- Fullscreen toggle
- "Mark Complete" button (auto-triggers at video end)

**Right Pane — Engagement Lane (3 tabs):**
- **Tab 1 — Live Chat:** Socket.io real-time chat (active during live, static during video)
- **Tab 2 — Auto-Notes:** Timestamped notes auto-generated as student watches; editable; exportable as PDF or plain text
- **Tab 3 — MCQ Quiz:** Unlocks after video completes; required to earn full Cloud-Credits

**Lesson Sidebar:**
- Curriculum tree with all modules and lessons
- Checkmark indicators for completed lessons
- Progress bar per module

#### FR-LEARN-02 — Freemium Gate
- If a student accesses a locked lesson without payment, a modal appears prompting enrollment
- First `freeModuleCount` modules are fully accessible to registered users

#### FR-LEARN-03 — Lesson Completion
- On completing a lesson (watching + optional MCQ pass), the lesson ID is added to `enrollment.completedLessons`
- Progress percentage auto-calculates: `(completedLessons / totalLessons) × 100`
- Cloud-Credits awarded automatically on lesson completion

---

### 5.4 Live Sessions

#### FR-LIVE-01 — Session Scheduling (Instructor)
- Instructor navigates to `/instructor/live`
- Fills in: course, session title, scheduled date and time
- System creates a `liveSession` record with status `scheduled`

#### FR-LIVE-02 — Joining a Live Room
- Instructor clicks "Go Live" → backend generates a LiveKit host token → redirected to `/live/[roomId]`
- Students see the session in their dashboard → click "Join" → backend generates a participant token → join the same room

#### FR-LIVE-03 — In-Room Features
- Video/audio for all participants (WebRTC via LiveKit)
- Screen sharing
- Raise hand button
- In-room real-time chat panel (Socket.io)
- Recording indicator (instructor-triggered)
- Participant grid / speaker view toggle

#### FR-LIVE-04 — Session Recording
- Instructor clicks "End Session"
- LiveKit Egress API exports recording as MP4
- MP4 is uploaded to YouTube as a private video via YouTube Data API
- YouTube video ID stored in `liveSession.recordingYoutubeId`
- Recording becomes available as a replayable lesson video

---

### 5.5 Payments & Enrollment

#### FR-PAY-01 — Payment Gateways

| Gateway | Use Case | Currency |
|---------|----------|----------|
| Stripe | International learners | USD, EUR, GBP, etc. |
| Razorpay | Indian learners | INR |

#### FR-PAY-02 — Short Course Purchase Flow
1. Student clicks "Enroll" on a paid course
2. Backend checks existing enrollment (prevents duplicate purchase)
3. Checkout session created (Stripe or Razorpay based on student preference)
4. Student completes payment on gateway
5. Gateway fires a webhook to the backend
6. Backend verifies webhook signature
7. `Payment` record created (status: `success`)
8. `Enrollment` record created
9. Student redirected to first lesson of the course

#### FR-PAY-03 — Cohort Course Purchase
- Same flow as short course, but enrollment is only available during the cohort open window (set by Admin)
- `cohortStartDate` and `cohortEndDate` control availability

#### FR-PAY-04 — Free Course Enrollment
- No payment step; student clicks "Enroll Free"
- `Enrollment` record created directly with no associated payment

#### FR-PAY-05 — Refunds (Admin)
- Admin can issue a refund from `/admin/payments`
- Backend calls Stripe or Razorpay refund API
- `Payment.status` updated to `refunded`
- Enrollment is not auto-revoked (admin decision)

---

### 5.6 Assessments & Quizzes

#### FR-QUIZ-01 — Quiz Structure
- Each lesson can have one associated quiz
- Quiz contains multiple MCQ questions
- Each question has: question text, 4 options, correct option index
- Passing score threshold: 80% by default (configurable per quiz)

#### FR-QUIZ-02 — Quiz Attempt
- Quiz unlocks after the lesson video is watched
- Student submits answers
- Score calculated server-side
- `QuizAttempt` record created with: answers, score, passed flag
- If passed: Cloud-Credits awarded (+25 credits)
- Student can retry failed quizzes

#### FR-QUIZ-03 — Quiz Results
- Instant feedback: correct/incorrect per question highlighted
- Score displayed with pass/fail status
- Retry button if failed

---

### 5.7 Projects & Submissions

#### FR-PROJECT-01 — Project Submission (`/projects`)
- Available for enrolled students in courses that have projects enabled
- Student fills in: title, description, file attachments
- Files uploaded to Cloudinary (PDF, ZIP, images)
- Submission status: `pending` → `reviewed`

#### FR-PROJECT-02 — Instructor Review (`/instructor/submissions`)
- Instructor sees all pending submissions for their courses
- Clicks to open: views title, description, files (Cloudinary viewer)
- Enters: grade (A / B / C / F) and written feedback
- On review: Cloud-Credits awarded to student (+20 credits)

#### FR-PROJECT-03 — Gradebook (`/instructor/gradebook`)
- Course → student matrix view
- Grade per student per project
- CSV export functionality

---

### 5.8 Certificates

#### FR-CERT-01 — Certificate Issuance
- Automatically triggered when `progressPercent` reaches 100%
- Server generates a `Certificate` record with a unique `shareableToken` (UUID)
- Cloud-Credits awarded (+100 credits)

#### FR-CERT-02 — Certificate Page (`/certificates/[shareableToken]`)
- Publicly accessible (no login required)
- Displays: student name, course name, completion date, CloudFly EdTech branding
- Gold and white certificate design
- "Download PDF" button (rendered via `@react-pdf/renderer`)
- "Share on LinkedIn" button (uses Open Graph meta tags)

#### FR-CERT-03 — Certificate Verification
- Any employer or institution can verify a certificate by visiting the shareable URL
- The URL is permanent and tied to the `shareableToken`

---

### 5.9 Community Forum

#### FR-FORUM-01 — Forum Structure (`/forum`)
- Each course has its own forum thread space
- Students can see forums for all courses they are enrolled in
- Filter posts by course

#### FR-FORUM-02 — Post Creation
- Student creates a post with: title and rich-text content
- Post is scoped to a specific course

#### FR-FORUM-03 — Replies & Notifications
- Any enrolled student or the instructor can reply to a post
- Replies appear in a nested thread view
- Post author receives a real-time notification via Socket.io when a reply is posted

---

### 5.10 Cloud-Credits (Gamification)

Cloud-Credits are the platform's internal point system to reward learning milestones.

#### FR-CREDIT-01 — Earning Credits

| Action | Credits |
|--------|---------|
| Watch a lesson to completion | +10 |
| Pass a quiz (score ≥ 80%) | +25 |
| Submit a project | +15 |
| Project reviewed by instructor | +20 |
| Attend a live session | +30 |
| Complete an entire course | +100 |

#### FR-CREDIT-02 — Credit Wallet
- Displayed in the student sidebar as a badge
- Full history viewable on `/profile`
- Each entry shows: amount, reason, date earned

#### FR-CREDIT-03 — Shareable Profile
- Student profile page shows total Cloud-Credits
- Shareable link for college applications or employer verification
- Credits represent demonstrated engagement and achievement

> **Note:** Credit redemption (discounts, rewards) is planned for Phase C.

---

### 5.11 Admin Panel

All admin pages are under `/admin/*` and require `admin` role.

#### FR-ADMIN-01 — Dashboard (`/admin/dashboard`)
- Live statistics fetched from database:
  - Total registered users
  - Total published courses
  - Total successful payment revenue
  - Total enrollments
- Recent registrations list
- Recent payments list

#### FR-ADMIN-02 — User Management (`/admin/users`)
- Table of all users with: name, email, role, join date
- Search by name or email
- Filter by role (student / instructor / admin)
- Inline role change (dropdown — immediate save)
- Delete user (with confirmation dialog)
- Add User modal: create any user with any role (name, email, password, role)
- Pagination (20 users per page)

#### FR-ADMIN-03 — Course Management (`/admin/courses`)
- Table of all courses (all statuses) with: title, slug, instructor, level, status, price, enrollment count
- Search by title
- Filter by status (draft / published / archived)
- Create Course modal: title, description, level, type, price, tags (slug auto-generated)
- Publish / archive any course
- Pagination (20 courses per page)

#### FR-ADMIN-04 — Payment Management (`/admin/payments`)
- All payment records (Stripe + Razorpay)
- Filter by status, date range, gateway
- Issue refund action

#### FR-ADMIN-05 — Analytics (`/admin/analytics`)
- Enrollment trends over time (chart)
- Revenue over time (chart)
- Most popular courses
- Cloud-Credits issued vs. courses completed ratio

#### FR-ADMIN-06 — Settings (`/admin/settings`)
- Platform information: name, version, environment
- Password change for admin account
- Future: global platform configuration options

---

### 5.12 Instructor Panel

All instructor pages are under `/instructor/*` and require `instructor` or `admin` role.

#### FR-INST-01 — Dashboard (`/instructor/dashboard`)
- Own course statistics: total courses, total enrollments, revenue
- Upcoming scheduled live sessions
- Pending project submissions count

#### FR-INST-02 — Course Builder (`/instructor/courses`)
Multi-step course creation wizard:
1. **Details:** title, description, type, price, level, tags, thumbnail
2. **Curriculum:** drag-and-drop module and lesson builder
3. **Videos:** assign YouTube video IDs to each lesson
4. **Quizzes:** create MCQ quizzes per lesson
5. **Publish:** final review and publish action

#### FR-INST-03 — Live Sessions (`/instructor/live`)
- Schedule a new live session (course, title, date/time)
- "Start Session" → token generated → redirected to `/live/[roomId]`
- View past sessions with recording links
- Recording playback via YouTube private embed

#### FR-INST-04 — Submissions Review (`/instructor/submissions`)
- Table of all project submissions across own courses
- Click to review: view files, enter grade and feedback
- Filter by status (pending / reviewed)

#### FR-INST-05 — Gradebook (`/instructor/gradebook`)
- Matrix view: course → students → grades
- Export as CSV

---

## 6. Non-Functional Requirements

| # | Requirement | Target |
|---|-------------|--------|
| NFR-01 | **Performance** | Lighthouse score ≥ 90 on all public pages |
| NFR-02 | **Availability** | 99.9% uptime via Vercel and Railway |
| NFR-03 | **Security** | HTTPS-only; JWT tokens; bcrypt password hashing; CSRF protection via NextAuth; input validation via Zod |
| NFR-04 | **Scalability** | Serverless API routes scale automatically on Vercel; MongoDB Atlas M10+ cluster |
| NFR-05 | **Responsiveness** | Fully responsive across mobile (≥ 320px), tablet, desktop |
| NFR-06 | **Accessibility** | WCAG 2.1 AA — Shadcn/ui components are accessible by default |
| NFR-07 | **SEO** | Static pages use Next.js metadata API for proper Open Graph + title/description tags |
| NFR-08 | **Error Handling** | All API routes return structured `{ success, data/error }` responses; frontend shows inline error messages |
| NFR-09 | **Loading States** | Skeleton loaders on all async content; no blank screens during data fetch |
| NFR-10 | **Type Safety** | Full TypeScript coverage across frontend and backend |

---

## 7. Data Models & Collections

### `users`
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Unique, lowercase |
| passwordHash | String | bcrypt, not returned in API responses |
| role | Enum | student / instructor / admin |
| avatar | String | Cloudinary URL |
| bio | String | Max 500 chars, instructors |
| isVerified | Boolean | Email verification flag |

### `courses`
| Field | Type | Notes |
|-------|------|-------|
| title | String | Required |
| slug | String | Unique, URL-safe |
| description | String | Required |
| type | Enum | short / long |
| price | Number | 0 = free |
| isFree | Boolean | |
| freeModuleCount | Number | How many modules are free preview |
| instructorId | ObjectId | Ref: users |
| thumbnail | String | Cloudinary URL |
| tags | String[] | Searchable |
| level | Enum | beginner / intermediate / advanced |
| status | Enum | draft / published / archived |
| enrollmentCount | Number | Cached counter |
| totalDuration | Number | Minutes |
| cohortStartDate | Date | Long-term courses only |
| cohortEndDate | Date | Long-term courses only |

### `modules`
| Field | Type | Notes |
|-------|------|-------|
| courseId | ObjectId | Ref: courses |
| title | String | |
| order | Number | Display order |
| isPreview | Boolean | Entire module free? |

### `lessons`
| Field | Type | Notes |
|-------|------|-------|
| moduleId | ObjectId | Ref: modules |
| courseId | ObjectId | Ref: courses |
| title | String | |
| type | Enum | video / quiz / live |
| youtubeVideoId | String | Private YouTube video ID |
| duration | Number | Minutes |
| order | Number | |
| isPreview | Boolean | |
| liveSessionId | ObjectId | Ref: liveSessions (if type=live) |

### `enrollments`
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Ref: users |
| courseId | ObjectId | Ref: courses |
| paymentId | ObjectId | Ref: payments (null for free) |
| completedLessons | ObjectId[] | Ref: lessons |
| progressPercent | Number | 0–100 |
| enrolledAt | Date | |

### `payments`
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | |
| courseId | ObjectId | |
| amount | Number | In smallest currency unit |
| currency | String | INR / USD etc. |
| gateway | Enum | stripe / razorpay |
| gatewayPaymentId | String | Payment ID from gateway |
| status | Enum | pending / success / failed / refunded |

### `quizzes`
| Field | Type | Notes |
|-------|------|-------|
| lessonId | ObjectId | |
| courseId | ObjectId | |
| questions | Array | [{question, options[4], correctIndex}] |
| passingScore | Number | Default: 80 |

### `quizAttempts`
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | |
| quizId | ObjectId | |
| courseId | ObjectId | |
| score | Number | Percentage |
| passed | Boolean | |
| answers | Number[] | Student's selected option indexes |
| attemptedAt | Date | |

### `certificates`
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | |
| courseId | ObjectId | |
| shareableToken | String | UUID, unique public identifier |
| issuedAt | Date | |

### `liveSessions`
| Field | Type | Notes |
|-------|------|-------|
| courseId | ObjectId | |
| instructorId | ObjectId | |
| title | String | |
| livekitRoomName | String | Unique room ID |
| scheduledAt | Date | |
| status | Enum | scheduled / live / ended |
| recordingYoutubeId | String | Filled after session ends |
| duration | Number | Minutes |

### `projectSubmissions`
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | |
| courseId | ObjectId | |
| title | String | |
| description | String | |
| fileUrls | String[] | Cloudinary URLs |
| status | Enum | pending / reviewed |
| grade | String | A / B / C / F |
| instructorFeedback | String | |
| submittedAt | Date | |
| reviewedAt | Date | |

### `cloudCredits`
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Unique per user |
| total | Number | Running total |
| history | Array | [{amount, reason, earnedAt}] |

### `forumPosts`
| Field | Type | Notes |
|-------|------|-------|
| courseId | ObjectId | |
| authorId | ObjectId | |
| title | String | |
| content | String | Rich text |
| replies | Array | [{authorId, content, createdAt}] |

### `chatMessages`
| Field | Type | Notes |
|-------|------|-------|
| fromId | ObjectId | |
| toId | ObjectId | |
| courseId | ObjectId | Context: which course |
| content | String | |
| readAt | Date | |

---

## 8. API Reference Summary

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/[...nextauth]` | NextAuth handler (login, session) |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List published courses (filter, paginate) |
| POST | `/api/courses` | Create course (instructor/admin) |
| GET | `/api/courses/[slug]` | Get course detail |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments/my` | Get student's enrollments |
| POST | `/api/enrollments` | Enrol in a course (post-payment) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/payments/stripe/webhook` | Handle Stripe webhook |
| POST | `/api/payments/razorpay/order` | Create Razorpay order |
| POST | `/api/payments/razorpay/verify` | Verify Razorpay payment signature |

### Learning
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/lessons/[id]/complete` | Mark lesson complete + award credits |
| POST | `/api/quizzes/[id]/attempt` | Submit quiz answers |
| POST | `/api/certificates/generate/[courseId]` | Issue certificate on completion |

### Live Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/livekit/token` | Generate LiveKit room token |
| POST | `/api/livekit/end` | End room + trigger recording upload |

### Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/youtube/embed-token/[videoId]` | Server-side YouTube embed auth |
| POST | `/api/youtube/upload-recording` | Upload session recording to YouTube |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forum/[courseId]/posts` | Get forum posts for a course |
| POST | `/api/forum/[courseId]/posts` | Create a forum post |
| POST | `/api/forum/posts/[id]/reply` | Reply to a forum post |
| GET | `/api/credits/me` | Get student's Cloud-Credits balance |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get student's project submissions |
| POST | `/api/projects` | Submit a project |
| PUT | `/api/projects/[id]/review` | Instructor grades a submission |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform-wide statistics |
| GET | `/api/admin/users` | List users (search, filter, paginate) |
| POST | `/api/admin/users` | Create user with any role |
| PATCH | `/api/admin/users/[id]` | Update user (role, etc.) |
| DELETE | `/api/admin/users/[id]` | Delete user |
| GET | `/api/admin/courses` | List all courses (any status) |
| GET | `/api/admin/payments` | List all payments |
| POST | `/api/admin/payments/[id]/refund` | Issue refund |

---

## 9. Payment Flows

### 9.1 Paid Short Course
```
Student → Course Detail Page → Click "Enroll"
  → POST /api/payments/stripe/checkout  (or razorpay/order)
  → Redirected to Stripe / Razorpay payment page
  → Student completes payment
  → Gateway fires webhook → POST /api/payments/stripe/webhook
  → Backend verifies signature
  → Creates Payment record (status: success)
  → Creates Enrollment record
  → Student redirected to /learn/[courseId]/[firstLessonId]
```

### 9.2 Free Course
```
Student → Course Detail Page → Click "Enroll Free"
  → POST /api/enrollments
  → Enrollment record created (no payment)
  → Student redirected to /learn/[courseId]/[firstLessonId]
```

### 9.3 Freemium Access
```
Guest/Student → Course Detail → Watch free lesson
  → Accesses locked lesson
  → Middleware checks enrollment
  → Not enrolled: shows paywall modal
  → Enrolled: access granted
```

### 9.4 Refund (Admin)
```
Admin → /admin/payments → Find payment → Click Refund
  → POST /api/admin/payments/[id]/refund
  → Backend calls Stripe/Razorpay refund API
  → Payment status updated to "refunded"
```

---

## 10. Access Control Matrix

| Feature / Route | Guest | Student | Instructor | Admin |
|-----------------|-------|---------|------------|-------|
| Landing page `/` | ✓ | ✓ | ✓ | ✓ |
| Course catalog `/courses` | ✓ | ✓ | ✓ | ✓ |
| Course detail `/courses/[slug]` | ✓ | ✓ | ✓ | ✓ |
| Register / Login | ✓ | — | — | — |
| Student dashboard `/dashboard` | — | ✓ | — | ✓ |
| Watch lessons `/learn/*` | — | ✓ (if enrolled) | ✓ | ✓ |
| Join live room `/live/*` | — | ✓ (if enrolled) | ✓ | ✓ |
| Forum `/forum` | — | ✓ | ✓ | ✓ |
| Profile `/profile` | — | ✓ | ✓ | ✓ |
| Projects `/projects` | — | ✓ | — | ✓ |
| Certificates `/certificates/*` | ✓ | ✓ | ✓ | ✓ |
| Instructor dashboard `/instructor/*` | — | — | ✓ | ✓ |
| Course builder | — | — | ✓ | ✓ |
| Admin dashboard `/admin/*` | — | — | — | ✓ |
| User management | — | — | — | ✓ |
| Payment refunds | — | — | — | ✓ |

---

## 11. Deployment Architecture

### Production Environment

| Service | Provider | Purpose |
|---------|----------|---------|
| Web App + API | Vercel | Next.js hosting + serverless API routes |
| Real-time Server | Railway | Socket.io server for chat and notifications |
| Database | MongoDB Atlas | Primary data store |
| Live Video | LiveKit Cloud | WebRTC sessions |
| Video Storage | YouTube (Private) | Course videos + session recordings |
| File Storage | Cloudinary | Thumbnails, project files, avatars |
| CI/CD | GitHub Actions | Type-check + lint on every PR |

### Branch Strategy
| Branch | Purpose | Deployment |
|--------|---------|-----------|
| `master` | Production | Auto-deploys to Vercel production |
| `develop` | Staging | Preview deploys on Vercel |
| `feature/*` | New features | PR into develop |
| `hotfix/*` | Critical fixes | PR into master |

### Environment Variables Required
```
MONGODB_URI            — MongoDB Atlas connection string
AUTH_SECRET            — NextAuth JWT signing secret
NEXTAUTH_URL           — App base URL
NEXT_PUBLIC_APP_URL    — Public base URL
STRIPE_SECRET_KEY      — Stripe secret key
STRIPE_WEBHOOK_SECRET  — Stripe webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RAZORPAY_KEY_ID        — Razorpay key ID
RAZORPAY_KEY_SECRET    — Razorpay secret
NEXT_PUBLIC_RAZORPAY_KEY_ID
LIVEKIT_API_KEY        — LiveKit API key
LIVEKIT_API_SECRET     — LiveKit API secret
NEXT_PUBLIC_LIVEKIT_URL — LiveKit WebSocket URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
YOUTUBE_CLIENT_ID
YOUTUBE_CLIENT_SECRET
YOUTUBE_REFRESH_TOKEN
NEXT_PUBLIC_SOCKET_URL — Railway Socket.io server URL
```

---

## 12. Development Phases

### Phase A — Core LMS (Short Courses) `IN PROGRESS`
- [x] Turborepo monorepo scaffold
- [x] MongoDB models (14 collections)
- [x] NextAuth.js authentication (register, login, JWT, role guards)
- [x] Admin panel (users, courses, payments, analytics, settings)
- [x] GitHub repository setup
- [x] Vercel deployment
- [ ] Course catalog page (connected to DB)
- [ ] Course detail page
- [ ] YouTube private video embed in lesson view
- [ ] Lesson completion trigger + Cloud-Credits award
- [ ] MCQ quiz engine
- [ ] Certificate generation (PDF)
- [ ] Stripe + Razorpay payment integration
- [ ] Freemium access gate
- [ ] Student dashboard

### Phase B — Cohort System (Long-term Courses)
- [ ] LiveKit room creation + token API
- [ ] Custom `/live/[roomId]` meeting UI
- [ ] LiveKit recording → YouTube upload pipeline
- [ ] Project submission portal (Cloudinary)
- [ ] Instructor gradebook and feedback
- [ ] Socket.io real-time mentorship chat
- [ ] Forum with real-time notifications
- [ ] Live schedule in student sidebar

### Phase C — Gamification & Polish
- [ ] Cloud-Credits full history + wallet UI
- [ ] Shareable student profile page
- [ ] Certificate public page with LinkedIn sharing
- [ ] Admin analytics charts (Recharts)
- [ ] Mobile bottom navigation bar
- [ ] Performance audit (Core Web Vitals, Lighthouse ≥ 90)
- [ ] Custom domain setup
- [ ] Credit redemption system

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **Short Course** | A self-paced video course with a one-time payment. No live sessions. |
| **Long-term Course / Cohort** | An instructor-led program with fixed start/end dates, live sessions, and projects. |
| **Cloud-Credits** | The platform's internal points system. Earned by completing lessons, quizzes, live sessions, and projects. |
| **Freemium** | A pricing model where a set number of lessons are free, with payment required for the rest. |
| **freeModuleCount** | The number of modules in a course that are freely accessible without payment. |
| **LiveKit** | The WebRTC infrastructure used for live video sessions. |
| **Slug** | A URL-friendly version of a course title (e.g., "full-stack-web-development"). |
| **JWT** | JSON Web Token — the session token issued to authenticated users. |
| **Webhook** | An HTTP callback from a payment gateway (Stripe/Razorpay) to confirm a successful payment. |
| **Egress** | LiveKit's session recording export feature that produces an MP4 file. |
| **shareableToken** | A unique UUID attached to a certificate, used to create a permanent public URL. |
| **draft** | A course that is created but not yet visible to learners. |
| **published** | A course that is visible in the catalog and can be enrolled in. |
| **archived** | A course that is hidden from the catalog but data is retained. |

---

*Document maintained by CloudFly EdTech. Last updated: March 2026.*
