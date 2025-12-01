# EduAI Solver - AI-Powered Educational Assistant


**EduAI Solver** is an AI-powered mobile learning companion built with React Native and Expo. It leverages Google's Gemini AI to help students solve problems, generate study materials, and track their learning progress.

---

### 1. **Project Overview & Problem Statement**
- **Problem Solved**: Students often struggle to get instant help with homework, practice questions, and creating effective study materials
- **Solution**: An all-in-one mobile app that uses AI to answer questions, extract text from images, generate personalized flashcards and quizzes, and track learning progress
- **Target Users**: Students, learners, educators who need quick AI assistance for educational content

### 2. **High-Level Architecture**
```
┌─────────────────┐
│  React Native   │
│   Mobile App    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐ ┌──▼─────────┐
│Firebase│ │  Gemini AI │
│Backend │ │  Services  │
└────────┘ └────────────┘
```

### 3. **Key Technical Highlights**
- **Cross-platform**: Single codebase for iOS and Android using React Native + Expo
- **Modern AI Integration**: Google Gemini for text generation and vision
- **Backend**: Firebase Authentication and Firestore for user data
- **State Management**: Zustand for lightweight, efficient global state
- **Navigation**: React Navigation with native stack navigator

---

## 🚀 Core Features

### 1️⃣ **AI Question Answering**
- Type or speak questions to get instant AI-powered answers
- Supports complex academic problems (math, science, literature, etc.)
- Displays formatted answers with proper markdown rendering
- Source: `src/screens/AskQuestion/AskScreen.tsx`, `src/services/ai/providers/gemini.ts`

### 2️⃣ **OCR Scanner (Image-to-Text)**
- Scan textbook problems or handwritten notes using your camera
- Extracts text using Gemini Vision API
- Automatically populates the question field for AI solving
- Implementation: `src/screens/AskQuestion/OCRScannerScreen.tsx`, `src/services/ocr/tesseractService.ts`

### 3️⃣ **AI Flashcard Generator**
- Generate custom flashcard sets on any subject/topic
- Configurable number of cards (5-20)
- Save flashcards to Firebase for later study
- Flip cards with smooth animations
- Source: `src/services/ai/flashcardGenerator.ts`, `src/screens/Flashcards/`

### 4️⃣ **AI Quiz Generator**
- Create multiple-choice quizzes on demand
- Adjustable difficulty (Easy, Medium, Hard)
- Configurable number of questions
- Real-time score tracking and results
- Source: `src/services/ai/quizGenerator.ts`, `src/screens/Quizzes/`

### 5️⃣ **Progress Tracking**
- Track quizzes taken, questions answered, and average scores
- XP (experience points) system
- Visual stats dashboard with color-coded cards
- Recent quiz history with detailed breakdowns
- Implementation: `src/screens/Progress/ProgressScreen.tsx`, `src/services/firebase/firestoreService.ts`

### 6️⃣ **User Authentication**
- Email/password registration and login via Firebase Auth
- Guest mode for trying features without registration
- Secure session management
- Source: `src/screens/Auth/`, `src/services/firebase/authService.ts`

### 7️⃣ **Persistent Storage**
- All flashcards and quiz history stored in Firebase Firestore
- Offline-first architecture with graceful degradation
- Collections: `flashcard_sets`, `quiz_history`, `progress`, `users`

---

## 🏗️ Project Architecture & Design Decisions

### Directory Structure
```
src/
├── config/           # Environment & Firebase configuration
├── navigation/       # React Navigation setup
├── screens/          # UI screens organized by feature
│   ├── AI/           # Answer display & provider selection
│   ├── AskQuestion/  # Question input & OCR scanner
│   ├── Auth/         # Login & registration
│   ├── Flashcards/   # Flashcard CRUD operations
│   ├── Home/         # Main dashboard
│   ├── Profile/      # User profile
│   ├── Progress/     # Stats and progress tracking
│   └── Quizzes/      # Quiz setup & gameplay
├── services/         # Business logic & API integrations
│   ├── ai/           # AI providers & orchestration
│   │   ├── orchestrator/  # AI provider routing
│   │   └── providers/     # Gemini implementation
│   ├── firebase/     # Auth & Firestore services
│   └── ocr/          # OCR text extraction
├── store/            # Zustand global state
└── utils/            # Helper functions
```

## 🛠️ Development Challenges & Solutions

### Challenge 1: **Expo + Firebase SDK Compatibility**
**Problem**: React Native Firebase doesn't work well with Expo managed workflow
- **Solution**: Used web Firebase SDK instead (compatible with Expo)
- **Trade-off**: Slightly larger bundle size, but much simpler setup

### Challenge 2: **Gemini API CORS Issues**
**Problem**: Browser-based Gemini SDK had CORS errors in React Native
- **Solution**: Used direct REST API calls with `fetch()` instead of SDK
- **File**: `src/services/ocr/tesseractService.ts`
- **Learning**: Always check if library is React Native compatible

