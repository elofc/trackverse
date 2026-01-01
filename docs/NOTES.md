# 📝 TrackVerse Developer Notes

## Quick Reference

### Git Commands

```bash
# Switch branches
git checkout main          # Production
git checkout develop       # Active development
git checkout pwa           # PWA version
git checkout native-app    # React Native version

# Create new feature branch
git checkout develop
git checkout -b feature/your-feature-name

# Push changes
git add .
git commit -m "Your commit message"
git push

# Pull latest changes
git pull origin main

# Merge develop into main (for releases)
git checkout main
git merge develop
git push
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npx prisma db seed
```

### Environment Variables

Create a `.env.local` file with:
```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Project Structure

```
versetrack/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── coach/          # Coach dashboard pages
│   │   ├── feed/           # Social feed pages
│   │   ├── meets/          # Meet system pages
│   │   ├── rankings/       # Rankings pages
│   │   └── training/       # Training hub pages
│   ├── components/
│   │   ├── trackverse/     # Custom TrackVerse components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities and configs
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding
├── public/                 # Static assets
└── docs/                   # Documentation & notes
```

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Active development |
| `pwa` | PWA-specific features |
| `native-app` | React Native mobile app |

---

## Completed Features (Phase 1)

- [x] Epic 1: Core Foundation (Auth, Profiles, PRs)
- [x] Epic 2: Rankings Engine (Tiers, Leaderboards)
- [x] Epic 3: Meet System (Calendar, Results)
- [x] Epic 4: Training Hub (Workouts, Analytics)
- [x] Epic 5: Social Feed (Posts, Likes, Comments)
- [x] Epic 6: Coach Dashboard (Team Management)

---

## Phase 2 Roadmap

- [ ] Epic 7: Recruiting Platform
- [ ] Epic 8: Mobile App (React Native)
- [ ] Epic 9: Real-Time Features
- [ ] Epic 10: Video Analysis & AI
- [ ] Epic 11: Gamification
- [ ] Epic 12: Advanced Analytics
- [ ] Epic 13: Integrations & API
- [ ] Epic 14: Polish & Performance

---

## Useful Links

- **GitHub Repo**: https://github.com/elofc/trackverse
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## Notes

_Add your personal notes below:_




