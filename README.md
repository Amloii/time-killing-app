# Fight Mode - Mobile Task Management App

A powerful mobile task management application built with React, TypeScript, and Capacitor. Transform your productivity with battle-themed task completion sessions.

## Features

- **Battle Mode**: Time-boxed focused work sessions
- **Task Management**: Create, organize, and track tasks
- **Task Chopping**: Break down complex tasks into smaller subtasks using AI
- **Statistics**: Track your productivity and completion rates
- **Mobile-First**: Native mobile app experience with haptic feedback
- **Offline Support**: Works without internet connection
- **Cross-Platform**: Available for iOS and Android

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Mobile**: Capacitor 5
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- For iOS development: Xcode 14+
- For Android development: Android Studio

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fight-mode
```

2. Install dependencies:
```bash
npm install
```

3. Build the web app:
```bash
npm run build
```

4. Initialize Capacitor (first time only):
```bash
npm run cap:init
```

5. Add mobile platforms:
```bash
npm run cap:add:android
npm run cap:add:ios
```

### Development

#### Web Development
```bash
npm run dev
```

#### Mobile Development

1. Build and sync:
```bash
npm run mobile:build
```

2. Open in native IDE:
```bash
# For Android
npm run cap:open:android

# For iOS
npm run cap:open:ios
```

3. Run on device/emulator:
```bash
# For Android
npm run cap:run:android

# For iOS
npm run cap:run:ios
```

## Mobile Features

### Native Capabilities
- **Haptic Feedback**: Tactile feedback for user interactions
- **Status Bar**: Customized status bar styling
- **Splash Screen**: Branded loading screen
- **Keyboard Management**: Optimized keyboard behavior
- **Safe Area**: Proper handling of device safe areas
- **Native Storage**: Optimized data persistence

### Performance Optimizations
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Efficient resource loading
- **Touch Optimizations**: Responsive touch interactions
- **Memory Management**: Efficient state management

## Building for Production

### Web Build
```bash
npm run build
```

### Android Build
1. Open Android Studio: `npm run cap:open:android`
2. Build → Generate Signed Bundle/APK
3. Follow the signing process

### iOS Build
1. Open Xcode: `npm run cap:open:ios`
2. Product → Archive
3. Follow the App Store submission process

## Configuration

### Capacitor Configuration
Edit `capacitor.config.ts` to customize:
- App ID and name
- Splash screen settings
- Status bar configuration
- Plugin settings

### Environment Variables
Create `.env` file for:
- API keys
- Build configurations
- Feature flags

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile
5. Submit a pull request

## License

MIT License - see LICENSE file for details