### Challenge 3: **OCR Accuracy**
**Initial Attempt**: Used Tesseract.js for offline OCR
- **Issue**: Poor accuracy on handwritten text and complex layouts
- **Pivot**: Switched to Gemini Vision API (much better accuracy)
- **Code Change**: Updated `tesseractService.ts` to use Gemini instead

### Challenge 4: **Markdown Rendering in React Native**
**Problem**: Native `Text` component doesn't support markdown
- **Solution**: Integrated `react-native-markdown-display`
- **Use Case**: Answer screen displays formatted AI responses
- **File**: `src/screens/AI/AnswerScreen.tsx`

### Challenge 5: **Async State Management**
**Issue**: Race conditions when loading flashcards/quizzes
- **Solution**: Used `useEffect` with proper dependencies and loading states
- **Pattern**: Set `loading=true` → fetch data → update state → set `loading=false`

### Challenge 6: **Image Picker + Base64 Encoding**
**Problem**: `expo-image-picker` returns local URI, but Gemini API needs base64
- **Solution**: Used `expo-file-system` to read and encode images
- **Code**: 
```typescript
const imageData = await FileSystem.readAsStringAsync(imageUri, {
  encoding: "base64",
});
```

---

## 📦 Feature Evolution Timeline

### Commit 1: **Initial Setup** (`8206391`)
- Created Expo TypeScript project
- Set up navigation structure
- Added basic screens (Home, Ask, Profile)

### Commit 2: **Firebase Integration** (`9892af5`)
- Implemented authentication (Login/Register)
- Connected Firestore for data persistence
- Updated navigation to start with Login screen

### Commit 3: **AI Features** (`c16cf43`)
- Integrated Gemini AI for question answering
- Built flashcard generator with configurable options
- Added quiz generator with difficulty levels
- Implemented OCR scanner using Gemini Vision

### Commit 4: **Polish & Optimization** (`2423fb6`)
- Added progress tracking screen
- Implemented XP system and stats dashboard
- Fixed environment configuration issues
- Added loading states and error handling

### Files Added Over Time:
- **Phase 1**: Navigation, screens, basic UI
- **Phase 2**: Firebase services, auth screens
- **Phase 3**: AI orchestrator, Gemini provider, OCR
- **Phase 4**: Progress tracking, Firestore integration, state management

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React Native 0.81.5 | Cross-platform mobile development |
| **Development Platform** | Expo ~54.0 | Tooling, build, and deploy infrastructure |
| **Language** | TypeScript | Type safety and better DX |
| **Navigation** | React Navigation v6 | Screen routing and navigation |
| **UI Components** | React Native Core + Expo modules | Native UI primitives |
| **Styling** | StyleSheet API + LinearGradient | Component styling |
| **State Management** | Zustand | Lightweight global state (user auth) |
| **Backend** | Firebase Auth + Firestore | Authentication and database |
| **AI Provider** | Google Gemini 2.0 Flash | Text generation and vision OCR |
| **HTTP Client** | Fetch API | REST API calls |
| **Markdown Rendering** | react-native-markdown-display | Formatted text display |
| **Image Handling** | expo-image-picker + expo-file-system | Camera access and file I/O |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/harshitnitjsr/better_software.git
cd better_software
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure API Keys**
Edit `src/config/env.ts`:
```typescript
export const GEMINI_API_KEY = "your_actual_gemini_key_here";
export const FIREBASE_CONFIG = {
  apiKey: "your_firebase_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your_app_id"
};
```

4. **Get API Keys**
- **Gemini**: https://makersuite.google.com/app/apikey
- **Firebase**: https://console.firebase.google.com → Create project → Add web app

5. **Firebase Setup**
- Enable Email/Password authentication
- Create Firestore database (start in test mode)
- Add security rules (see Technical Debt section)

6. **Run Development Server**
```bash
npm start
# or
npx expo start
```

7. **Launch on Device**
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

---

## 📱 Usage

### Quick Start Flow:
1. **Register/Login** → Create account or skip login
2. **Home Screen** → Six feature cards displayed
3. **Ask Question** → Type question → Get AI answer
4. **Scan Image** → Open camera → Capture text → Auto-solve
5. **Create Flashcards** → Choose subject → Generate AI cards → Save
6. **Take Quiz** → Select topic/difficulty → Answer questions → See score
7. **View Progress** → Check stats, XP, and quiz history

---

## 🔐 Security Considerations

### Current Implementation:
- ✅ Firebase Authentication for user identity
- ✅ Firestore rules needed
---


## 📞 Contact

**Developer**: Harshit Shrivastav  
**GitHub**: [@harshitnitjsr](https://github.com/harshitnitjsr)  
**Project**: [better_software](https://github.com/harshitnitjsr/better_software)

---

## 🎯 Future Roadmap

- [ ] Voice input for questions (speech-to-text)
- [ ] Dark mode UI theme
- [ ] Parent/teacher dashboard for progress monitoring
- [ ] Multi-language support (i18n)

---
