# 🛒 SmartCart — AI-Powered E-Commerce Platform

SmartCart is a full-stack e-commerce web application that provides a modern shopping experience with secure authentication, product browsing, shopping cart management, order processing, and an AI-powered shopping assistant.

The application is built using React, Node.js, Express.js, and PostgreSQL and is deployed on Render.

---

## 🚀 Live Demo

### 🌐 Frontend
https://smartcart-frontend-1hm2.onrender.com

### ⚙️ Backend API
https://smartcart-backend-0ybg.onrender.com

### ❤️ Backend Health Check
https://smartcart-backend-0ybg.onrender.com/health

---

## ✨ Features

### 👤 Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Secure user-specific order access
- Logout functionality

### 🛍️ Product Management
- Browse available products
- Product details page
- Product pricing
- Product stock availability
- Out-of-stock handling
- Responsive product cards

### 🛒 Shopping Cart
- Add products to cart
- Remove products
- Increase/decrease product quantity
- Automatic cart total calculation
- Stock-aware purchasing

### 📦 Order Management
- Checkout system
- Customer shipping information
- Database-backed order creation
- Order item storage
- Automatic total calculation
- Stock reduction after successful orders
- Order history
- Individual order details

### 🤖 SmartCart AI
- AI-powered shopping assistant
- Users can ask product-related questions
- AI assistance for shopping decisions
- Integrated with OpenRouter API

### 🔐 Security
- JWT authentication
- Password hashing with bcrypt
- Environment variables for secrets
- Protected API routes
- Database-backed authentication
- `.env` files excluded from Git

### ☁️ Deployment
- Frontend deployed on Render
- Backend deployed on Render
- PostgreSQL database hosted on Render
- Production environment variables
- REST API architecture

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Bootstrap
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- PostgreSQL
- node-postgres (`pg`)

### AI

- OpenRouter API

### Deployment & Tools

- Git
- GitHub
- Render
- pgAdmin
- VS Code

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │       Frontend       │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ▼                             ▼
       ┌──────────────────┐          ┌─────────────────┐
       │    PostgreSQL    │          │  OpenRouter AI  │
       │     Database     │          │       API       │
       └──────────────────┘          └─────────────────┘