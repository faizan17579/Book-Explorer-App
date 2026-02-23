# Book Explorer – React Native App

A mobile app to explore books, search by title or author, and view details with ratings. Built with **React Native**, **Expo**, and **TypeScript**.

## Requirements Met

| Requirement | Implementation |
|-------------|----------------|
| Book information | **Google Books API** – title, author, publication year, cover image, description |
| User ratings | **Google Books** (average rating, review count) + **NYTimes Books API** (bestseller status) |
| Search | Search bar with dynamic results as you type (debounced) |
| Error handling | Network, rate limit, and server error messages |
| Testing | Unit tests for bookService, nytService, BookCard |
| Android | Runs on Android via Expo; APK build steps below |

## APIs Used

- **Google Books API** – Book search and details. No API key.
- **NYTimes Books API** – Bestseller lists. Optional; needs free API key for bestseller badges.

## Setup

```bash
git clone <repository-url>
cd Shadiyana
npm install
```

### NYTimes Bestseller badges (optional)

1. Get a key: [developer.nytimes.com](https://developer.nytimes.com)
2. Create `.env` in project root:
   ```
   EXPO_PUBLIC_NYT_API_KEY=your-api-key
   ```
3. Restart: `npm start`

## Run

```bash
npm start
```

- Press **a** for Android emulator  
- Press **i** for iOS simulator  
- Scan QR code with Expo Go on a physical device

## Test

```bash
npm test
```

## Build APK (Android)

1. Install EAS CLI (one time):
   ```bash
   npm install -g eas-cli
   ```
2. Log in: `eas login`
3. Build APK:
   ```bash
   eas build --platform android --profile preview
   ```
4. Or local build with Expo:
   ```bash
   npx expo run:android
   ```
   Then use Android Studio to build a signed APK, or run `eas build` for a downloadable APK.

## Project structure

```
src/
  components/     BookCard
  screens/       HomeScreen, BookDetailScreen
  services/      bookService (Google Books), nytService (NYTimes)
  types/         Book, BestsellerInfo
```

## Deliverables

- **Code**: This repository (organized and documented)
- **README**: This file (setup and usage)
- **Video**: Record the app (search, open a book, show ratings and bestseller badge)
- **APK**: Build with `eas build --platform android --profile preview` and share the download link
