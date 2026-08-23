# 🛒 SmartCart — Full-Stack E-Commerce Platform

**SmartCart** is a deployed full-stack e-commerce web application that combines a complete shopping workflow with an AI-powered shopping assistant.

Built with **React.js, Node.js, Express.js, PostgreSQL, and OpenRouter**, the project demonstrates practical experience in frontend development, REST APIs, authentication, database integration, inventory handling, deployment, and third-party AI integration.

<p align="center">
  <a href="https://smartcart-frontend-1hm2.onrender.com/">🌐 Live Demo</a> •
  <a href="https://smartcart-backend-0ybg.onrender.com/health">⚙️ API Health Check</a>
</p>

---

## ✨ Key Features

### 👤 Authentication & Security

- User registration and login
- JWT-based authentication
- Protected API routes
- Password hashing with bcryptjs
- User-specific order access
- Environment variables for sensitive configuration

### 🛍️ Product Discovery

- Product listing and details
- Search
- Category filtering
- Product sorting
- Stock availability
- Out-of-stock handling
- Responsive product cards

### 🛒 Cart & Checkout

- Add and remove products
- Increase/decrease quantities
- Automatic cart total calculation
- Stock-aware cart management
- Cart validation before checkout
- Customer shipping information

### 📦 Order & Inventory Management

- Database-backed order creation
- Order item persistence
- Server-side order total calculation
- Automatic stock reduction after successful orders
- Order history
- Individual order details

### 🤖 AI Shopping Assistant

- Product-related questions
- Shopping recommendations
- Product comparison assistance
- Budget-based product selection
- AI-assisted shopping/cart actions
- Integration with OpenRouter API

### ☁️ Deployment

- React frontend deployed on Render
- Node.js/Express backend deployed on Render
- PostgreSQL database hosted on Render
- Production environment configuration
- REST API architecture
- GitHub-based deployment workflow

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router, Axios, Bootstrap, JavaScript |
| **Backend** | Node.js, Express 5, REST APIs, JWT, bcryptjs, CORS, dotenv |
| **Database** | PostgreSQL, node-postgres (`pg`) |
| **AI** | OpenRouter API through the OpenAI SDK |
| **Development** | Git, GitHub, VS Code |
| **Deployment** | Render |

---

## 🏗️ Project Structure

```text
smartcart-ai/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── screenshots/
├── .gitignore
└── README.md
```

The separation between frontend and backend keeps the application modular and makes the REST API independently deployable.

---

## 🌐 Live Application

### Frontend

https://smartcart-frontend-1hm2.onrender.com/

### Backend API

https://smartcart-backend-0ybg.onrender.com/

### Backend Health Check

https://smartcart-backend-0ybg.onrender.com/health

---

## 📸 Screenshots

### 🏠 Home Page

![SmartCart Home](screenshots/home.jpeg)

### 🛍️ Products

![SmartCart Products](screenshots/products.jpeg)

### 🛒 Shopping Cart

![SmartCart Cart](screenshots/cart.jpeg)

### 📦 My Orders

![SmartCart Orders](screenshots/orders.jpeg)

### 📋 Order Details

![SmartCart Order Details](screenshots/order-details.jpeg)

### 🤖 AI Shopping Assistant

![SmartCart AI Assistant](screenshots/ai-assistant.jpeg)

---

## 🔄 Application Architecture

```text
                    ┌──────────────────────────┐
                    │       React + Vite        │
                    │        Frontend           │
                    └────────────┬─────────────┘
                                 │
                              Axios
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     Node.js + Express     │
                    │       REST API            │
                    └───────┬───────────┬──────┘
                            │           │
                            │           └──────────────┐
                            ▼                          ▼
                 ┌──────────────────┐       ┌─────────────────┐
                 │    PostgreSQL    │       │  OpenRouter AI  │
                 │     Database     │       │  AI Assistant   │
                 └──────────────────┘       └─────────────────┘
                            ▲
                            │
                    JWT + bcryptjs
                    Authentication
```

---

## 🚀 Run Locally

### Prerequisites

- Node.js and npm
- PostgreSQL
- An OpenRouter API key for the AI assistant

### 1. Clone the repository

```bash
git clone https://github.com/singhkavyanshu-hash/smartcart-ai.git
cd smartcart-ai
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as a template:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/smartcart
OPENROUTER_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The production start command is:

```bash
npm start
```

### 3. Configure the frontend

Open a second terminal:

```bash
cd smartcart-ai/frontend
npm install
npm run dev
```

The Vite development server will display the local frontend URL in the terminal.

---

## 🔐 Environment Variables

The repository includes `backend/.env.example` with placeholder values. **Never commit real API keys, database passwords, JWT secrets, or other credentials.**

The repository `.gitignore` excludes `.env` files while keeping the example configuration available for setup.

---

## 🧠 What I Learned

Building SmartCart gave me practical experience with:

- Designing and consuming REST APIs
- Connecting a React frontend to a Node.js/Express backend
- JWT authentication and protected routes
- PostgreSQL database integration
- Cart, order, and inventory workflows
- Server-side validation and business logic
- Environment-based configuration
- Production deployment with Render
- Integrating an external AI API into a full-stack application

---

## 🔮 Future Improvements

- Admin dashboard for product and inventory management
- Payment gateway integration
- Order status tracking
- Product reviews and ratings
- Improved AI recommendation context
- Automated testing and CI/CD

---

## 👨‍💻 Author

**Kavyanshu Singh**

- 💼 LinkedIn: https://www.linkedin.com/in/kavyanshu-singh-89b226366/
- 💻 GitHub: https://github.com/singhkavyanshu-hash

---

⭐ If you find the project interesting, feel free to explore the code and live demo.