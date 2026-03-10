# Cloudfly EdTech — Production Web App Plan

> Full-stack, production-ready LMS built with Next.js + Node.js + MongoDB (TypeScript throughout).
> Deployed on Vercel (frontend + API) + Railway (real-time server).

---

## 1. Brand Identity

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#F8FAFC` | Page backgrounds |
| `--blue-primary` | `#2563EB` | Buttons, headers, trust elements |
| `--blue-deep` | `#1E3A8A` | Hero text, long-term course badges |
| `--yellow-accent` | `#FBBF24` | CTAs, short-course tags, Cloud-Credits |
| `--yellow-soft` | `#FEF3C7` | Badge backgrounds, highlights |
| `--slate` | `#64748B` | Secondary text, meta info |
| `--ash` | `#E2E8F0` | Borders, dividers |
| `--surface` | `#FFFFFF` | Cards, modals, dashboard panels |

**Typography**
- Headings: `Outfit` (modern, friendly)
- Body: `Inter` (readable, clean)

**Component Style**
- Cards: `border-radius: 24px`, `1px solid #E2E8F0`, no heavy box-shadows
- Skeleton loaders on all async content
- 2D illustrations for empty states; real photography for instructor profiles & course landing pages

---

## 2. Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework — SSR, SSG, API Routes |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Shadcn/ui | Accessible component primitives |
| Zustand | Client-side state management |
| React Query (TanStack) | Server state, caching, mutations |
| React Hook Form + Zod | Form handling and validation |
| Framer Motion | Animations and transitions |
| `cmdk` | Command palette (Cmd+K search) |

### Backend (API — Serverless via Next.js API Routes)
| Tool | Purpose |
|---|---|
| Next.js API Routes | REST API (serverless, Vercel-compatible) |
| TypeScript | Type safety |
| Mongoose | MongoDB ODM |
| MongoDB Atlas | Cloud database |
| NextAuth.js v5 | Authentication (JWT strategy) |
| bcryptjs | Password hashing |
| Zod | Input validation |
| Stripe | Payment gateway (global) |
| Razorpay | Payment gateway (India fallback) |

### Real-time Server (Separate — deployed on Railway)
| Tool | Purpose |
|---|---|
| Node.js + Express + TypeScript | Server framework |
| Socket.io | Real-time mentorship chat, forum notifications |
| LiveKit Node SDK | Token generation for live sessions |
| cors, helmet | Security middleware |

### Infrastructure & Services
| Service | Purpose |
|---|---|
| Vercel | Next.js hosting + serverless API |
| Railway | Real-time Socket.io server |
| MongoDB Atlas | Database (M10 cluster, min.) |
| LiveKit Cloud | WebRTC live sessions + recording |
| YouTube Data API v3 | Private video embedding & recording upload |
| Cloudinary | Thumbnail images, file uploads |
| GitHub | Version control + CI/CD |
| Vercel Analytics | Performance monitoring |

---

## 3. Repository Structure

