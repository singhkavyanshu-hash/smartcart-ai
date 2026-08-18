const db = require("../config/db");

const createOrder = async (req, res) => {
  const client = await db.connect();
  let transactionStarted = false;

  try {
    const {
      customer_name,
      phone,
      address,
      city,
      state,
      pincode,
      items,
    } = req.body;

    // Get email from authenticated JWT
    const email = req.user.email;

    // =========================================================
    // 1. Validate customer details
    // =========================================================

    if (
      !customer_name?.trim() ||
      !email ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return res.status(400).json({
        message: "Please provide all customer details.",
      });
    }

    // =========================================================
    // 2. Validate cart
    // =========================================================

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    // =========================================================
    // 3. Validate product IDs and quantities
    // =========================================================

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(productId) ||
        productId <= 0 ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity.",
        });
      }
    }

    // =========================================================
    // 4. Prevent duplicate products
    // =========================================================

    const productIds = items.map((item) =>
      Number(item.product_id)
    );

    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      return res.status(400).json({
        message: "Duplicate products are not allowed.",
      });
    }

    // =========================================================
    // 5. Start database transaction
    // =========================================================

    await client.query("BEGIN");
    transactionStarted = true;

    // =========================================================
    // 6. Get products and lock rows
    // =========================================================

    const productResult = await client.query(
      `
      SELECT
        id,
        name,
        price,
        stock
      FROM products
      WHERE id = ANY($1::int[])
      FOR UPDATE
      `,
      [productIds]
    );

    // Create a map for quick product lookup
    const productMap = new Map(
      productResult.rows.map((product) => [
        product.id,
        product,
      ])
    );

    // Make sure every requested product exists
    for (const item of items) {
      const productId = Number(item.product_id);

      if (!productMap.has(productId)) {
        await client.query("ROLLBACK");
        transactionStarted = false;

        return res.status(400).json({
          message: "One or more products are invalid.",
        });
      }
    }

    // =========================================================
    // 7. Check stock and calculate total
    // =========================================================

    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      const product = productMap.get(productId);

      // Check available stock
      if (Number(product.stock) < quantity) {
        throw new Error(
          `${product.name} has only ${product.stock} item(s) available.`
        );
      }

      // Calculate total using database price
      totalAmount += Number(product.price) * quantity;

      return {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity,
      };
    });

    // =========================================================
    // 8. Create order
    // =========================================================

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
      RETURNING
        id,
        total_amount,
        created_at
      `,
      [
        customer_name.trim(),
        email,
        phone.trim(),
        address.trim(),
        city.trim(),
        state.trim(),
        pincode.trim(),
        totalAmount,
      ]
    );

    const order = orderResult.rows[0];

    // =========================================================
    // 9. Insert order items and decrease stock
    // =========================================================

    for (const item of orderItems) {
      // Insert order item
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

      // Decrease product stock
      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2
        `,
        [
          item.quantity,
          item.product_id,
        ]
      );
    }

    // =========================================================
    // 10. Commit transaction
    // =========================================================

    await client.query("COMMIT");
    transactionStarted = false;

    // =========================================================
    // 11. Send successful response
    // =========================================================

    return res.status(201).json({
      message: "Order placed successfully.",
      order: {
        id: order.id,
        total_amount: order.total_amount,
        created_at: order.created_at,
      },
    });

  } catch (error) {
    // Rollback if transaction was started
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }

    console.error("Error creating order:", error);

    return res.status(400).json({
      message: error.message || "Failed to place order.",
    });

  } finally {
    client.release();
  }
};


// =========================================================
// GET ALL ORDERS FOR LOGGED-IN USER
// =========================================================

const getOrdersByEmail = async (req, res) => {
  const email = req.user.email;

  try {
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

    // Get items for each order
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

    return res.status(200).json({
      orders,
    });

  } catch (error) {
    console.error("Error fetching orders:", error);

    return res.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
};


// =========================================================
// GET SINGLE ORDER FOR LOGGED-IN USER
// =========================================================

const getOrderById = async (req, res) => {
  const { id } = req.params;

  // Validate order ID
  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: "Invalid order ID.",
    });
  }

  try {
    // Get order only if it belongs to logged-in user
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
        AND email = $2
      `,
      [
        id,
        req.user.email,
      ]
    );

    // Order not found or doesn't belong to user
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

    return res.status(200).json({
      order,
    });

  } catch (error) {
    console.error("Error fetching order:", error);

    return res.status(500).json({
      message: "Failed to fetch order.",
    });
  }
};


// =========================================================
// EXPORT CONTROLLERS
// =========================================================

module.exports = {
  createOrder,
  getOrdersByEmail,
  getOrderById,
};