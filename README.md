# EduNexus — EdTech Inquiry & CRM Platform

EduNexus is a full-stack EdTech Inquiry and Customer Relationship Management (CRM) platform designed to help educational institutions collect, manage, and track inquiries from parents, students, and schools.

## 🚀 Live Application

- **Frontend:** https://edunexus-sooty.vercel.app
- **Backend:** https://edunexus-backend-4fzx.onrender.com
- **Public Inquiry Form:** https://edunexus-sooty.vercel.app/inquiry
- **GitHub Repository:** https://github.com/guptaak1167-prog/edunexus

## ✨ Features

### Public Inquiry Form
- Submit inquiries without admin authentication.
- Select user type: Parent, Student, or School.
- Select inquiry category: Scholarship, Concert, Admission, or General Query.
- Collect name, email, phone number, and message.
- Store inquiry data in Supabase PostgreSQL.

### Admin Authentication
- Custom JWT-based authentication.
- Password hashing using bcrypt.
- Protected admin routes.
- HTTP-only authentication cookies.
- Login and logout functionality.

### Admin Dashboard
- View submitted inquiries.
- Search inquiries by name or phone number.
- Filter inquiries by category and user type.
- View inquiry details and submission dates.
- Update inquiry status.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | Supabase PostgreSQL |
| Authentication | JWT, bcrypt |
| API | REST API, Axios |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |

## 📁 Project Structure

```text
edunexus/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── config.js
│   ├── server.js
│   ├── create-admin.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── inquiries/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
├── schema.sql
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Local Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/guptaak1167-prog/edunexus.git
cd edunexus
```

### 2. Database Setup

1. Create a project in [Supabase](https://supabase.com/).
2. Open the SQL Editor.
3. Execute the SQL commands from `schema.sql`.
4. Obtain your PostgreSQL connection string.

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_supabase_postgresql_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

`http://localhost:3000`

Test the health endpoint:

`http://localhost:3000/health`

### 4. Create Admin Account

From the backend directory, run:

```bash
node create-admin.js
```

Use the configured admin email and password to log in.

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| PORT | Backend server port |
| NODE_ENV | Application environment |
| DATABASE_URL | Supabase PostgreSQL connection string |
| JWT_SECRET | Secret used for signing JWT tokens |
| CLIENT_URL | Frontend origin allowed by CORS |
| ADMIN_EMAIL | Initial admin email |
| ADMIN_PASSWORD | Initial admin password |
| VITE_API_URL | Backend API base URL |

**Security:** Never commit `.env` files, database passwords, JWT secrets, or admin credentials to GitHub. Use `.env.example` for placeholders.

## 🔗 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Backend and database health check |
| POST | `/api/inquiries` | Submit a new inquiry |
| POST | `/api/admin/login` | Admin login |

### Protected Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/me` | Get authenticated admin |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/dashboard/inquiries` | Retrieve inquiries |
| PATCH | `/api/dashboard/inquiries/:id/status` | Update inquiry status |

Protected endpoints require valid admin authentication.

## 🧪 Testing Instructions

1. Open the public inquiry form.
2. Submit an inquiry with valid information.
3. Log in using the configured admin credentials.
4. Open the admin dashboard.
5. Verify that the submitted inquiry appears.
6. Test search by name and phone number.
7. Test category and user-type filters.
8. Change an inquiry's status.
9. Log out and verify that protected dashboard access requires authentication.

## 🚀 Deployment

### Backend — Render

- Connect the GitHub repository to Render.
- Set the backend root directory to `backend`.
- Build command: `npm install`
- Start command: `npm start`
- Configure the production environment variables.

### Frontend — Vercel

- Import the GitHub repository into Vercel.
- Set the root directory to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Configure `VITE_API_URL` with the deployed backend URL.

## 👨‍💻 Author

**Akash Gupta**

- GitHub: https://github.com/guptaak1167-prog

---

Built as a Full-Stack Developer Internship Assessment Project.
