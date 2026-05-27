# Unified Student Information System (USIS)

USIS is a modern, full-stack educational management web application designed to centralize and streamline student data. Built with a sleek, dark-mode glassmorphism aesthetic, USIS provides students and mentors with an intuitive portal for tracking attendance, managing grades, and facilitating real-time communication.

## 🌟 Features

- **Professional Dashboard:** Interactive analytics using Recharts to visualize attendance and academic performance.
- **Academic Tracking:** Monitor current courses, GPA trends, completed credits, and class rankings.
- **Real-Time Chat Engine:** Instant messaging between students and mentors utilizing WebSockets (Socket.io).
- **Interactive Calendar:** Manage schedules, upcoming exams, assignment deadlines, and mentor meetings.
- **Smart Alert System:** Automated push notifications and alerts triggered when attendance drops below the 75% threshold.
- **Secure Authentication:** JWT-based login and registration system with role-based access control (Student, Mentor, Admin).
- **Premium UI/UX:** Fully responsive interface built with Tailwind CSS, featuring glassmorphism elements, neon accents, and smooth micro-animations.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router v6
- Recharts (Data Visualization)
- Lucide React (Icons)
- Socket.io-client

**Backend:**
- Node.js & Express
- MongoDB (In-Memory Server for Demo)
- Mongoose
- Socket.io (WebSockets)
- JSON Web Token (JWT)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Backend Setup
Navigate to the backend directory and start the server:
```bash
cd backend
npm install
npm run dev
```
*Note: The backend automatically spins up an in-memory MongoDB instance, so no local database setup is required.*

### 2. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
- Open your browser and navigate to `http://localhost:5173`
- Use the **Login** page to sign in as a student or mentor.
- Explore the **Dashboard**, **Academics**, **Calendar**, and **Messages** modules.

