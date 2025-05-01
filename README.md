
# 🏢 Virtual Office Video Call Web App

A real-time virtual office web application where users can move avatars in a shared space and initiate peer-to-peer video calls using WebRTC.

## 🚀 Project Overview

This project simulates a virtual office environment where:

* Users can move around a 2D map using keyboard controls (WASD).
* Each user's position is synced across all clients using a real-time database.
* Users can start a video call with others in the same virtual space using WebRTC.

The project was developed as part of an 8-week fellowship focused on learning real-time technologies, WebSocket communication, and WebRTC.

---

## 🛠️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Realtime Database:** Firebase Realtime Database
* **Communication:** WebSocket (Signaling), WebRTC (Video Calls)
* **Hosting:** Firebase Hosting / Local server

---

## 🧪 Running the Code

1. Go to the GitHub link: [https://github.com/kasturi-23/Virtual_office_Web_App](https://github.com/kasturi-23/Virtual_office_Web_App)
2. You’ll see 2 directories: client and server
3. Go to the server directory:
   ```bash
   cd server
   ```
4. Install all dependencies:
   ```bash
   npm install
   ```
5. Go to server source directory:
   ```bash
   cd src
   ```
6. Start your backend server:
   ```bash
   node index.js
   ```
   You should see: `Server is running on port 8080`
7. Keep the server running and open a new terminal
8. Go to client directory:
   ```bash
   cd oa_virtoffice_project/client
   ```
9. Install all dependencies:
   ```bash
   npm install
   ```
10. Build frontend code:
    ```bash
    npm run-script build
    ```
11. Start your frontend server:
    ```bash
    serve -s build
    ```
12. Open [http://localhost:3000/](http://localhost:3000/) in a browser

---

## 📆 Week-by-Week Progress

* **Week 1:** WASD character movement implemented
* **Week 2:** Firebase Realtime Database integration
* **Week 3:** Real-time UI updates
* **Week 4-6:** WebSocket and WebRTC integration
* **Week 7-8:** Final testing and presentations

---

## 🔑 Features

* 🧍 Real-time user movement in a shared map
* 📡 Firebase-based state management
* 🎥 WebRTC-based peer-to-peer video calling
* 🔔 Real-time updates using WebSocket signaling

---

## 📸 Demo

> *[Add a screenshot or screen recording link here]*

---

## 🧩 Folder Structure

> *[Add folder structure here]*

---

## 🌐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                Virtual Office Web App                                │
├─────────────────┬─────────────────┬───────────────────┬─────────────────┬────────────┤
│   Client (UI)   │  Firebase RTDB  │  WebSocket Server │  WebRTC Peers   │  Signaling │
└────────┬────────┴────────┬────────┴─────────┬─────────┴────────┬────────┴─────┬──────┘
         │                 │                  │                   │              │
         │ 1. Position Sync│ 2. Presence      │ 3. Signaling      │ 4. Media     │
         │    (HTTP)       │ Updates (WS)     │ (WS)              │ Streams (P2P)│
         ▼                 ▼                  ▼                   ▼              ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  Internet/Network                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Code Architecture

### Client-Side Components:

* **UI Layer**: Renders the 2D map, avatars, and video elements
* **Movement Controller**: Processes WASD input and updates local position
* **Firebase Adapter**: Connects to Firebase Realtime Database
* **WebRTC Manager**: Handles peer connections, streams, and call setup
* **Signaling Client**: Sends/receives signaling messages through WebSocket

### Server-Side Components:

* **Firebase RTDB**: Syncs and stores user positions
* **WebSocket Server**: Relays WebRTC signaling messages

---

## 🌐 Network Protocols

* **HTTP/HTTPS**: Initial page load, Firebase REST
* **WebSockets**: Real-time signaling
* **WebRTC**:
  * ICE (STUN/TURN) – NAT traversal
  * SDP – Session Description
  * DTLS-SRTP – Secure media transfer

---

## 🔄 Data Flow

### Position Sync:
Client A → [WASD Input] → Firebase RTDB → All Clients

### Video Call:
Client A → Offer → WebSocket Server → Client B → Answer → WebSocket Server → Client A → ICE candidates exchanged → Peer-to-Peer media flow

---

## 📦 Key Technical Interactions

### Firebase:
* Real-time sync via `onValue` listeners
* Data at `/users/{userId}/position{x, y}`

### WebRTC Setup:
```javascript
1. createPeerConnection();
2. createOffer() → setLocalDescription();
3. sendOfferViaWebSocket();
4. receiveAnswer() → setRemoteDescription();
5. ICE candidate exchange
```

### Signaling Server:
* WebSocket relays:
  * Offers
  * Answers
  * ICE candidates
  * Presence messages

---

## ⚙️ Why This Architecture Works

### Scalability:
* Firebase handles state sync
* Media traffic is offloaded to WebRTC

### Latency Optimization:
* Firebase gives low-latency sync
* Media doesn’t route via server

### Cost Efficiency:
* No media server cost
* Firebase’s free tier is often enough

---

## 🔍 Potential Improvements

* Add lightweight auth/room backend
* Use quadtree for sync optimization
* Add TURN servers for strict NATs
* Explore WebTransport for future-proofing

---

