# 🏃 TrackVerse

**Where Track Athletes Rise to the Top**

TrackVerse is the definitive platform for track athletes to track progress, compete through rankings, connect with their community, and access world-class training tools—all for free.

![TrackVerse](https://img.shields.io/badge/TrackVerse-v1.0.0-orange)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

- **📊 Live Rankings** - See where you stand at school, state, and national levels
- **🏆 PR Tracking** - Log personal records and track progression over time
- **💪 Training Hub** - Log workouts, analyze performance, track training load
- **👥 Community** - Connect with teammates, follow rivals, share your journey
- **📅 Meet Calendar** - Track upcoming competitions and log results
- **🎯 Coach Tools** - Manage teams, assign workouts, verify results
- **🎓 Recruiting** - Auto-generated profiles for college scouts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trackverse.git
   cd trackverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui + Radix UI |
| **Animations** | Framer Motion |
| **Database** | PostgreSQL + Prisma |
| **Auth** | Supabase Auth |
| **State** | Zustand + React Query |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |

## 📁 Project Structure

```
trackverse/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── rankings/      # Rankings page
│   │   ├── training/      # Training hub
│   │   ├── meets/         # Meet calendar
│   │   ├── community/     # Social feed
│   │   ├── login/         # Auth pages
│   │   └── signup/
│   ├── components/
│   │   ├── ui/            # Base UI components
│   │   └── trackverse/    # App-specific components
│   └── lib/               # Utilities and configs
├── TRACKVERSE_DEVELOPMENT_PLAN.md  # Full development plan
└── env.example            # Environment variables template
```

## 🎨 Design System

### Colors
- **Primary**: Track Orange (`#FF6B35`)
- **Secondary**: Deep Blue (`#004E89`)
- **Success**: Green (`#06D6A0`)
- **Warning**: Yellow (`#FFD23F`)
- **Danger**: Red (`#EE4266`)

### Tier System
| Tier | Color | Threshold (100m) |
|------|-------|------------------|
| World Class | Red | < 10.50s |
| National | Amber | < 10.80s |
| All-State | Purple | < 11.20s |
| Elite | Blue | < 11.50s |
| Varsity | Green | < 12.00s |
| Rookie | Gray | All others |

## 📖 Documentation

See [TRACKVERSE_DEVELOPMENT_PLAN.md](./TRACKVERSE_DEVELOPMENT_PLAN.md) for:
- Complete epic breakdown
- Database schema
- API specifications
- UI/UX guidelines
- Launch strategy

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the track community
- Inspired by the passion of high school track athletes everywhere

---

**TrackVerse** - *Track your PRs. Climb the rankings. Join the community.*
