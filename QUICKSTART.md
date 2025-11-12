# Quick Start Guide - On Par Golf App

This guide will get you up and running in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Firebase

### Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `on-par-golf-app`
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click "Email/Password" and enable it
4. Click "Google" and enable it
   - Add your support email
   - Click "Save"

### Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location close to your users
5. Click "Enable"

### Get Firebase Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app with nickname: "On Par Web"
6. Copy the `firebaseConfig` object

## Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and paste your Firebase config values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 4: Deploy Firestore Rules

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init
   ```
   - Select "Firestore" and "Hosting"
   - Use an existing project
   - Select your project
   - Accept default file names

4. Deploy Firestore rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

## Step 5: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 6: Test the App

### Create Your First Tournament

1. Click "Sign In" in the top right
2. Sign up with email or Google
3. Click "Create Tournament"
4. Fill in the form:
   - Name: "Test Tournament"
   - Course: Bay Hill Club
   - Format: Stroke Play
   - Holes: 18
   - Start Date: Today
5. Click "Create Tournament"

### Test Joining a Tournament

1. Copy the join code from your tournament page
2. Open the app in an incognito window
3. Sign in as a different user
4. Click "Join Tournament"
5. Enter the join code
6. Click "Join Tournament"

### Test Score Entry

1. As the host, click "Start Tournament" on the tournament page
2. Click the "My Scorecard" tab
3. Enter strokes for hole 1
4. Click "Submit Score"
5. Watch the leaderboard update in real-time!

## Common Issues

### "Firebase not initialized" Error

- Make sure all environment variables in `.env.local` are set
- Restart the dev server after changing `.env.local`

### "Permission denied" when submitting scores

- Deploy Firestore rules: `firebase deploy --only firestore:rules`
- Make sure you're signed in

### Real-time updates not working

- Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
- Check browser console for errors

### Google Sign-in not working

1. Go to Firebase Console > Authentication > Settings
2. Add your domain to "Authorized domains"
   - For local dev: `localhost`
   - For production: `your-domain.com`

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize courses in `lib/mockData.ts`
- Add more players and test the leaderboard
- Deploy to production with Vercel or Firebase Hosting

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables from `.env.local`
5. Click "Deploy"

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Support

If you encounter any issues:

1. Check the troubleshooting section in [README.md](README.md)
2. Look for errors in the browser console
3. Check Firebase Console for any errors
4. Open an issue on GitHub

---

Happy golfing! ⛳
