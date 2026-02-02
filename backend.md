# Rewind Technical Blueprint & System Architecture

This document provides an exhaustive technical overview of the Rewind application's internal logic, data lifecycle, and integration strategies.

---

## 1. System Architecture Overview

Rewind is a **Client-Side Progressive Web Application** that operates as an orchestration layer between the user's browser, the Spotify Web API, and Google's Gemini AI. 

### Core Components:
1.  **Frontend (React/Vite)**: Handles the UI/UX, state management via `AuthContext`, and data visualization.
2.  **Telemetry Engine (Spotify Service)**: Manages OAuth sessions and performs multi-endpoint data aggregation.
3.  **Intelligence Layer (Gemini Service)**: Transforms raw sonic data into psychological narratives using LLM inference.
4.  **Persistence Layer (LocalStorage)**: Implements a sophisticated caching and TTL (Time-To-Live) strategy to respect API rate limits and reduce token consumption.

---

## 2. Authentication Flow (Spotify OAuth)

Rewind utilizes the **Implicit Grant Flow** to maintain a serverless architecture.

1.  **Authorization Request**: The app redirects the user to `accounts.spotify.com/authorize` with a unique `client_id` and the required scopes (`user-top-read`, `user-read-private`).
2.  **Callback Processing**: Upon approval, Spotify redirects back to the `REDIRECT_URI` with an `access_token` in the URL fragment (`#`).
3.  **Token Extraction**: `spotifyAuth.getTokenFromUrl()` parses the hash, stores the token in `localStorage`, and cleans the URL via `window.history.replaceState`.
4.  **Session Refresh**: If a token is found in `localStorage` on mount, the app attempts to re-validate the session by fetching the user's profile.

---

## 3. Troubleshooting & Local Development

### Common Error: `unsupported_response_type`
If clicking "Connect to Spotify" redirects you to a URL containing `#error=unsupported_response_type`, follow these steps:

1.  **Enable Implicit Grant**: 
    - Login to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
    - Open your specific App/Project.
    - Click **Settings** (or Edit).
    - Scroll down to the "Which API are you planning to use?" or "Redirect URIs" section.
    - Look for **"Implicit Grant"** and ensure it is checked/enabled.
2.  **Verify Redirect URI**:
    - Ensure your dashboard has `http://127.0.0.1:3000/` (or your specific local URL) listed exactly as a Redirect URI.
    - Note: `http://localhost:3000/` is technically different from `http://127.0.0.1:3000/`. Match them exactly.
3.  **Client ID**:
    - Ensure the `CLIENT_ID` in `services/spotifyService.ts` matches the "Client ID" visible on your Spotify Dashboard.

---

## 4. Data Pipelines (The Dual-Track Sync)

Rewind operates two distinct data pipelines that work in tandem but are throttled differently.

### A. The Telemetry Pipeline (The "Stats" Track)
*Triggered: On login or every 12 hours.*

1.  **Parallel Aggregation**: The system fires 7 simultaneous requests to Spotify to fetch Profile data and Top Artists/Tracks across three time ranges (4 Weeks, 6 Months, 12 Months).
2.  **Audio Feature Extraction**: The system takes the IDs of the top 50 recent tracks and requests their "Audio Features" (a proprietary Spotify dataset including `energy`, `danceability`, `valence`, etc.).
3.  **Normalization**: Raw Spotify objects are mapped to a flat, internal schema (`formatSpotifyItem`) to ensure UI consistency.
4.  **Sonic DNA Calculation**: The system calculates the **Arithmetic Mean** of audio features across the top 50 tracks to generate the user's "Average Sonic Profile."

### B. The Intelligence Pipeline (The "AI Report" Track)
*Triggered: Explicitly by the user or every 24 hours.*

1.  **Data Payload Preparation**: The system extracts a subset of the Telemetry (Top 15 artists, Top 10 genres, and the Sonic DNA averages).
2.  **AI Inference (Gemini 3 Flash)**: This payload is wrapped in a "Musicologist System Instruction" and sent to Gemini.
3.  **Archetype Mapping**: Gemini selects one of the 8 pre-defined archetypes (defined in `data/archetypes.ts`) and generates a narrative justifying that selection.
4.  **Structured JSON Output**: Using a strict `responseSchema`, Gemini returns a structured object that is then enriched with UI assets (icons and background text) before being cached.

---

## 5. State Machine & Caching Strategy

The `AuthContext` acts as a state machine with the following statuses:
-   `IDLE`: Waiting for user action.
-   `THROTTLED`: Request blocked by the 12h/24h cooldown timer.
-   `TRAFFIC_ERROR`: Handling Spotify's 429 (Too Many Requests) error.
-   `SUCCESS`: Pipeline completed, UI updated.
-   `ERROR`: General failure (Network, Auth, or Inference).

### Cooldown Logic:
-   **Telemetry TTL**: 12 Hours (`COOLDOWN_TELEMETRY`).
-   **Intelligence TTL**: 24 Hours (`COOLDOWN_REPORT`).
-   **Bypass**: Developers can bypass these throttles via the "Dev Console" floating in the UI.

---

## 6. Detailed Data Schemas

### I. Telemetry Input (What we send to AI)
```json
{
  "artists": "The Weeknd, Lana Del Rey, Tame Impala...",
  "genres": "indie pop, synth-pop, dream pop...",
  "audioFeatures": {
    "energy": 0.72,
    "danceability": 0.65,
    "valence": 0.58,
    "acousticness": 0.23,
    "instrumentalness": 0.15,
    "speechiness": 0.08
  }
}
```

---

## 7. Error Handling Strategy

1.  **Expired Tokens (401)**: The `spotifyFetch` wrapper automatically clears the token from storage and sets the app status to `ERROR`, prompting a re-login.
2.  **Rate Limiting (429)**: The app detects the `Retry-After` header or status code and sets the state to `TRAFFIC_ERROR`, displaying a non-intrusive warning banner.
3.  **Network Resilience**: The `LoadingScreen` implements a timeout and retry logic for the initial boot sequence.
