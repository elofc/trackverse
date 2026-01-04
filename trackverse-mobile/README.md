# TrackVerse Mobile

React Native mobile app for TrackVerse - the ultimate platform for track & field athletes.

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand + React Query
- **Icons**: Lucide React Native
- **Animations**: React Native Reanimated + Gesture Handler
- **Offline Support**: AsyncStorage + Sync Queue
- **Push Notifications**: Expo Notifications

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

```bash
cd trackverse-mobile
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## Project Structure

```
trackverse-mobile/
├── app/                        # Expo Router pages
│   ├── (tabs)/                # Tab navigation screens
│   │   ├── index.tsx          # Feed screen
│   │   ├── rankings.tsx       # Rankings screen
│   │   ├── training.tsx       # Training screen (swipeable workouts)
│   │   ├── meets.tsx          # Meets screen
│   │   └── profile.tsx        # Profile screen
│   ├── log-workout.tsx        # Workout logging screen
│   ├── notifications-settings.tsx  # Notification preferences
│   ├── _layout.tsx            # Root layout
│   └── index.tsx              # Entry redirect
├── components/                # Reusable components
│   ├── SwipeableWorkoutItem.tsx   # Gesture-based workout item
│   └── OfflineBanner.tsx      # Offline status indicator
├── hooks/                     # Custom hooks
│   ├── useNotifications.ts    # Push notification management
│   ├── useNetworkStatus.ts    # Online/offline detection
│   └── useOfflineData.ts      # Offline-first data fetching
├── stores/                    # Zustand stores
│   ├── workoutStore.ts        # Workout state + sync queue
│   └── offlineStore.ts        # Cached data for offline use
├── assets/                    # Images and icons
├── global.css                 # Tailwind CSS
├── tailwind.config.js         # Tailwind configuration
├── babel.config.js            # Babel configuration
├── metro.config.js            # Metro bundler configuration
└── app.json                   # Expo configuration
```

## Features

### Core Screens
- **Feed**: Social feed with PR celebrations, workout updates, and meet results
- **Rankings**: Real-time leaderboards by event with tier badges
- **Training**: Workout logging with templates and progress tracking
- **Meets**: Meet calendar with event registration and results
- **Profile**: Personal stats, PRs, and achievements

### Gesture-Based Workout Logging
- **Swipe right** to mark workout complete
- **Swipe left** to delete workout
- **Long press** to edit workout
- Quick-add exercises from templates
- RPE (Rate of Perceived Exertion) tracking

### Push Notifications
- Daily workout reminders (8 AM)
- Streak warning alerts (8 PM)
- PR celebrations
- Matchup results
- Meet reminders

### Offline Mode
- Automatic data caching for offline access
- Sync queue for actions taken while offline
- Auto-sync when connection restored
- Visual offline indicator banner

## Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Or use EAS Build
npx eas build --platform all
```
