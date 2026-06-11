# MyWardrobe

A smart, privacy-focused personal wardrobe manager that helps you organize clothing, track hygiene habits, manage laundry, and get weather-aware outfit suggestions. 100% offline-first — all data stays on your device.

## Features

- **Dashboard** — Overview of your wardrobe with stats, weather widget, and quick actions
- **Add Items** — Photo capture, categories, colors, materials, brand tracking
- **Wardrobe Grid** — Browse with search, filters, sorting, and beautiful cards
- **Outfit Logger** — Track what you're wearing today with hygiene timers
- **Laundry Tracker** — Manage dirty, in-wash, and clean statuses
- **Weather Integration** — Open-Meteo API for temperature-aware suggestions
- **Donation Suggestions** — Flags items unworn for 6+ months
- **Export & Backup** — PDF, TXT, and JSON export with AI analysis prompt
- **Import Backup** — Restore from JSON backup files
- **Multi-Language** — English, Arabic (RTL), French
- **Dark/Light Mode** — System-aware theme switching

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion animations
- localStorage persistence
- Capacitor.js for Android
- jsPDF for PDF export
- Open-Meteo API for weather

## Getting Started

### Web Development

```bash
npm install
npm run dev
```

### Android Build

```bash
# Install Capacitor Android platform
npx cap add android

# Sync web assets to Android
npx cap sync android

# Open Android Studio
npx cap open android
```

## Building Android APK via GitHub Actions

1. Push your code to a GitHub repository
2. Go to the **Actions** tab in your repository
3. Select the **Android Build** workflow
4. Click **Run workflow**
5. Wait for the build to complete
6. Download the APK from the artifacts section

### Manual APK Build

```bash
# Build web assets
npm run build

# Sync and build Android
npx cap sync android
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Privacy

- No cloud storage
- No account required
- All data stays on your device
- Camera photos stored as base64 in localStorage only
- No built-in AI — export your data to use with any AI you trust

## License

MIT
