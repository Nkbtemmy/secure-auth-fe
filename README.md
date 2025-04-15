# 💻 Secure User Dashboard — Frontend

This is the **frontend** application for the Secure User Dashboard project, built with:

- ⚡️ [React](https://reactjs.org/)
- 🛠️ [Vite](https://vitejs.dev/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🔐 Role-based access control
- 🌐 Axios with token-based auth
- 🐳 Fully Dockerized

---

## 🚀 Features

- User registration & login with JWT
- Forgot/reset password workflow
- View & update user profile
- Role-based access (admin, user, manager, etc.)
- Admin panel (manage users and roles)
- Responsive Tailwind UI
- Environment-based API handling

---

## 📦 Tech Stack

| Category      | Stack                     |
|---------------|---------------------------|
| Framework     | React + Vite              |
| Styling       | Tailwind CSS              |
| HTTP Client   | Axios                     |
| Routing       | React Router v6           |
| Auth          | JWT (via localStorage)    |
| Type Checking | TypeScript                |
| Docker        | Dockerfile + Compose      |

---

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/secure-user-dashboard.git
cd secure-user-dashboard/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Envirnment variables

VITE_API_URL=http://localhost:5000/api

# Start dev server
- "npm run dev"

# 🛠️ Folder Structure

src/
├── components/      # Reusable UI elements (e.g. AuthForm)
├── pages/           # Top-level routes (Login, Register, Dashboard)
├── routes/          # App router (React Router config)
├── services/        # Axios config and API handlers
├── utils/           # Auth helpers
├── App.tsx          # Main component
└── main.tsx         # Vite entry point

