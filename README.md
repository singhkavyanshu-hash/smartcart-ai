# SmartCart 🛒

SmartCart is a full-stack e-commerce web application with AI-powered shopping assistance.

## Live Demo

- Frontend: https://smartcart-frontend-1hm2.onrender.com
- Backend API: https://smartcart-backend-0ybg.onrender.com

## Features

- User registration and JWT authentication
- Product browsing and product details
- Shopping cart management
- Order placement and order history
- PostgreSQL database integration
- RESTful backend APIs
- AI-powered shopping assistant
- Responsive React frontend
- Production deployment on Render

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Bootstrap / CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT authentication
- REST APIs

## Environment Variables

Do not commit real secrets. Use the provided `.env.example` files and configure production secrets in Render.

## Running Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `VITE_API_URL` to locate the backend API.

## Deployment

The frontend is deployed as a Render Static Site and the backend as a Render Web Service. PostgreSQL is used as the production database.
