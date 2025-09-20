# SafeHer Hackathon

A full-stack application built with React (Vite) frontend and Node.js/Express backend with MongoDB.

## Project Structure

```
safeher-hackathon/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js + Express backend
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Leaflet** - Map components
- **Leaflet** - Interactive maps

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/safeher-hackathon
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

## Development

### Backend Scripts
- `npm start` - Start the server
- `node server.js` - Run server directly

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the ISC License.
