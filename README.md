# 🌤️ Weather App

A full-stack weather application:

- **Search** current weather & 10-day forecast (via [WeatherAPI](https://www.weatherapi.com/))
- **Save** your search history to MongoDB and **view** it in-app
- **Map** climate overlays (heat, wind, rain, etc.) via OpenWeatherMap tile layers
- **Chat** with an AI assistant for “what to wear” & safety tips (powered by Groq LLM)
- **Export** your saved records as JSON, CSV, Markdown or XML

---

## 🗂️ Table of Contents

- [Features](#features)  
- [Architecture](#architecture)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Backend Setup](#backend-setup)  
  - [Mobile (Expo) Setup](#mobile-expo-setup)  
- [Running Locally](#running-locally)  
- [Demo via Expo Snack](#demo-via-expo-snack)  
- [API Endpoints](#api-endpoints)  
- [Environment Variables](#environment-variables)  
- [Dependencies](#dependencies)  
- [Contributing](#contributing)  
- [License](#license)  

---

## 🚀 Features

- **Weather Lookup**: City or ZIP → current + 10-day forecast  
- **History**: Save and revisit past lookups  
- **Climate Map**: Temperature/precipitation/UV overlays on an interactive map  
- **AI Assistant**: Outfit & safety tips based on live conditions  
- **Data Export**: Download your records as JSON, CSV, Markdown or XML  

---

## 🏛️ Architecture

- **Backend**:  
  - Node.js + Express  
  - MongoDB with Mongoose  
  - Routes: `/weather`, `/records`, `/assistant`  
  - AI: Groq LLM chat completions  
- **Frontend**:  
  - React Native + Expo  
  - React Navigation (Bottom Tabs + Drawer)  
  - Axios for REST calls  
  - Expo-Linear-Gradient, Vector-Icons, React-Native-Maps  

---

## 🛠️ Getting Started

### Prerequisites

- Node.js ≥ 14  
- npm or yarn  
- Expo CLI (optional if you use Snack)  
- A MongoDB Atlas cluster (or local MongoDB)  
- Accounts / API keys:  
  - [WeatherAPI](https://www.weatherapi.com/)  
  - [Groq LLM](https://console.groq.com/)  

---


# Setup & Usage Guide

## ⚙️ Configure Environment

Create a **`.env`** file in `backend/`:

```env
MONGODB_URI=<your MongoDB connection string>
WEATHERAPI_KEY=<your WeatherAPI key>
GROQ_API_KEY=<your Groq LLM key>
```

---

## 🖥️ Run the Server

```bash
cd backend
npm start
```

> By default the API listens on **`http://localhost:4000`**.

---

## 📱 Mobile (Expo) Setup

### Install & configure

```bash
cd mobile
npm install
```

Point the app at your backend – edit **`mobile/api/api.js`**

```js
export const BASE_URL = 'http://<YOUR_BACKEND_HOST>:4000';
```

### Start Expo

```bash
npx expo start
```

Open in **Expo Go** and scan the QR shown in your terminal/browser.

---

## ▶️ Running Locally

With **backend** and **Expo** both running:

1. **Weather** tab → search a city → view weather + stats.  
2. Tap **Save to History** → switch to **History** tab to see your records.  
3. **Map** tab → see location & climate overlay.  
4. **Assistant** tab → get AI outfit & safety tips.

---

## 📱 Demo via Expo Snack

_No installs required—runs in your browser or Expo Go._

**Snack URL:** exp://u.expo.dev/933fd9c0-1666-11e7-afca-d980795c5824?runtime-version=exposdk%3A53.0.0&channel-name=production&snack=%40alihaider132%2Fweather-app&snack-channel=7MHPbvcRS8
![image](https://github.com/user-attachments/assets/586e24ba-4304-4757-931c-638c3aef7938)

<details>
<summary>Dependencies to add in Snack</summary>

```
expo
react-native
@expo/vector-icons
@react-navigation/native
@react-navigation/bottom-tabs
@react-navigation/drawer
react-native-gesture-handler
react-native-safe-area-context
react-native-screens
expo-linear-gradient
axios
react-native-maps
groq-sdk
```
</details>

---

## 🔌 API Endpoints

### WeatherAPI Proxy

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/weather/forecast.json` | Proxy to WeatherAPI |

### Records (MongoDB)

| Method | Route |
| ------ | ----- |
| GET | `/records` |
| POST | `/records` |
| GET | `/records/:id` |
| PUT | `/records/:id` |
| DELETE | `/records/:id` |

### AI Assistant

```http
POST /assistant
```

**Request**

```json
{
  "locationName": "London",
  "temp": 15,
  "description": "Partly cloudy",
  "lat": 51.5,
  "lon": -0.1
}
```

**Response**

```json
{ "advice": "Wear a light jacket…" }
```

---

## ⚙️ Environment Variables

| Name | Description |
| ---- | ----------- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `WEATHERAPI_KEY` | WeatherAPI.com key |
| `GROQ_API_KEY` | Groq LLM key |
| `PORT` | *(optional)* Custom server port (default **4000**) |

---

## 📦 Dependencies

### Backend

```
express
mongoose
cors
helmet
dotenv
axios
groq-sdk
```

### Mobile

```
expo
react-native
@expo/vector-icons
@react-navigation/native
@react-navigation/bottom-tabs
@react-navigation/drawer
react-native-gesture-handler
react-native-safe-area-context
react-native-screens
expo-linear-gradient
axios
react-native-maps
groq-sdk
```

---

## 🤝 Contributing

1. **Fork** this repo  
2. `git checkout -b feat/your-feature`  
3. Commit & push → `git push origin feat/your-feature`  
4. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** – see `LICENSE` for details.
