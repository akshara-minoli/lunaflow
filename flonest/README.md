# FloNest 🌸 (MERN Period Tracker)

FloNest is a production-ready, beautiful, and private Menstrual Cycle & Period Tracker built using the MERN stack (MongoDB, Express, React, Node.js). 

It features an elegant, responsive, and dynamic UI styled with Tailwind CSS, custom page transition animations using Framer Motion, JWT-based secure authentication, and intelligent cycle calculations (cycle duration, next period forecasts, ovulation dates, fertile windows, and self-care recommendations).

---

## Key Features
- **Intelligent Predictions**: Calculates your next period start/end dates, predicted ovulation day, and fertile window based on your logging trends.
- **Symptom & Mood Journal**: Log flow intensities (light, medium, heavy), moods (calm, energetic, happy, sad, etc.), and symptoms (cramps, bloating, fatigue, etc.) with custom personal notes.
- **Self-Care Advisor**: Dynamic health suggestions tailored to the active phase of your cycle (Menstrual, Follicular, Ovulatory, Luteal).
- **Responsive Layout**: Designed for seamless use on desktop, tablet, and mobile screens.
- **Secure Password Hashing**: Passwords stored safely using `bcryptjs` and verified through JWT HTTP-only cookies.

---

## Folder Structure

```text
flonest/
├── client/                 # Frontend React (Vite) Application
│   ├── src/
│   │   ├── assets/         # App logos, graphics
│   │   ├── components/     # Reusable layout and helper elements
│   │   │   ├── Common/     # Route guards (ProtectedRoute)
│   │   │   └── Layout/     # Navbar, Footer, Layout shells
│   │   ├── context/        # Global states (AuthContext)
│   │   ├── pages/          # Welcome, Login, Register, Recovery
│   │   ├── utils/          # Axios configurations (api.js)
│   │   ├── App.jsx         # Routing and wrapper structures
│   │   ├── index.css       # Tailwind base layers and glassmorphic designs
│   │   └── main.jsx        # Mount point
│   ├── package.json        # Frontend scripts and packages
│   └── .env.example        # Frontend environment variables template
│
├── server/                 # Backend Node.js / Express Server API
│   ├── config/             # Database connection setups
│   ├── controllers/        # Route controllers (Auth, Cycles logs)
│   ├── middleware/         # Security guards (Auth protections)
│   ├── models/             # Database Schemas (User, Cycle logs)
│   ├── routes/             # Express API endpoints
│   ├── package.json        # Backend scripts and packages
│   ├── server.js           # Server application startup
│   └── .env.example        # Backend environment variables template
│
├── package.json            # Root Orchestrator script runner
└── .gitignore              # Git ignore rules
```

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a running [MongoDB](https://www.mongodb.com/) instance (either local or Atlas).

### 1. Clone & Install Dependencies
Run the command below in the project root directory (`flonest/`) to install root, backend, and frontend packages simultaneously:

```bash
# Install root, backend, and frontend packages
npm run install-all
```

Alternatively, you can install packages independently:
```bash
# In flonest/server/
npm install

# In flonest/client/
npm install
```

### 2. Configure Environment Variables

#### Backend (`flonest/server/.env`)
Create a `.env` file in the `server` folder (or copy `.env.example`) and fill in your credentials:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/flonest
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (`flonest/client/.env`)
Create a `.env` file in the `client` folder (or copy `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Development Mode
To start both the backend server and the frontend client simultaneously in development mode (with hot reloading), execute:

```bash
# Run from flonest/
npm run dev
```

This starts:
- Backend API at: `http://localhost:5000`
- Frontend UI at: `http://localhost:5173`

### Run Separately
If you prefer to run services in separate terminals:

```bash
# Run server (from flonest/server)
npm run dev

# Run client (from flonest/client)
npm run dev
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)
* `POST /register`: Registers a new account.
* `POST /login`: Log in to an account (sets HTTP-only auth cookie).
* `GET /logout`: Logs out user (clears auth cookie).
* `GET /me`: Gets the profile of the current logged-in user (Protected).
* `POST /forgotpassword`: Triggers generating reset token (Mocks emails to console in Dev).
* `PUT /resetpassword/:resettoken`: Updates account password.

### Cycle & Tracker Routes (`/api/cycles`)
* `GET /`: Get all cycle log entries for the current user (Protected).
* `POST /`: Create a new period cycle log entry (Protected).
* `GET /insights`: Get predicted period start/end dates, ovulation date, fertile window, and averages (Protected).
* `PUT /:id`: Update details of a logged entry (Protected).
* `DELETE /:id`: Remove a log entry (Protected).
