# Smart Case Management System For Individual Lawyers

An AI-powered case management platform designed for individual lawyers. It helps organize legal cases, track hearing dates, manage documents, and support faster decision-making with a chatbot that can answer questions from stored legal case data.

## Project Overview

This repository is split into two applications:

- `frontend/`: React + Vite web interface
- `backend/`: Node.js + Express API server

Core goals of the project:

- Centralized case tracking
- Better document organization
- Hearing reminder support
- AI-assisted legal query experience

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express, CORS, dotenv

## Prerequisites

- Node.js (v18 or above recommended)
- npm (comes with Node.js)

## How To Run Locally

Open two terminals from the project root (`LegoAce`):

### 1) Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

- `http://localhost:5000`

Quick test endpoint:

- `GET /` returns `Backend running with CommonJS`

### 2) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL, usually:

- `http://localhost:5173`

## Available Scripts

### Backend (`backend/package.json`)

- `npm start`: Start backend with Node
- `npm run dev`: Start backend with nodemon (auto-reload)

### Frontend (`frontend/package.json`)

- `npm run dev`: Start Vite dev server
- `npm run build`: Build production frontend
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Environment Variables

Create a `.env` file inside `backend/` when you add environment-specific settings.

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URL=your_mongo_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

For the frontend, copy `frontend/.env.example` to `frontend/.env` if you need a custom backend URL:

```env
VITE_API_URL=http://localhost:5000
```

Then install backend dependencies and start the server in `backend/`:

```bash
npm install
npm run dev
```

## Notes

- Run frontend and backend in separate terminals.
- If a port is already in use, update the port value in `backend/.env`.
