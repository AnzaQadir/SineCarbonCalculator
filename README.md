# Carbon Calculator Simplifier

A web application that helps users calculate their carbon footprint and provides personalized sustainability recommendations.

## Project Structure

The project is split into two main services:

- `frontend/`: React-based web application
- `backend/`: Express.js API server

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carbon-calc-simplifier
```

2. Install dependencies for all services:
```bash
npm run install:all
```

## Development

To run both frontend and backend services in development mode:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

## Building for Production

To build both services for production:

```bash
npm run build
```

## Features

- Carbon footprint calculation
- Personalized sustainability recommendations
- Interactive UI with progress tracking
- Detailed category breakdown
- Eco-personality assessment

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

### Backend
- Express.js
- TypeScript
- Node.js

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/calculate-personality`: Calculate personality based on user input
- `GET /api/personality-details/:type`: Get detailed personality information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
