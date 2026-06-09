# 🎓 University Student Information System (USIS)

A comprehensive web-based platform designed to streamline academic and administrative processes within a university environment. The system provides role-based access for Students, Mentors, and Administrators, enabling efficient management of academic records, attendance, grievances, communication, and more.

## 🚀 Live Demo

### Frontend

https://student-information-system-inky.vercel.app

### Backend API

https://student-information-system-1-hmtf.onrender.com

---

## 📌 Features

### 👨‍🎓 Student Portal

* Student Dashboard
* Attendance Tracking
* Grade Management
* Grievance Submission
* Real-Time Chat System
* Academic Performance Monitoring

### 👨‍🏫 Mentor Portal

* Student Progress Monitoring
* Attendance Management
* Grade Assignment & Updates
* Grievance Resolution
* Student Communication

### 👨‍💼 Administrator Portal

* User Management
* System Administration
* Academic Record Management
* Grievance Oversight
* Real-Time Notifications

### 💬 Real-Time Features

* Socket.IO Integration
* Instant Messaging
* Live Notifications
* Real-Time Updates

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Tailwind CSS
* Lucide React Icons
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT Authentication
* MongoDB / MongoDB Memory Server

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

```bash
Student-Information-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Hariomxlx/Student-information-System.git
cd Student-information-System
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Demo Credentials

### Student

```text
Email: student@usis.edu
Password: password123
```

### Mentor

```text
Email: mentor@usis.edu
Password: password123
```

### Administrator

```text
Email: admin@usis.edu
Password: password123
```

---

## 🌐 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=https://student-information-system-1-hmtf.onrender.com
```

### Backend (.env)

```env
PORT=5000
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection_string
```

---

## 📸 Screenshots

Add screenshots of:

* Login Page
* Student Dashboard
* Mentor Dashboard
* Admin Dashboard
* Grievance System
* Chat Module

---

## 🔒 Authentication

* JWT-Based Authentication
* Role-Based Access Control
* Protected Routes
* Secure API Endpoints

---

## 🚀 Future Enhancements

* Email Notifications
* AI-Based Student Analytics
* Mobile Application
* Document Upload System
* Advanced Reporting Dashboard
* Cloud Database Integration

---

## 👨‍💻 Developed By

**Hariom Kumar**

GitHub: https://github.com/Hariomxlx

---

## 📜 License

This project is developed for educational and academic purposes.