```
cloudfly-edtech/                    ← GitHub root (monorepo)
├── apps/
│   ├── web/                        ← Next.js app (Vercel)
│   │   ├── app/
│   │   │   ├── (public)/           ← Public pages (no auth)
│   │   │   │   ├── page.tsx        ← Landing page
│   │   │   │   ├── courses/        ← Course catalog + detail pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (student)/          ← Auth-guarded student area
│   │   │   │   ├── dashboard/
│   │   │   │   ├── learn/[courseId]/[lessonId]/
│   │   │   │   ├── live/[roomId]/  ← LiveKit meeting room
│   │   │   │   ├── projects/
│   │   │   │   ├── forum/
│   │   │   │   ├── profile/
│   │   │   │   └── certificates/[id]/
│   │   │   ├── (instructor)/       ← Instructor area
│   │   │   │   ├── instructor/dashboard/
│   │   │   │   ├── instructor/courses/
│   │   │   │   ├── instructor/live/
│   │   │   │   ├── instructor/submissions/
│   │   │   │   └── instructor/gradebook/
│   │   │   ├── (admin)/            ← Admin area
│   │   │   │   ├── admin/dashboard/
│   │   │   │   ├── admin/users/
│   │   │   │   ├── admin/courses/
│   │   │   │   ├── admin/payments/
│   │   │   │   └── admin/analytics/
│   │   │   └── api/                ← Next.js API routes
│   │   │       ├── auth/[...nextauth]/
│   │   │       ├── courses/
│   │   │       ├── enrollments/
│   │   │       ├── payments/
│   │   │       ├── certificates/
│   │   │       ├── projects/
│   │   │       ├── livekit/        ← Token generation endpoint
│   │   │       ├── youtube/        ← Private embed token endpoint
│   │   │       └── admin/
│   │   ├── components/
│   │   │   ├── ui/                 ← Shadcn primitives
│   │   │   ├── layout/             ← Sidebar, Navbar, BottomNav
│   │   │   ├── course/             ← CourseCard, CourseGrid, etc.
│   │   │   ├── learn/              ← VideoPlayer, MCQModal, AutoNotes
│   │   │   ├── live/               ← LiveKit room components
│   │   │   └── shared/             ← SkeletonLoader, CommandPalette, etc.
│   │   ├── lib/
│   │   │   ├── db.ts               ← MongoDB connection
│   │   │   ├── auth.ts             ← NextAuth config
│   │   │   ├── stripe.ts
│   │   │   ├── razorpay.ts
│   │   │   ├── livekit.ts
│   │   │   └── youtube.ts
│   │   ├── models/                 ← Mongoose models
│   │   ├── types/                  ← Shared TypeScript types
│   │   └── hooks/                  ← Custom React hooks
│   └── realtime/                   ← Socket.io server (Railway)
│       ├── src/
│       │   ├── index.ts            ← Express + Socket.io entry
│       │   ├── handlers/
│       │   │   ├── chat.ts         ← Mentorship chat events
│       │   │   └── forum.ts        ← Forum notification events
│       │   └── middleware/
│       │       └── auth.ts         ← Verify JWT from Next.js
│       └── package.json
├── package.json                    ← Turborepo root
├── turbo.json
└── .github/
    └── workflows/
        └── ci.yml                  ← Lint, type-check, test on PR
```

---

## 4. Database Schema (MongoDB + Mongoose)

### `users`
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,          // unique
  passwordHash: string,
  role: 'student' | 'instructor' | 'admin',
  avatar: string,         // Cloudinary URL
  bio: string,            // instructors only
  isVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### `courses`
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,           // unique, URL-friendly
  description: string,
  type: 'short' | 'long', // short = one-time pay | long = cohort
  price: number,          // 0 = free/freemium
  isFree: boolean,
  freeModuleCount: number, // how many modules are free preview
  instructorId: ObjectId,
  thumbnail: string,      // Cloudinary URL
  tags: string[],
  level: 'beginner' | 'intermediate' | 'advanced',
  status: 'draft' | 'published' | 'archived',
  enrollmentCount: number,
  totalDuration: number,  // in minutes
  cohortStartDate: Date,  // long-term only
  cohortEndDate: Date,
  createdAt: Date
}
```

### `modules`
```typescript
{
  _id: ObjectId,
  courseId: ObjectId,
  title: string,
  order: number,
  isPreview: boolean      // entire module free?
}
```

### `lessons`
```typescript
{
  _id: ObjectId,
  moduleId: ObjectId,
  courseId: ObjectId,
  title: string,
  type: 'video' | 'quiz' | 'live',
  youtubeVideoId: string, // private YT video ID
  duration: number,       // minutes
  order: number,
  isPreview: boolean,
  liveSessionId: ObjectId // if type = live
}
```

### `enrollments`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  paymentId: ObjectId,
  completedLessons: ObjectId[],
  progressPercent: number,
  enrolledAt: Date
}
```

