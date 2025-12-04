# 📸 Social Media Platform – MERN Stack

A full-stack **Instagram-style Social Media Application** built as part of my internship task.  
Users can create accounts, upload photos/videos, like & comment on posts, follow other users, chat in real time, and receive live notifications.

---

## 🚀 Features

### 👤 Authentication & Profiles
- User registration & login (JWT + HTTP-only cookies)
- Secure password hashing using **bcrypt**
- Edit profile: bio, gender, profile picture (Cloudinary)
- View other user profiles and their posts

### 🖼️ Posts & Feed
- Create posts with **image/video upload** (Cloudinary + Multer + Sharp)
- View all posts in feed (latest first)
- View posts by specific user
- Post details modal (Instagram-like UI)
- Delete own posts

### 💬 Social Interactions
- Like / Unlike posts
- Comment on posts
- Bookmark / Save posts
- View saved posts in profile
- Tag users (tagged posts section)

### 🔔 Notifications
- Real-time notifications for:
  - Likes
  - Comments
  - Follows
- Notification page grouped by time: New / Today / This week / This month

### 🧑‍🤝‍🧑 Follow System
- Follow / Unfollow users
- Followers / Following count on profile
- “Follow Back” button from notification screen

### 💬 Real-Time Chat
- One-to-one private chat
- Real-time messaging using **Socket.io**
- Online / offline status indicator
- Auto-scroll to latest message
- Image sending support (optional backend endpoint)

### 🧱 Tech Stack

**Frontend**
- React + Vite  
- Redux Toolkit (auth, posts, chat, notifications)  
- Tailwind CSS + shadcn/ui  
- Axios for API calls  
- Socket.io-client for real-time features  

**Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication  
- Multer + Sharp + Cloudinary for media  
- Socket.io server for chat & notifications  

---

## 📁 Project Structure

```bash
root
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── models
│   │   ├── middlewares
│   │   ├── socket
│   │   └── utils
│   └── .env
└── frontend
    ├── src
    │   ├── components
    │   ├── redux
    │   ├── hooks
    │   └── pages
    └── .env
```
## ⚙️ Environment Variables
### Backend – backend/.env

```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.<id>.mongodb.net/
PORT=3000
SECRET_KEY=your_jwt_secret_key
URL=http://localhost:5173
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

```
### Frontend – frontend/.env
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```
## 🛠️ Setup & Installation

### 1️⃣ Backend Setup
```bash
  cd backend
  npm install
  npm run dev
```
### 2️⃣ Frontend Setup
```bash
  cd frontend
  npm install
  npm run dev
```


