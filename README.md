# FloNest 🌸

FloNest is a private menstrual cycle and period tracker built with MongoDB, Express, React, and Node.js (MERN). It provides cycle predictions, a symptom and mood journal, and phase-aware self-care guidance.

## Project location

The application source lives in [`flonest/`](./flonest). Run all project commands from that directory.

```bash
cd flonest
npm run install-all
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Setup

Create these environment files before starting the app:

`flonest/server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/flonest
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

`flonest/client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

See the [full project documentation](./flonest/README.md) for features, folder structure, and API endpoints.
