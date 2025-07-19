# MERN Blog Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog application with authentication, image uploads, comments, pagination, and more.

---

## 🚀 Features
- User registration and login (JWT authentication)
- Create, edit, delete, and view blog posts
- Upload and display featured images for posts
- Add and view comments on posts
- Category filtering and search
- Pagination for post lists
- Protected routes for authenticated users
- Responsive, modern UI

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```
git clone <git@github.com:PLP-MERN-Stack-Development/week-4-mern-integration-assignment-alvn2.git>
cd <week-4-mern-integration-assignment>
```

### 2. Server Setup
```
cd server
npm install
# Copy .env.example to .env and fill in your values
cp .env.example .env
npm run dev
```

### 3. Client Setup
```
cd client
npm install
npm run dev
```

The client will run on `http://localhost:5173` and the server on `http://localhost:5000` by default.

---

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Posts
- `GET /api/posts` — List posts (supports `page`, `limit`, `category`, `search`)
- `GET /api/posts/:id` — Get a single post
- `POST /api/posts` — Create post (auth required)
- `PUT /api/posts/:id` — Update post (auth required)
- `DELETE /api/posts/:id` — Delete post (auth required)
- `POST /api/posts/:id/comments` — Add comment (auth required)
- `POST /api/posts/upload` — Upload image (auth required, multipart/form-data)

### Categories
- `GET /api/categories` — List categories
- `POST /api/categories` — Create category (auth required)

---

## 🖼️ Screenshots

> Add screenshots of your app here (Home, Post Detail, Create Post, Register/Login, etc.)

---

## 📦 Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page views
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── context/        # Context providers
│   │   └── App.jsx         # Main app
│   └── package.json
├── server/                 # Express.js back-end
│   ├── config/             # Config files
│   ├── controllers/        # Controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Middleware
│   ├── uploads/            # Uploaded images
│   ├── server.js           # Server entry
│   └── package.json
└── README.md
```
## 📄 License
MIT 