# 🏃‍♂️ TrackVerse: Complete Development Plan

## World-Class Track & Field Social Platform for Teen Athletes

---

## 🎯 Vision Statement

**TrackVerse** is the definitive platform where track athletes track progress, compete through rankings, connect with their community, and access world-class training tools—all for free. We're building the app every track athlete checks daily.

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technical Architecture](#technical-architecture)
3. [Database Schema](#database-schema)
4. [Epic Breakdown](#epic-breakdown)
5. [UI/UX Design System](#uiux-design-system)
6. [Success Metrics](#success-metrics)
7. [Launch Strategy](#launch-strategy)
8. [Monetization](#monetization)

---

## 📊 Executive Summary

### The Problem
- Teen track athletes lack a dedicated platform to track progress
- Rankings are scattered across multiple websites
- No social community specifically for track athletes
- Training tools are expensive or non-existent
- Recruiting is fragmented and confusing

### The Solution
TrackVerse provides:
- **Rankings Engine**: Know where you stand instantly
- **Training Hub**: Log workouts, analyze videos, track progress
- **Social Feed**: Connect with teammates and rivals
- **Recruiting Platform**: Get discovered by college scouts
- **Coach Tools**: Manage teams effectively

### Target Users
| User Type | Description | Primary Need |
|-----------|-------------|--------------|
| **Athletes** | High school track athletes (14-18) | Track PRs, see rankings, connect |
| **Coaches** | HS/Club coaches | Manage team, assign workouts |
| **Scouts** | College recruiters | Find and evaluate talent |

---

## 🏗️ Technical Architecture

### Core Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│  Mobile: React Native + Expo                                │
│  Web: Next.js 14 + React 18 + TypeScript                    │
│  UI: Tailwind CSS + shadcn/ui + Framer Motion               │
│  State: Zustand + React Query (TanStack Query)              │
│  Forms: React Hook Form + Zod                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│  Runtime: Node.js + Express / Next.js API Routes            │
│  ORM: Prisma                                                │
│  Auth: Supabase Auth / NextAuth.js                          │
│  Real-time: Socket.io                                       │
│  Background Jobs: Bull + Redis                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Primary DB: PostgreSQL (Supabase)                          │
│  Cache: Redis (Upstash)                                     │
│  Media: Cloudflare R2 / AWS S3                              │
│  Search: Meilisearch (later: Elasticsearch)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                          │
├─────────────────────────────────────────────────────────────┤
│  Web Hosting: Vercel                                        │
│  Backend: AWS Lambda / Railway                              │
│  CDN: Cloudflare                                            │
│  Monitoring: Sentry + Mixpanel                              │
│  CI/CD: GitHub Actions                                      │
└─────────────────────────────────────────────────────────────┘
```

### Why This Stack?

| Technology | Reason |
|------------|--------|
| **Next.js 14** | App Router, Server Components, SEO-friendly recruiting profiles |
| **React Native + Expo** | Single codebase for iOS/Android, fast iteration |
| **PostgreSQL** | Complex relational data (rankings, meets, teams), ACID compliance |
| **Redis** | Fast leaderboard queries, caching frequently accessed rankings |
| **Supabase** | Instant auth, real-time subscriptions, hosted Postgres |
| **Cloudflare R2** | S3-compatible, cheaper bandwidth for video storage |
| **Socket.io** | Real-time rank updates during meets, live feed |
| **Prisma** | Type-safe database queries, easy migrations |
| **shadcn/ui** | Beautiful, accessible components, fully customizable |
| **Framer Motion** | Smooth animations that feel native |

### Key Libraries

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "typescript": "5.x",
    "@tanstack/react-query": "5.x",
    "zustand": "4.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "@supabase/supabase-js": "2.x",
    "prisma": "5.x",
    "@prisma/client": "5.x",
    "tailwindcss": "3.x",
    "framer-motion": "10.x",
    "lucide-react": "latest",
    "recharts": "2.x",
    "date-fns": "2.x",
    "socket.io-client": "4.x",
    "react-hot-toast": "2.x",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "latest",
    "clsx": "2.x",
    "tailwind-merge": "2.x"
  }
}
```

---

## 📊 Database Schema

### Core Tables

```sql
-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('athlete', 'coach', 'scout', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  height_inches INTEGER,
  weight_lbs INTEGER,
  grad_year INTEGER,
  school_id UUID REFERENCES schools(id),
  
  -- Rankings
  rank_tier VARCHAR(20) DEFAULT 'rookie',
  rank_points INTEGER DEFAULT 0,
  
  -- Verification
  verification_level VARCHAR(20) DEFAULT 'unverified',
  
  -- Stats (denormalized for performance)
  total_prs INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  -- Badges (JSON array)
  badges JSONB DEFAULT '[]',
  
  -- Settings
  profile_visibility VARCHAR(20) DEFAULT 'public',
  recruiting_status VARCHAR(20) DEFAULT 'open',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE coach_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  school_id UUID REFERENCES schools(id),
  title VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  organization VARCHAR(200),
  title VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SCHOOLS & TEAMS
-- =============================================

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(50) DEFAULT 'USA',
  division VARCHAR(50),
  conference VARCHAR(100),
  mascot VARCHAR(100),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  name VARCHAR(100) NOT NULL,
  season VARCHAR(20), -- 'indoor', 'outdoor', 'cross_country'
  year INTEGER,
  coach_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'athlete',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, athlete_id)
);

-- =============================================
-- EVENTS & PERSONAL RECORDS
-- =============================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'sprint', 'distance', 'hurdles', 'jumps', 'throws', 'relay'
  distance_meters INTEGER,
  is_field_event BOOLEAN DEFAULT FALSE,
  is_relay BOOLEAN DEFAULT FALSE,
  unit VARCHAR(20) DEFAULT 'time', -- 'time', 'distance', 'height'
  gender VARCHAR(10), -- 'male', 'female', 'unisex'
  sort_order INTEGER
);

CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  
  -- Performance
  time_ms INTEGER, -- for running events (milliseconds)
  distance_cm INTEGER, -- for throws/jumps (centimeters)
  height_cm INTEGER, -- for high jump/pole vault
  
  -- Context
  meet_id UUID REFERENCES meets(id),
  location VARCHAR(200),
  conditions VARCHAR(100), -- 'indoor', 'outdoor', 'wind_legal', etc.
  wind_speed DECIMAL(4,2),
  
  -- Verification
  verification_status VARCHAR(20) DEFAULT 'pending',
  video_url VARCHAR(500),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  
  -- Metadata
  logged_at TIMESTAMP DEFAULT NOW(),
  is_current_pr BOOLEAN DEFAULT TRUE,
  season VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- RANKINGS
-- =============================================

CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  
  -- Scope
  scope_type VARCHAR(20) NOT NULL, -- 'school', 'state', 'national', 'class_year'
  scope_id VARCHAR(100), -- school_id, state code, or class year
  
  -- Rank Data
  rank_position INTEGER NOT NULL,
  rank_points INTEGER DEFAULT 0,
  tier VARCHAR(20), -- 'rookie', 'varsity', 'elite', 'all_state', 'national', 'world_class'
  
  -- Performance Reference
  best_time_ms INTEGER,
  best_distance_cm INTEGER,
  
  -- Change Tracking
  previous_rank INTEGER,
  rank_change INTEGER DEFAULT 0,
  
  season VARCHAR(20),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(athlete_id, event_id, scope_type, scope_id, season)
);

-- Tier thresholds (configurable)
CREATE TABLE tier_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  gender VARCHAR(10),
  tier VARCHAR(20),
  min_time_ms INTEGER,
  max_time_ms INTEGER,
  min_distance_cm INTEGER,
  max_distance_cm INTEGER
);

-- =============================================
-- MEETS & RESULTS
-- =============================================

CREATE TABLE meets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  venue VARCHAR(200),
  city VARCHAR(100),
  state VARCHAR(50),
  
  start_date DATE NOT NULL,
  end_date DATE,
  
  meet_type VARCHAR(50), -- 'dual', 'invitational', 'championship', 'conference'
  level VARCHAR(50), -- 'high_school', 'club', 'college', 'open'
  
  host_school_id UUID REFERENCES schools(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'in_progress', 'completed'
  results_verified BOOLEAN DEFAULT FALSE,
  
  -- External Links
  results_url VARCHAR(500),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meet_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meet_id UUID REFERENCES meets(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  
  -- Performance
  time_ms INTEGER,
  distance_cm INTEGER,
  height_cm INTEGER,
  
  -- Race Details
  heat INTEGER,
  lane INTEGER,
  place INTEGER,
  
  -- Conditions
  wind_speed DECIMAL(4,2),
  is_wind_legal BOOLEAN DEFAULT TRUE,
  
  -- Verification
  verification_status VARCHAR(20) DEFAULT 'pending',
  verified_by UUID REFERENCES users(id),
  
  -- Flags
  is_pr BOOLEAN DEFAULT FALSE,
  is_season_best BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TRAINING & WORKOUTS
-- =============================================

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Workout Details
  workout_type VARCHAR(50) NOT NULL, -- 'sprint', 'tempo', 'distance', 'lift', 'plyo', 'recovery', 'drills'
  title VARCHAR(200),
  description TEXT,
  
  -- Metrics
  total_distance_meters INTEGER,
  total_duration_minutes INTEGER,
  
  -- Intervals/Splits (JSON array)
  splits JSONB, -- [{distance: 200, time_ms: 28000, rest_seconds: 180}, ...]
  
  -- Subjective
  effort_rating INTEGER CHECK (effort_rating BETWEEN 1 AND 10),
  fatigue_score INTEGER CHECK (fatigue_score BETWEEN 1 AND 10),
  notes TEXT,
  
  -- Context
  location VARCHAR(200),
  weather VARCHAR(100),
  surface VARCHAR(50), -- 'track', 'grass', 'road', 'trail', 'treadmill'
  
  -- Assignment (if coach-assigned)
  assigned_by UUID REFERENCES users(id),
  assigned_workout_id UUID,
  
  logged_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id),
  
  name VARCHAR(200) NOT NULL,
  description TEXT,
  workout_type VARCHAR(50) NOT NULL,
  
  -- Template structure
  structure JSONB NOT NULL, -- [{type: 'interval', distance: 200, reps: 6, rest: 180}, ...]
  
  -- Metadata
  difficulty VARCHAR(20),
  estimated_duration_minutes INTEGER,
  target_event_category VARCHAR(50),
  
  is_public BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assigned_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES users(id),
  athlete_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  
  template_id UUID REFERENCES workout_templates(id),
  custom_workout JSONB,
  
  title VARCHAR(200),
  notes TEXT,
  
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_workout_id UUID REFERENCES workouts(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INJURY & RECOVERY TRACKING
-- =============================================

CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  body_part VARCHAR(100) NOT NULL,
  injury_type VARCHAR(100),
  severity VARCHAR(20), -- 'minor', 'moderate', 'severe'
  
  description TEXT,
  
  injury_date DATE,
  recovery_start_date DATE,
  expected_return_date DATE,
  actual_return_date DATE,
  
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'recovering', 'resolved'
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE soreness_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  body_part VARCHAR(100) NOT NULL,
  severity INTEGER CHECK (severity BETWEEN 1 AND 10),
  notes TEXT,
  
  logged_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SOCIAL FEED
-- =============================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  content_type VARCHAR(20) NOT NULL, -- 'text', 'workout', 'pr', 'meet_result', 'video', 'photo'
  content_text TEXT,
  media_urls JSONB DEFAULT '[]',
  
  -- Linked Content
  workout_id UUID REFERENCES workouts(id),
  pr_id UUID REFERENCES personal_records(id),
  meet_result_id UUID REFERENCES meet_results(id),
  event_id UUID REFERENCES events(id),
  
  -- Engagement (denormalized)
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Visibility
  visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'followers', 'team', 'private'
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id), -- for threading
  
  content TEXT NOT NULL,
  
  likes_count INTEGER DEFAULT 0,
  
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- 'rank_change', 'new_follower', 'like', 'comment', 'mention', 'pr_verified', etc.
  title VARCHAR(200),
  body TEXT,
  
  -- Related entities
  related_user_id UUID REFERENCES users(id),
  related_post_id UUID REFERENCES posts(id),
  related_pr_id UUID REFERENCES personal_records(id),
  
  -- Metadata
  data JSONB,
  
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- MESSAGING
-- =============================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) DEFAULT 'direct', -- 'direct', 'group'
  name VARCHAR(200), -- for group chats
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  
  content TEXT NOT NULL,
  
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- RELAY TEAMS
-- =============================================

CREATE TABLE relay_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  event_id UUID REFERENCES events(id),
  
  name VARCHAR(100),
  
  -- Athletes (ordered array of user IDs)
  athletes JSONB NOT NULL, -- [uuid1, uuid2, uuid3, uuid4]
  
  -- Performance
  best_time_ms INTEGER,
  season VARCHAR(20),
  
  -- Splits
  splits JSONB, -- [{athlete_id, split_ms, leg: 1}, ...]
  
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- GAMIFICATION
-- =============================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50), -- 'training', 'social', 'competition', 'milestone'
  
  -- Unlock criteria (JSON)
  criteria JSONB NOT NULL,
  
  points INTEGER DEFAULT 0,
  rarity VARCHAR(20) DEFAULT 'common' -- 'common', 'rare', 'epic', 'legendary'
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  challenge_type VARCHAR(50), -- 'distance', 'workouts', 'improvement', 'streak'
  target_value INTEGER,
  unit VARCHAR(50),
  
  start_date DATE,
  end_date DATE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  current_value INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- =============================================
-- REFERRALS
-- =============================================

CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  uses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id),
  code_used VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_athlete_profiles_school ON athlete_profiles(school_id);
CREATE INDEX idx_athlete_profiles_grad_year ON athlete_profiles(grad_year);
CREATE INDEX idx_personal_records_athlete ON personal_records(athlete_id);
CREATE INDEX idx_personal_records_event ON personal_records(event_id);
CREATE INDEX idx_personal_records_time ON personal_records(time_ms);
CREATE INDEX idx_rankings_event_scope ON rankings(event_id, scope_type, scope_id);
CREATE INDEX idx_rankings_athlete ON rankings(athlete_id);
CREATE INDEX idx_rankings_position ON rankings(rank_position);
CREATE INDEX idx_workouts_athlete ON workouts(athlete_id);
CREATE INDEX idx_workouts_logged_at ON workouts(logged_at);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_meet_results_meet ON meet_results(meet_id);
CREATE INDEX idx_meet_results_athlete ON meet_results(athlete_id);
```

---

## 🚀 Epic Breakdown

### EPIC 1: Core Foundation (Weeks 1-4)
**Goal**: Get basic app running with auth, profiles, and manual PR logging

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 1.1 | As an athlete, I can create an account with my email | P0 | 3 |
| 1.2 | As an athlete, I can build my profile (name, events, school) | P0 | 5 |
| 1.3 | As an athlete, I can manually log a PR time | P0 | 5 |
| 1.4 | As an athlete, I can see my profile with my best times | P0 | 3 |
| 1.5 | As a coach, I can create a team and invite athletes | P1 | 8 |
| 1.6 | As an athlete, I can select my school from a list | P0 | 3 |
| 1.7 | As an athlete, I can upload a profile photo | P1 | 3 |

#### Technical Tasks
- [ ] Set up Next.js 14 with App Router
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up Supabase project (Auth + Database)
- [ ] Create Prisma schema and run migrations
- [ ] Build authentication flow (sign up, sign in, verify email)
- [ ] Create profile creation wizard
- [ ] Build PR logging form with event selection
- [ ] Create profile view page
- [ ] Seed database with events and top 500 schools
- [ ] Basic responsive design

#### Low-Hanging Fruit 🍎
- Use Supabase Auth for instant authentication
- Seed database with NCAA event list
- Use react-hook-form + zod for form validation
- shadcn/ui components for rapid UI development

#### Deliverables
- ✅ Working web app with authentication
- ✅ Athletes can sign up and create profiles
- ✅ Athletes can log PRs
- ✅ Basic profile pages

---

### EPIC 2: Rankings Engine (Weeks 5-7)
**Goal**: Calculate and display rankings that athletes actually care about

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 2.1 | As an athlete, I can see my rank in my event at my school | P0 | 5 |
| 2.2 | As an athlete, I can see state rankings for my event | P0 | 5 |
| 2.3 | As an athlete, I can see my rank tier (Rookie → World Class) | P0 | 3 |
| 2.4 | As an athlete, I can see who's ranked around me | P0 | 3 |
| 2.5 | As an athlete, I can filter rankings by event, scope, season | P1 | 5 |
| 2.6 | As an athlete, I get notified when my rank changes | P1 | 5 |

#### Ranking Algorithm
```javascript
const calculateRankPoints = (athlete, event) => {
  const baseTimeScore = getTimeScore(athlete.bestTime, event) * 0.60;
  const consistencyScore = getConsistencyScore(athlete.times) * 0.20;
  const competitionLevel = getMeetQualityScore(athlete.meets) * 0.15;
  const raceFrequency = getActivityScore(athlete.recentRaces) * 0.05;
  
  return baseTimeScore + consistencyScore + competitionLevel + raceFrequency;
};

// Tier Thresholds (100m example, male)
const TIER_THRESHOLDS = {
  '100m': {
    male: {
      world_class: 10.50,
      national: 10.80,
      all_state: 11.20,
      elite: 11.50,
      varsity: 12.00,
      rookie: Infinity
    }
  }
};
```

#### Technical Tasks
- [ ] Design and implement ranking calculation algorithm
- [ ] Create background job for hourly ranking recalculation
- [ ] Build rankings API endpoints
- [ ] Create leaderboard UI with infinite scroll
- [ ] Implement tier badge system
- [ ] Add rank change indicators (↑2, ↓1, -)
- [ ] Build "Most Improved" leaderboard
- [ ] Set up Redis for fast leaderboard queries

#### Low-Hanging Fruit 🍎
- Use Redis sorted sets for O(log N) leaderboard queries
- Cache rankings for 1 hour
- Start with school + state rankings only
- Hardcode tier thresholds initially

#### Deliverables
- ✅ Working rankings system
- ✅ Athletes can see where they rank
- ✅ Leaderboards update automatically
- ✅ Tier progression visible

---

### EPIC 3: Meet System (Weeks 8-10)
**Goal**: Athletes can log meet results and get instant rank updates

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 3.1 | As an athlete, I can see upcoming meets on a calendar | P0 | 5 |
| 3.2 | As an athlete, I can log my result after a race | P0 | 5 |
| 3.3 | As an athlete, I get notified when my rank changes | P0 | 3 |
| 3.4 | As a coach, I can create a meet and add athletes | P1 | 5 |
| 3.5 | As a coach, I can verify athlete results | P1 | 5 |
| 3.6 | As an athlete, I can see all results from a meet | P1 | 3 |

#### Technical Tasks
- [ ] Build meet creation flow (coaches)
- [ ] Create meet calendar view (monthly + list)
- [ ] Build meet result logging form
- [ ] Create coach verification workflow
- [ ] Build meet results page
- [ ] Implement real-time rank updates (WebSocket)
- [ ] Add push notifications for rank changes
- [ ] Seed database with major meets

#### Low-Hanging Fruit 🍎
- Seed database with major meets (Penn Relays, Brooks PR, state championships)
- Simple approval: coach clicks "approve" → status changes
- Push notifications via web push API
- Use Socket.io for real-time updates

#### Deliverables
- ✅ Meet calendar with upcoming events
- ✅ Athletes can log and track meet results
- ✅ Coaches can verify results
- ✅ Real-time rank updates

---

### EPIC 4: Training Hub (Weeks 11-14)
**Goal**: Comprehensive training tools that keep athletes coming back daily

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 4.1 | As an athlete, I can log daily workouts | P0 | 5 |
| 4.2 | As an athlete, I can see training analytics | P0 | 8 |
| 4.3 | As an athlete, I can upload race videos | P1 | 8 |
| 4.4 | As an athlete, I can build relay lineups | P2 | 5 |
| 4.5 | As an athlete, I can track soreness and injuries | P1 | 5 |
| 4.6 | As an athlete, I can use race day checklists | P2 | 3 |

#### Training Analytics
```javascript
// Training Load Calculation
const calculateTrainingLoad = (workouts, days = 7) => {
  const recentWorkouts = workouts.filter(w => 
    isWithinDays(w.logged_at, days)
  );
  
  return recentWorkouts.reduce((total, workout) => {
    const volume = workout.total_distance_meters || 0;
    const intensity = workout.effort_rating / 10;
    return total + (volume * intensity);
  }, 0);
};

// Acute:Chronic Workload Ratio
const calculateACWR = (workouts) => {
  const acute = calculateTrainingLoad(workouts, 7);
  const chronic = calculateTrainingLoad(workouts, 28) / 4;
  return chronic > 0 ? acute / chronic : 0;
};

// Risk Zones
// < 0.8: Undertrained
// 0.8 - 1.3: Optimal
// > 1.3: Injury Risk
```

#### Technical Tasks
- [ ] Build workout logging form with split entry
- [ ] Create workout calendar view
- [ ] Calculate and display training load metrics
- [ ] Build analytics dashboard with charts
- [ ] Implement video upload and compression
- [ ] Build basic video player with scrubbing
- [ ] Create relay team builder
- [ ] Build soreness tracking (body diagram)
- [ ] Create injury log
- [ ] Build race day checklist system

#### Low-Hanging Fruit 🍎
- Start with manual workout logging (no wearables)
- Use recharts for analytics visualizations
- FFmpeg for video processing
- Store videos in Cloudflare R2
- Simple body diagram SVG with clickable regions

#### Deliverables
- ✅ Complete workout logging system
- ✅ Training analytics dashboard
- ✅ Video upload and basic analysis
- ✅ Relay lineup builder
- ✅ Injury tracking
- ✅ Race day checklists

---

### EPIC 5: Social Feed (Weeks 15-17)
**Goal**: Build the community where track athletes actually hang out

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 5.1 | As an athlete, I can post race videos and updates | P0 | 5 |
| 5.2 | As an athlete, I can follow teammates and rivals | P0 | 3 |
| 5.3 | As an athlete, I can like, comment, and share posts | P0 | 5 |
| 5.4 | As an athlete, I can see a personalized feed | P1 | 8 |
| 5.5 | As an athlete, I can discover trending posts | P1 | 5 |

#### Feed Algorithm
```javascript
const calculatePostScore = (post, viewer) => {
  const engagement = (post.likes_count + post.comments_count * 2) / 
    Math.max(1, getHoursSincePost(post));
  
  const recency = Math.exp(-getHoursSincePost(post) / 24);
  
  const relevance = calculateRelevance(post, viewer);
  // Same school: +0.3, Same event: +0.2, Following: +0.4
  
  const verification = post.pr_id && post.pr_verified ? 0.15 : 0;
  
  return (
    engagement * 0.40 +
    recency * 0.25 +
    relevance * 0.20 +
    verification * 0.15
  );
};
```

#### Technical Tasks
- [ ] Build post composer with media upload
- [ ] Implement @ mentions and # hashtags
- [ ] Create different post types (PR, workout, general)
- [ ] Build feed with infinite scroll
- [ ] Implement feed algorithm
- [ ] Build like/unlike system
- [ ] Build comment system with threading
- [ ] Implement follow/unfollow
- [ ] Build user discovery
- [ ] Add content moderation (reporting, blocking)

#### Low-Hanging Fruit 🍎
- Use existing component libraries for feed UI
- Start with chronological feed, add algorithm later
- React Query for feed pagination
- Expo push notifications (already integrated)
- Skip reels/stories for MVP

#### Deliverables
- ✅ Full social feed experience
- ✅ Athletes can post, like, comment, share
- ✅ Personalized feed algorithm
- ✅ Following/follower system
- ✅ Basic moderation tools

---

### EPIC 6: Coach Tools (Weeks 18-19)
**Goal**: Make coaches love TrackVerse so they promote it to their teams

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 6.1 | As a coach, I can see my full team roster | P0 | 5 |
| 6.2 | As a coach, I can assign workouts to athletes | P0 | 8 |
| 6.3 | As a coach, I can monitor athlete fatigue | P1 | 5 |
| 6.4 | As a coach, I can verify athlete PRs | P0 | 3 |
| 6.5 | As a coach, I can analyze relay performance | P2 | 5 |

#### Technical Tasks
- [ ] Build team overview dashboard
- [ ] Create workout builder and assignment system
- [ ] Build completion tracking
- [ ] Implement fatigue monitoring dashboard
- [ ] Add injury tracking view
- [ ] Build verification workflow
- [ ] Create relay team manager
- [ ] Build depth chart view

#### Low-Hanging Fruit 🍎
- Simple table view of roster
- Basic form for workout assignment
- Color coding for fatigue (green/yellow/red)
- Approve/reject buttons for verification

#### Deliverables
- ✅ Complete coach dashboard
- ✅ Workout assignment system
- ✅ Fatigue/injury monitoring
- ✅ PR verification workflow
- ✅ Relay team analysis

---

### EPIC 7: Recruiting Platform (Weeks 20-22)
**Goal**: Help athletes get recruited, help scouts find talent

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 7.1 | As an athlete, my profile auto-generates a recruiting resume | P0 | 5 |
| 7.2 | As an athlete, I can see which scouts viewed my profile | P1 | 3 |
| 7.3 | As a scout, I can search for athletes | P0 | 8 |
| 7.4 | As a scout, I can save athletes to prospect lists | P1 | 5 |
| 7.5 | As a scout, I can message athletes | P1 | 5 |

#### Technical Tasks
- [ ] Build auto-generated recruiting profile
- [ ] Add highlight reel generator
- [ ] Implement profile view tracking
- [ ] Build scout account type
- [ ] Create athlete search with filters
- [ ] Build prospect list management
- [ ] Implement athlete-scout messaging
- [ ] Add privacy controls

#### Low-Hanging Fruit 🍎
- Recruiting profile: formatted view of existing data
- Scout verification: manual admin approval
- Search: basic SQL queries with filters
- Simple chat system with Socket.io

#### Deliverables
- ✅ Auto-generated recruiting profiles
- ✅ Scout search and filtering
- ✅ Prospect list management
- ✅ Messaging system
- ✅ Privacy controls

---

### EPIC 8: Polish & Growth (Weeks 23-26)
**Goal**: Make the app feel premium and drive viral growth

#### User Stories
| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 8.1 | As an athlete, I can refer friends | P1 | 5 |
| 8.2 | As an athlete, I get rewards for consistent use | P1 | 5 |
| 8.3 | As an athlete, the app feels fast and polished | P0 | 8 |
| 8.4 | As an athlete, I can customize my profile | P2 | 3 |
| 8.5 | As an athlete, I can join challenges | P2 | 5 |

#### Technical Tasks
- [ ] Build referral system
- [ ] Implement achievement/badge system
- [ ] Add streak tracking
- [ ] Create seasonal challenges
- [ ] Optimize performance (lazy loading, caching)
- [ ] Add skeleton screens
- [ ] Implement offline mode
- [ ] Build profile customization
- [ ] Implement smart notifications
- [ ] Create onboarding flow

#### Low-Hanging Fruit 🍎
- Referral: generate unique codes, track in DB
- Achievements: hardcode criteria, check on actions
- Image optimization: Next.js Image component
- Skeleton screens: react-loading-skeleton
- Onboarding: react-joyride for tours

#### Deliverables
- ✅ Viral referral system
- ✅ Gamification features
- ✅ Fast, polished app
- ✅ Beautiful onboarding
- ✅ Smart notifications

---

## 🎨 UI/UX Design System

### Color Palette

```css
:root {
  /* Primary */
  --primary: #FF6B35;        /* Track Orange */
  --primary-dark: #E55A2B;
  --primary-light: #FF8F66;
  
  /* Secondary */
  --secondary: #004E89;      /* Deep Blue */
  --secondary-dark: #003D6B;
  --secondary-light: #0066B3;
  
  /* Semantic */
  --success: #06D6A0;        /* Green */
  --warning: #FFD23F;        /* Yellow */
  --danger: #EE4266;         /* Red */
  --info: #3B82F6;           /* Blue */
  
  /* Neutrals */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Tier Colors */
  --tier-rookie: #9CA3AF;
  --tier-varsity: #06D6A0;
  --tier-elite: #3B82F6;
  --tier-all-state: #8B5CF6;
  --tier-national: #F59E0B;
  --tier-world-class: #EF4444;
}
```

### Typography

```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Times and Rankings - Extra Bold Mono */
.time-display {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: var(--text-3xl);
  letter-spacing: -0.02em;
}

.rank-display {
  font-family: var(--font-mono);
  font-weight: 900;
  font-size: var(--text-4xl);
}
```

### Component Library

#### Athlete Card
```
┌─────────────────────────────────────────┐
│  [Avatar]  Name                    #12  │
│            School • Class of 2025       │
│                                         │
│  100m: 10.85    200m: 21.92            │
│  ████████░░ Elite                       │
└─────────────────────────────────────────┘
```

#### Workout Card
```
┌─────────────────────────────────────────┐
│  🏃 Sprint Workout          Dec 15      │
│  6 x 200m @ 90%                         │
│                                         │
│  Total: 1,200m  |  Effort: 8/10        │
│  ████████░░                             │
└─────────────────────────────────────────┘
```

#### Post Card
```
┌─────────────────────────────────────────┐
│  [Avatar] Name • 2h ago                 │
│                                         │
│  Just ran a new PR! 10.85 in the 100m  │
│  at State Championships! 🔥             │
│                                         │
│  [Video Thumbnail]                      │
│                                         │
│  ❤️ 234   💬 45   🔄 12                 │
└─────────────────────────────────────────┘
```

### Key Screens

1. **Home Feed** - Where athletes spend most time
2. **Rankings** - The hook that keeps them coming back
3. **Profile** - Their digital resume
4. **Training Log** - Daily utility
5. **Meet Calendar** - Pre-race excitement

### UX Principles

- **Thumb-friendly**: All primary actions within thumb reach
- **Fast actions**: Log workout in <30 seconds
- **Visual hierarchy**: Times and ranks are HUGE
- **Immediate feedback**: Every action shows instant result
- **Gesture-based**: Swipe to like, pull to refresh

---

## 📈 Success Metrics

### North Star Metric
**DAU/MAU Ratio** - Target: >40%

### Primary Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Weekly workout logs per athlete | >3 | Avg workouts/active user/week |
| Rank checks per week | >5 | Avg ranking page views/user/week |
| Feed engagement rate | >15% | (likes + comments) / impressions |
| Coach verification rate | >80% | Verified PRs / Total PRs |

### Growth Metrics
| Metric | Target |
|--------|--------|
| Week-over-week user growth | >20% |
| Referral conversion rate | >30% |
| School activation rate | >60% |

### Retention Metrics
| Metric | Target |
|--------|--------|
| Day 1 retention | >60% |
| Day 7 retention | >40% |
| Day 30 retention | >25% |

---

## 🚀 Launch Strategy

### Phase 1: Private Beta (Week 27)
- Launch at 5 hand-picked high schools
- 100-200 athletes total
- Focus: Core loops work, athletes log workouts daily
- Success: >60% weekly active, >3 workouts/athlete

### Phase 2: Regional Expansion (Week 30)
- Open to entire state/region (20-30 schools)
- 1,000-2,000 athletes
- Focus: Rankings meaningful, network effects kick in
- Success: >40% DAU/MAU, organic referrals happening

### Phase 3: National Launch (Week 36)
- Open to all high schools nationwide
- Target: 10,000+ athletes in first month
- Focus: Viral growth through rankings + social
- Success: Featured in App Store, press coverage

### Marketing Tactics
- **Campus takeover**: QR codes in locker rooms
- **Coach partnerships**: 1 coach champion per school
- **Ranking bait**: "See where you rank against [rival school]"
- **Social proof**: Showcase top-ranked athletes
- **Meme marketing**: Track memes on TikTok/Instagram

---

## 💰 Monetization (Post-Launch)

### Year 1: Build Network Effects (Free)
- No paywalls, no subscriptions
- Goal: >50,000 athletes

### Year 2: B2B Revenue
| Product | Price | Features |
|---------|-------|----------|
| School/Team Accounts | $500-2000/year | Advanced analytics, bulk management, branding |
| Recruiting Platform | $5000-10000/year | Advanced search, unlimited messaging, analytics |
| Brand Partnerships | Custom | Spike testing programs, sponsored content, NIL marketplace |

### Year 3: Premium Features (Optional)
| Feature | Price |
|---------|-------|
| Advanced video analysis | $5/mo |
| Custom training plans | $10-15/mo |
| Priority support | $5/mo |

---

## 🏁 What Makes This Win

✅ **Rankings hook**: Every athlete wants to know where they stand
✅ **Daily utility**: Training tools bring them back every day
✅ **Social proof**: Feed makes success visible and contagious
✅ **Coach buy-in**: Tools coaches actually need
✅ **Free forever**: Remove all barriers to adoption

## ❌ What to Avoid

- Building too much too fast (ship core loops first)
- Overthinking rankings algorithm (start simple, iterate)
- Ignoring coaches (they're the distribution channel)
- Adding monetization too early (kills network effects)
- Perfectionism (ship fast, learn fast, iterate fast)

---

## 📅 Timeline Summary

| Epic | Weeks | Duration | Team |
|------|-------|----------|------|
| Core Foundation | 1-4 | 4 weeks | 2 devs |
| Rankings Engine | 5-7 | 3 weeks | 3 devs |
| Meet System | 8-10 | 3 weeks | 2 devs |
| Training Hub | 11-14 | 4 weeks | 4 devs |
| Social Feed | 15-17 | 3 weeks | 3 devs |
| Coach Tools | 18-19 | 2 weeks | 2 devs |
| Recruiting Platform | 20-22 | 3 weeks | 2 devs |
| Polish & Growth | 23-26 | 4 weeks | 3 devs |

**Total: 26 weeks to full launch**

---

*Built with ❤️ for the track community*