### `quizzes`
```typescript
{
  _id: ObjectId,
  lessonId: ObjectId,
  courseId: ObjectId,
  questions: [{
    question: string,
    options: string[],
    correctIndex: number
  }],
  passingScore: number    // default 80
}
```

### `quizAttempts`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  quizId: ObjectId,
  courseId: ObjectId,
  score: number,
  passed: boolean,
  answers: number[],
  attemptedAt: Date
}
```

### `liveSessions`
```typescript
{
  _id: ObjectId,
  courseId: ObjectId,
  instructorId: ObjectId,
  title: string,
  livekitRoomName: string,  // unique room identifier
  scheduledAt: Date,
  status: 'scheduled' | 'live' | 'ended',
  recordingYoutubeId: string, // stored after session ends
  duration: number
}
```

### `projectSubmissions`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  title: string,
  description: string,
  fileUrls: string[],     // Cloudinary URLs
  status: 'pending' | 'reviewed',
  grade: string,          // A/B/C/F
  instructorFeedback: string,
  submittedAt: Date,
  reviewedAt: Date
}
```

### `certificates`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  shareableToken: string, // UUID for public URL
  issuedAt: Date
}
```

### `payments`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  amount: number,
  currency: string,
  gateway: 'stripe' | 'razorpay',
  gatewayPaymentId: string,
  status: 'pending' | 'success' | 'failed' | 'refunded',
  createdAt: Date
}
```

