require("dotenv").config();

const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "SmartCart backend is running!"
  });
});
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});