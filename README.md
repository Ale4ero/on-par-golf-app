# On Par ⛳

A modern, responsive web application for creating, joining, and managing golf tournaments with real-time scoring and leaderboards. Replace paper scorecards with an intuitive digital experience.

![On Par](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.5-orange)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8)

## 🎯 Features

### Tournament Management
- **Create Tournaments**: Set up tournaments with custom names, courses, and formats
- **Multiple Formats**: Support for Stroke Play, Match Play, Scramble, Best Ball, and Alternate Shot
- **Join via Code**: Players can join tournaments using a 6-character code
- **Host Controls**: Tournament hosts can start and complete tournaments

### Real-time Scoring
- **Live Leaderboards**: Real-time updates using Firestore listeners
- **Hole-by-Hole Entry**: Digital scorecard with immediate sync
- **Score Validation**: Automatic calculation of scores relative to par
- **Color-Coded Display**: Visual indicators for birdies, pars, bogeys, etc.

### Player Features
- **User Profiles**: Manage name, email, and handicap
- **Score History**: View past rounds and performance
- **Mobile Friendly**: Responsive design works on any device

### Course Data
- **Pre-loaded Courses**: Bay Hill, Pebble Beach, Augusta National, St Andrews
- **Detailed Hole Info**: Par, distance, and handicap for each hole
- **Extensible**: Easy to add custom courses

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization (ready for charts)

### Backend
- **Firebase Auth** - Google & Email authentication
- **Firestore** - Real-time NoSQL database
- **Cloud Functions** - Serverless backend logic (ready to implement)
- **Firebase Storage** - Course images (optional)

### Deployment
- **Vercel** or **Firebase Hosting** - Production deployment

## 📁 Project Structure

```
on-par-golf-app/
├── app/                          # Next.js App Router pages
│   ├── auth/                    # Authentication page
│   ├── profile/                 # User profile page
│   ├── tournament/
│   │   ├── [id]/               # Tournament detail page
│   │   ├── create/             # Create tournament page
│   │   └── join/               # Join tournament page
│   ├── globals.css             # Global styles with Tailwind
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Home page
├── components/                  # React components
│   ├── AuthForm.tsx            # Sign in/up form
│   ├── AuthProvider.tsx        # Auth context provider
│   ├── Leaderboard.tsx         # Real-time leaderboard
│   ├── Navbar.tsx              # Navigation bar
│   ├── ScoreCard.tsx           # Score entry component
│   └── TournamentForm.tsx      # Tournament creation form
├── lib/                         # Core library code
│   ├── auth.ts                 # Authentication logic
│   ├── firebase.ts             # Firebase initialization
│   ├── firestore.ts            # Firestore CRUD operations
│   ├── mockData.ts             # Sample course data
│   └── types.ts                # TypeScript type definitions
├── utils/                       # Utility functions
│   ├── calculateScore.ts       # Score calculation logic
│   └── formatLeaderboard.ts    # Leaderboard formatting
├── firebase.json                # Firebase configuration
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase Account** (free tier is sufficient)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/on-par-golf-app.git
   cd on-par-golf-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**

   a. Go to [Firebase Console](https://console.firebase.google.com/)

   b. Create a new project

   c. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable Email/Password
      - Enable Google

   d. Create a Firestore Database:
      - Go to Firestore Database
      - Create database in production mode
      - Choose a location

   e. Get your Firebase config:
      - Go to Project Settings > General
      - Scroll to "Your apps" section
      - Click the web icon (</>) to register a web app
      - Copy the config values

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy Firestore rules and indexes**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   # Select Firestore and Hosting
   # Use existing project
   firebase deploy --only firestore:rules,firestore:indexes
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Creating a Tournament

1. Sign in with Google or email
2. Click "Create Tournament" on the home page
3. Fill in tournament details:
   - Tournament name
   - Select a golf course
   - Choose format (Stroke Play, Scramble, etc.)
   - Set number of holes (9 or 18)
   - Pick a start date
4. Click "Create Tournament"
5. Share the join code with other players

### Joining a Tournament

1. Sign in with Google or email
2. Click "Join Tournament" on the home page
3. Enter the 6-character join code
4. Click "Join Tournament"

### Entering Scores

1. Navigate to your tournament
2. Click "My Scorecard" tab (once tournament is active)
3. Enter strokes for each hole
4. Submit to update the leaderboard in real-time

### Viewing the Leaderboard

- Leaderboard updates automatically as players submit scores
- Filter by All, Front 9, Back 9, or Completed
- See rankings, scores, and recent hole results
- Color-coded scoring (eagles, birdies, pars, bogeys)

## 🔐 Security

### Firestore Rules

The app includes comprehensive security rules:

- Users can only edit their own profiles
- Tournament hosts can manage their tournaments
- Players can submit scores for tournaments they've joined
- All users can view active tournaments and leaderboards

### Authentication

- Email/password authentication with Firebase Auth
- Google OAuth integration
- Protected routes require authentication
- User data stored securely in Firestore

## 🎨 Customization

### Adding Custom Courses

Edit `lib/mockData.ts` to add new courses:

```typescript
export const yourCourse: Course = {
  courseId: 'your-course-id',
  name: 'Your Course Name',
  location: 'City, State',
  totalPar: 72,
  holes: [
    { hole: 1, par: 4, distance: 400, handicap: 10 },
    // ... add all 18 holes
  ],
};
```

### Styling

The app uses Tailwind CSS for styling. Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
},
```

## 📊 Data Model

### Users
```typescript
{
  uid: string;
  name: string;
  email: string;
  handicap?: number;
  tournaments: string[];
}
```

### Tournaments
```typescript
{
  id: string;
  name: string;
  hostId: string;
  courseId: string;
  type: 'stroke-play' | 'match-play' | 'scramble' | 'best-ball' | 'alternate-shot';
  players: TournamentPlayer[];
  startDate: Date;
  holes: 9 | 18;
  status: 'pending' | 'active' | 'completed';
  joinCode: string;
}
```

### Scores
```typescript
{
  id: string;
  tournamentId: string;
  playerId: string;
  hole: number;
  strokes: number;
  par: number;
  timestamp: Date;
}
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 🛠️ Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Testing

Test the app with multiple users:

1. Open the app in different browsers
2. Sign in as different users
3. Create a tournament with one user
4. Join with another using the code
5. Submit scores and watch real-time updates

## 🐛 Troubleshooting

### Firebase Connection Issues

- Verify all environment variables are set correctly
- Check Firebase Console for any errors
- Ensure Firestore rules are deployed

### Real-time Updates Not Working

- Check browser console for errors
- Verify Firestore indexes are deployed
- Ensure you're authenticated

### Authentication Errors

- Clear browser cache and cookies
- Check Firebase Authentication is enabled
- Verify authorized domains in Firebase Console

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, please open an issue on GitHub or contact the maintainers.

## 🙏 Acknowledgments

- Course data based on real-world golf courses
- Built with Next.js and Firebase
- Inspired by modern golf tournament management needs

---

Built with ⛳ and passion for golf