### `cloudCredits` (Points)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  total: number,
  history: [{
    amount: number,
    reason: string,       // "Completed: Lesson X", "Quiz Passed", etc.
    earnedAt: Date
  }]
}
```

### `chatMessages`
```typescript
{
  _id: ObjectId,
  fromId: ObjectId,
  toId: ObjectId,
  courseId: ObjectId,     // context: which course
  content: string,
  readAt: Date,
  createdAt: Date
}
```

### `forumPosts`
```typescript
{
  _id: ObjectId,
  courseId: ObjectId,
  authorId: ObjectId,
  title: string,
  content: string,
  replies: [{
    authorId: ObjectId,
    content: string,
    createdAt: Date
  }],
  createdAt: Date
}
```

---

## 5. Page-by-Page Feature Map

### Public Pages

#### `/` — Landing Page
- Hero with animated headline, primary CTA ("Start Learning Free")
- Feature highlights strip (Live Classes / Certificates / Cloud-Credits)
- Featured courses grid (4 cards: 2 short, 2 long)
- Instructor spotlight (photography)
- Testimonials carousel
- FAQ accordion
- Footer with nav links

#### `/courses` — Course Catalog
- Filter bar: type (Short/Long), level, price range, tags
- Sort: Newest, Popular, Price
- Course cards with:
  - `SHORT` (yellow badge) or `LONG-TERM` (blue badge)
  - Thumbnail (illustration for tech, photo for career)
  - Title, instructor name, duration, enrolled count
  - Price (or "Free" / "Freemium")
- Cmd+K global search overlay (searches courses + forum topics)
- Skeleton loading placeholders

#### `/courses/[slug]` — Course Landing Page
- Instructor photo + bio
- Course overview, what you'll learn (bullets)
- Full curriculum accordion (modules/lessons)
  - First `freeModuleCount` modules unlocked for guests
  - Lock icon on paid content
- Enrollment / Payment CTA button
- Reviews section

---

### Student Area (Fixed Sidebar Layout)

**Sidebar Sections:**
- Top: Avatar, name, progress ring (overall % across enrolled courses)
- Middle: My Courses, Live Schedule, Mentorship Chat, Forum
- Bottom: Cloud-Credits wallet badge, Settings
- Mobile: Collapses to bottom nav bar (5 tabs)

#### `/dashboard` — Student Dashboard
- "Continue Learning" card (last accessed course + progress bar)
- Enrolled courses grid
- Upcoming live sessions timeline
- Recent Cloud-Credits earned
- Notifications panel

#### `/learn/[courseId]/[lessonId]` — Hybrid Classroom
- **Left pane (Video Lane):**
  - YouTube iframe embed (private video via YouTube IFrame API)
  - Controls: playback speed, fullscreen
  - "Mark Complete" button triggers on video end
- **Right pane (Engagement Lane — tabbed):**
  - Tab 1: **Live Chat** (Socket.io — active during live, static during video)
  - Tab 2: **Auto-Notes** (timestamped notes student can edit and download)
  - Tab 3: **MCQ Pop-up** (quiz tied to lesson — unlocks after video)
- Lesson sidebar: curriculum tree with completion checkmarks
- Freemium gate: modal CTA if accessing locked content

#### `/live/[roomId]` — LiveKit Meeting Room
- Full-screen WebRTC room (custom UI over LiveKit React SDK)
- Participants grid / speaker view toggle
- Mic, camera, screen-share, raise-hand controls
- In-room chat panel (Socket.io)
- "Recording in progress" indicator (instructor-triggered)
- On session end: recording auto-uploaded to YouTube as private via YouTube Data API

#### `/projects` — Project Portal
- List of submission-enabled courses student is enrolled in
- Upload form: title, description, file attachments (Cloudinary)
- Submission status: Pending / Reviewed
- View instructor grade + written feedback

#### `/certificates/[shareableToken]` — Certificate Page
- Public shareable page (no auth needed)
- White & Gold certificate design with:
  - Student name, course name, completion date
  - Cloudfly EdTech branding, "Cloud-Credits" earned
- "Download PDF" button
- "Share on LinkedIn" button (Open Graph meta tags)

#### `/profile` — Student Profile
- Avatar upload
- Enrolled courses with completion status
- All earned certificates
- Cloud-Credits total + history table
- Shareable profile link (for college applications)

#### `/forum` — Community Forum
- List of forum posts (all enrolled courses)
- Filter by course
- Post creation (rich text)
- Thread view with nested replies
- Real-time notification on new reply (Socket.io)

---

### Instructor Area

#### `/instructor/dashboard`
- Published courses count, total enrollment, revenue summary
- Upcoming live sessions
- Pending project submissions count

#### `/instructor/courses`
- List of own courses (draft/published/archived)
- "Create New Course" flow:
  - Step 1: Details (title, description, type, price, tags, thumbnail)
  - Step 2: Curriculum builder (drag-and-drop modules/lessons)
  - Step 3: Add YouTube video IDs to lessons
  - Step 4: Create quizzes per lesson
  - Step 5: Publish

#### `/instructor/live`
- Schedule a live session (select course, date/time, title)
- "Start Session" button → generates LiveKit room token → redirects to `/live/[roomId]`
- Past sessions with recording links

#### `/instructor/submissions`
- Table of project submissions for all their courses
- Click to review: view files (Cloudinary viewer), enter grade + feedback

#### `/instructor/gradebook`
- Course → student rows → grade columns
- Export CSV

---

### Admin Area

#### `/admin/dashboard`
- Platform-wide stats: total users, courses, revenue, active sessions
- Recent signups, recent payments

#### `/admin/users`
- User table with filters (role, date, status)
- View/edit user details, suspend/unsuspend accounts

#### `/admin/courses`
- All courses across all instructors
- Approve/reject courses, force archive

#### `/admin/payments`
- All payment records (Stripe + Razorpay)
- Filter by status, date, gateway
- Refund action

#### `/admin/analytics`
- Charts: enrollments over time, revenue over time, popular courses
- Cloud-Credits issued vs. courses completed ratio

---

## 6. API Routes (Next.js)

```
POST   /api/auth/register
POST   /api/auth/[...nextauth]         ← NextAuth handler

GET    /api/courses                    ← list, filter, paginate
POST   /api/courses                    ← instructor creates
GET    /api/courses/:slug              ← public course detail
PUT    /api/courses/:id                ← instructor edits
DELETE /api/courses/:id

