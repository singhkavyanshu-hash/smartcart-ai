const express = require("express");

const {
  createOrder,
  getOrdersByEmail,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

// Create a new order
router.post("/", createOrder);

// Get all orders by customer email
router.get("/", getOrdersByEmail);

// Get a single order by ID
router.get("/:id", getOrderById);

module.exports = router;