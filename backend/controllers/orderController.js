const db = require("../config/db");

const createOrder = async (req, res) => {
  const client = await db.connect();

  try {
    const {
      customer_name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
    } = req.body;

    // 1. Validate customer details
    if (
      !customer_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please provide all customer details.",
      });
    }

    // 2. Validate cart items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    await client.query("BEGIN");

    // 3. Get actual product prices from database
    const productIds = items.map((item) => item.product_id);

    const productResult = await client.query(
      `
      SELECT id, name, price
      FROM products
      WHERE id = ANY($1::int[])
      `,
      [productIds]
    );

    if (productResult.rows.length !== items.length) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "One or more products are invalid.",
      });
    }

    // 4. Calculate total using database prices
    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const product = productResult.rows.find(
        (p) => p.id === Number(item.product_id)
      );

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid product quantity.");
      }

      totalAmount += Number(product.price) * quantity;

      return {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity,
      };
    });

    // 5. Create order
    const orderResult = await client.query(
      `
      INSERT INTO orders (
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total_amount
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, total_amount, created_at
      `,
      [
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        totalAmount,
      ]
    );

    const order = orderResult.rows[0];

    // 6. Insert order items
    for (const item of orderItems) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          price,
          quantity
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          order.id,
          item.product_id,
          item.product_name,
          item.price,
          item.quantity,
        ]
      );
    }

    await client.query("COMMIT");

    // 7. Send successful response
    res.status(201).json({
      message: "Order placed successfully.",
      order: {
        id: order.id,
        total_amount: order.total_amount,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Failed to place order.",
      error: error.message,
    });
  } finally {
    client.release();
  }
};
const getOrdersByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      message: "Email is required.",
    });
  }

  try {
    // Get all orders for this email
    const ordersResult = await db.query(
      `
      SELECT
        id,
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total_amount,
        created_at
      FROM orders
      WHERE email = $1
      ORDER BY created_at DESC
      `,
      [email]
    );

    const orders = ordersResult.rows;

    // Get items for every order
    for (const order of orders) {
      const itemsResult = await db.query(
        `
        SELECT
          product_id,
          product_name,
          price,
          quantity
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC
        `,
        [order.id]
      );

      order.items = itemsResult.rows;
    }

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
};
const getOrderById = async (req, res) => {
  const { id } = req.params;

  // Validate order ID
  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: "Invalid order ID.",
    });
  }

  try {
    // Get order details
    const orderResult = await db.query(
      `
      SELECT
        id,
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total_amount,
        created_at
      FROM orders
      WHERE id = $1
      `,
      [id]
    );

    // Order not found
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const order = orderResult.rows[0];

    // Get products belonging to this order
    const itemsResult = await db.query(
      `
      SELECT
        product_id,
        product_name,
        price,
        quantity
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [id]
    );

    order.items = itemsResult.rows;

    // Send complete order
    res.status(200).json({
      order,
    });

  } catch (error) {
    console.error("Error fetching order:", error);

    res.status(500).json({
      message: "Failed to fetch order.",
    });
  }
};

module.exports = {
  createOrder,
  getOrdersByEmail,
  getOrderById,
};