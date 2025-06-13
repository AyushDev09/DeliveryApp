# Location-Based Delivery Tracker App (Android)

A React Native CLI app for Android that simulates a delivery service with real-time tracking of the delivery partner’s location, including background location updates and push notifications.

---

## 🚀 Project Overview

This app allows users to:

- Sign up and log in using email/password authentication (Firebase).
- Place mock delivery orders from a sample product list.
- Track the delivery partner’s live location on a map with real-time updates.
- Receive push notifications about delivery status (e.g., out for delivery, nearby).
- Track the delivery partner's location even when the app is running in the background.

---

## 🎯 Core Features

- **User Authentication:** Email/password sign-in using Firebase Authentication.
- **Order Placement:** Simulated order placement from a mock product catalog.
- **Live Location Tracking:** Real-time delivery partner location updates via Socket.IO, visualized on an interactive map (`react-native-maps`).
- **Background Location Updates:** Location tracking continues when the app is backgrounded.
- **Push Notifications:** Delivery status updates delivered via Firebase Cloud Messaging.
- **State Management:** Zustand for app state and order persistence.

---

## 🛠️ Technical Stack & Requirements

- React Native CLI (Not Expo)
- Android only (no iOS support currently)
- TypeScript recommended for better maintainability (project currently in JS, can be migrated)
- Maps: `react-native-maps`
- Real-time communication: Node.js backend with Socket.IO (or Firebase alternative)
- Push Notifications: Firebase Cloud Messaging (`react-native-push-notification` recommended)
- Permissions handling for background location tracking (Android)
- State management: Zustand

---

## ⚙️ Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd your-project-folder

