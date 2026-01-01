# 🛠️ TrackVerse Commands Reference

## Git Commands

### Daily Workflow
```bash
# Start your day - pull latest
git pull origin develop

# Create feature branch
git checkout -b feature/feature-name

# Save your work
git add .
git commit -m "feat: description of changes"
git push -u origin feature/feature-name

# When done, merge to develop
git checkout develop
git merge feature/feature-name
git push
```

### Branch Switching
```bash
git checkout main          # Production
git checkout develop       # Development
git checkout pwa           # PWA version
git checkout native-app    # Mobile app
```

### Useful Git Commands
```bash
git status                 # Check current state
git log --oneline -10      # View recent commits
git stash                  # Temporarily save changes
git stash pop              # Restore stashed changes
git branch -a              # List all branches
git diff                   # See uncommitted changes
```

---

## Development Commands

### Start Development
```bash
npm run dev                # Start dev server at localhost:3000
```

### Build & Deploy
```bash
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Check for errors
```

---

## Database (Prisma)

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open database GUI
npx prisma studio

# Seed database with test data
npx prisma db seed

# Push schema changes without migration (dev only)
npx prisma db push
```

---

## Package Management

```bash
# Install all dependencies
npm install

# Add new package
npm install package-name

# Add dev dependency
npm install -D package-name

# Update packages
npm update

# Check for outdated packages
npm outdated
```

---

## Troubleshooting

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Reinstall Dependencies
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Reset Prisma
```bash
npx prisma generate
npx prisma migrate reset
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## PWA Commands (for pwa branch)

```bash
# Install PWA plugin
npm install next-pwa

# Generate icons (if using pwa-asset-generator)
npx pwa-asset-generator logo.png public/icons
```

---

## React Native Commands (for native-app branch)

```bash
# Create Expo project
npx create-expo-app trackverse-mobile

# Start Expo
npx expo start

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```