GET    /api/enrollments/my             ← student's enrollments
POST   /api/enrollments               ← enroll (after payment)

POST   /api/payments/stripe/checkout  ← create Stripe session
POST   /api/payments/stripe/webhook   ← Stripe webhook handler
POST   /api/payments/razorpay/order   ← create Razorpay order
POST   /api/payments/razorpay/verify  ← verify signature

POST   /api/livekit/token             ← generate LiveKit room token
POST   /api/livekit/end               ← end room, trigger YT upload

GET    /api/youtube/embed-token/:videoId  ← server-side embed auth
POST   /api/youtube/upload-recording   ← upload LiveKit recording as private

POST   /api/lessons/:id/complete       ← mark lesson complete, award credits
POST   /api/quizzes/:id/attempt        ← submit quiz attempt
POST   /api/certificates/generate/:courseId  ← issue certificate on completion

GET    /api/projects/my
POST   /api/projects                   ← submit project
PUT    /api/projects/:id/review        ← instructor grades submission

GET    /api/credits/me                 ← student Cloud-Credits balance
GET    /api/forum/:courseId/posts
POST   /api/forum/:courseId/posts
POST   /api/forum/posts/:id/reply

GET    /api/admin/stats
GET    /api/admin/users
PUT    /api/admin/users/:id
GET    /api/admin/payments
POST   /api/admin/payments/:id/refund
```

---

## 7. Authentication & Authorization

- **Provider:** NextAuth.js v5 with Credentials provider (email + password)
- **Session strategy:** JWT (edge-compatible, no DB session calls on every request)
- **Role guard middleware:** `middleware.ts` at Next.js root checks JWT role and redirects unauthorized access
- **Role matrix:**

| Route prefix | Allowed roles |
|---|---|
| `/dashboard`, `/learn`, `/live`, `/projects`, `/profile`, `/forum` | `student` |
| `/instructor/*` | `instructor` |
| `/admin/*` | `admin` |
| `/courses`, `/` | public (guest OK) |

---

## 8. Payment Flow

### Short-term Course (One-time)
1. Student clicks "Enroll" → backend checks if enrolled
2. Checkout session created (Stripe or Razorpay)
3. Student pays → gateway webhook fires → backend creates `Enrollment` record
4. Student redirected to `/learn/[courseId]/first-lesson`

### Long-term Course (Cohort Fee)
- Same flow, but payment is locked to cohort start window
- Admin sets cohort open/close dates

### Freemium
- Guest/student gets `freeModuleCount` lessons without payment
- Lesson access check on `/learn` route — if locked and no enrollment → show modal

---

## 9. LiveKit Live Session Flow

```
Instructor → /instructor/live → Schedule session
           → Click "Go Live"
           → POST /api/livekit/token (role: host)
           → Redirect to /live/[roomId]

Student → Live Schedule in sidebar → Join button
        → POST /api/livekit/token (role: participant)
        → Redirect to /live/[roomId]

Session ends:
Instructor → Click "End Session"
           → POST /api/livekit/end
           → LiveKit egress API → MP4 exported
           → Upload MP4 to YouTube as private via Data API
           → Store YouTube video ID in liveSession.recordingYoutubeId
           → Students can replay via standard lesson video embed
```

---

## 10. Cloud-Credits (Gamification) Logic

| Action | Credits Earned |
|---|---|
| Watch a lesson to completion | +10 |
| Pass a quiz (≥ 80%) | +25 |
| Submit a project | +15 |
| Project graded by instructor | +20 |
| Complete entire course | +100 |
| Attend a live session | +30 |

- Credits viewable in sidebar wallet badge
- Shareable profile shows total credits (for college application use)
- No redemption system in Phase C (display only for now)

---

## 11. Deployment Architecture

```
GitHub (main branch)
    │
    ├── Vercel (auto-deploy on push to main)
    │       └── Next.js app (frontend + API routes)
    │               ├── connects to MongoDB Atlas
    │               ├── calls LiveKit Cloud API
    │               ├── calls YouTube Data API
    │               └── calls Stripe / Razorpay
    │
    └── Railway (auto-deploy realtime/ folder)
            └── Express + Socket.io server
                    └── validates JWT from Next.js session
```

**Environment Variables (Vercel):**
```
NEXTAUTH_SECRET
NEXTAUTH_URL
MONGODB_URI
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
LIVEKIT_URL
YOUTUBE_CLIENT_ID
YOUTUBE_CLIENT_SECRET
YOUTUBE_REFRESH_TOKEN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_SOCKET_URL    ← Railway realtime server URL
```

---

## 12. GitHub Workflow

**Branch strategy:**
```
main          ← production (auto-deploys to Vercel)
develop       ← staging (preview deploys on Vercel)
feature/*     ← individual features (PR into develop)
hotfix/*      ← critical production fixes (PR into main)
```

**CI Pipeline (`.github/workflows/ci.yml`):**
- On every PR: TypeScript type-check, ESLint, Prettier check
- On merge to main: Vercel production deploy auto-triggers

---

## 13. Development Phases & Milestones

### Phase A — Core LMS (Short Courses)
- [ ] Project scaffold (Turborepo + Next.js + Express apps)
- [ ] MongoDB models + connection
- [ ] NextAuth.js (register, login, JWT, role guard middleware)
- [ ] Course CRUD (instructor creates, admin approves)
- [ ] Course catalog page + course detail page
- [ ] YouTube private video embed in lesson view
- [ ] Lesson completion trigger + Cloud-Credits award
- [ ] MCQ quiz engine + certificate generation (PDF via `@react-pdf/renderer`)
- [ ] Stripe + Razorpay payment integration + webhooks
- [ ] Freemium access gate
- [ ] Student dashboard
- [ ] Skeleton loaders, Cmd+K search

### Phase B — Cohort System (Long-term)
- [ ] LiveKit room creation + token API
- [ ] Custom `/live/[roomId]` meeting UI (LiveKit React SDK)
- [ ] LiveKit recording → YouTube upload pipeline
- [ ] Project submission portal (Cloudinary file upload)
- [ ] Instructor gradebook + feedback interface
- [ ] Socket.io real-time mentorship chat
- [ ] Forum with real-time reply notifications
- [ ] Live schedule in sidebar + calendar view

### Phase C — Gamification & Credits
- [ ] Cloud-Credits full history + wallet UI
- [ ] Shareable student profile page
- [ ] Certificate public page with Open Graph for LinkedIn sharing
- [ ] Admin analytics dashboard (charts via Recharts)
- [ ] Admin user management + payment refunds
- [ ] Mobile bottom navigation bar
- [ ] Performance audit (Core Web Vitals, Lighthouse ≥ 90)
- [ ] Final deployment + domain setup

---

## 14. Key Libraries Summary

```json
{
  "frontend": [
    "next", "react", "typescript", "tailwindcss",
    "@shadcn/ui", "zustand", "@tanstack/react-query",
    "react-hook-form", "zod", "framer-motion",
    "cmdk", "@livekit/components-react", "livekit-client",
    "@react-pdf/renderer", "recharts", "socket.io-client"
  ],
  "backend-api": [
    "mongoose", "next-auth", "bcryptjs", "zod",
    "stripe", "razorpay", "livekit-server-sdk",
    "googleapis", "cloudinary", "uuid"
  ],
  "realtime-server": [
    "express", "socket.io", "cors", "helmet",
    "jsonwebtoken", "typescript", "ts-node"
  ],
  "dev": [
    "turborepo", "eslint", "prettier", "ts-node",
    "@types/node", "@types/react"
  ]
}
```

---

*Plan version: 1.0 — Ready for scaffold and development.*
