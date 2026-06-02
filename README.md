# 🍽️ FoodBridge — AI-Driven Food Rescue Platform

**Full-stack AI-driven food rescue platform with real-time tracking, smart recommendations, and geospatial matching.**

FoodBridge is a modern web platform designed to reduce food waste by connecting **food donors** (restaurants, events, individuals) with **NGOs / volunteers** who can collect and redistribute surplus food efficiently.

The platform combines **AI-inspired recommendations, interactive maps, real-time updates, authentication, and role-based dashboards** to create a scalable food redistribution ecosystem.

---

## 🚀 Features

### 👥 Multi-Role Platform

FoodBridge supports two independent user roles:

#### 🏢 Donor Dashboard

* Create food donation listings
* Manage active listings
* View donation history & analytics
* Track claimed / collected food
* Impact tracking dashboard

#### 🤝 NGO Dashboard

* Discover nearby food donations
* Smart food recommendation system
* Claim food listings
* Track claims & collection timeline
* Live food activity feed

---

## 🧠 AI Recommendation Engine

FoodBridge includes a lightweight **AI-based recommendation system** to prioritize food listings intelligently.

The recommendation system considers:

* 📍 Distance from NGO
* ⚡ Urgency / freshness score
* 🍱 Available quantity
* 🎯 Smart weighted ranking

### Explainable AI Logic

Instead of using a black-box model, FoodBridge provides **transparent recommendation reasoning**, such as:

* *Highly urgent — immediate pickup recommended*
* *Very close to your location*
* *Large quantity available*

This makes recommendations interpretable and practical for real-time decision making.

---

## 🗺️ Geospatial Features

Interactive mapping experience powered by **React Leaflet**.

Features include:

* Live food location map
* Marker-based listings
* Interactive popups
* Claim actions directly from map
* Google Maps navigation integration
* Distance-based food discovery

---

## ⚡ Real-Time Updates

FoodBridge uses **Socket.IO** for real-time synchronization.

Users instantly receive:

* New food listing updates
* Live dashboard refresh
* Notification updates
* Dynamic activity feeds

---

## 🔐 Authentication & Security

Secure authentication system using:

* JWT Authentication
* Role-based protected routes
* Session management
* Access control (Donor / NGO)
* Secure login handling

---

## 📱 Responsive Mobile-First UI

Designed for modern devices with:

* Responsive dashboards
* Mobile navigation system
* Adaptive sidebar
* Mobile topbar UX
* Smooth animations & transitions
* Professional SaaS-style interface

---

## ✨ UI Highlights

* Modern landing page
* Glassmorphism inspired dashboard UI
* Animated cards & transitions
* Interactive sidebar
* Notification system
* AI-styled recommendation badges
* Premium responsive layout

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* TailwindCSS
* Framer Motion
* React Router DOM
* React Toastify
* React Icons
* React CountUp
* React Leaflet
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO

---

## 📂 Project Structure

```bash
FoodBridge/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   │   ├── donor/
│   │   └── ngo/
│   ├── api/
│   ├── utils/
│   └── socket/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/FoodBridge.git
cd FoodBridge
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

### Backend Setup

```bash
cd backend

npm install

npm run server
```

---

## 🔑 Environment Variables

Create a `.env` file inside backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key
```

---

## 🔮 Future Improvements

Planned upgrades:

* ML-powered recommendation model
* Route optimization & ETA system
* Advanced analytics dashboard
* Deployment pipeline
* Push notifications
* Dark mode
* Trust / reputation scoring system

---

## 💡 Problem Statement

Large quantities of edible food are wasted daily while communities continue facing food insecurity.

FoodBridge addresses this challenge by providing:

✔ Efficient donor-NGO matching
✔ Real-time coordination
✔ Intelligent prioritization
✔ Location-aware food discovery

---

## 🎯 Learning Outcomes

Through this project, key concepts explored include:

* Full-stack web development
* Authentication & authorization
* Real-time systems
* Geospatial applications
* AI-inspired recommendation logic
* Responsive UI engineering
* State management & API integration

---

## 👨‍💻 Author

**Rajnish Patel**

Computer Science Engineering Student

Passionate about building scalable full-stack systems, AI-driven applications, and impactful technology solutions.

---

## ⭐ Support

If you found this project interesting, consider giving it a **star ⭐**.
