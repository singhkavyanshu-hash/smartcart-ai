const express = require("express");

const {
  createOrder,
  getOrdersByEmail,
  getOrderById,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { orderSchema } = require("../validators/orderValidator");

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

// Create order
router.post("/", validate(orderSchema), createOrder);

// Get logged-in user's orders
router.get("/", getOrdersByEmail);

// Get one of logged-in user's orders
router.get("/:id", getOrderById);

module.exports = router;