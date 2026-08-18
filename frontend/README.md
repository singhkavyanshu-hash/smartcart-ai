# SmartCart 🛒

SmartCart is a full-stack e-commerce web application built with React, Node.js, Express.js and PostgreSQL.

The application provides a complete shopping experience including user authentication, product browsing, cart management, checkout, order management, stock management and an AI shopping assistant.

## 🚀 Features

### User Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Persistent login using localStorage
- Logout functionality

### Product Management
- Browse products
- Product details
- Product categories
- Product search
- Product filtering
- Product sorting
- Stock availability

### Shopping Cart
- Add products to cart
- Remove products
- Increase/decrease quantity
- Cart total calculation
- Stock validation

### Checkout
- Customer shipping details
- Order validation
- Database-based product pricing
- Stock validation
- Transaction-based order creation
- Automatic stock deduction

### Orders
- View previous orders
- View individual order details
- Order ID
- Order date
- Ordered products
- Total amount
- Shipping details

### SmartCart AI
- AI-powered shopping assistant
- Product recommendations
- Shopping assistance
- Cart-related interactions

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- JavaScript
- Bootstrap
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication

### Database
- PostgreSQL

### Other Technologies
- Git
- GitHub
- OpenRouter API

## 📁 Project Structure

```text
SmartCart/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    ├── services/
    ├── .env.example
    ├── package.json
    └── server.js