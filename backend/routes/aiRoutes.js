const express = require("express");
const OpenAI = require("openai");
const db = require("../config/db");

const router = express.Router();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      message: "Please enter a message.",
    });
  }

  try {
    // -----------------------------------
    // 1. Detect budget
    // -----------------------------------

    const budgetMatch = message.match(
      /(?:under|below|less than|upto|up to|within)\s*₹?\s*(\d+(?:,\d+)*)/i
    );

    const budget = budgetMatch
      ? Number(budgetMatch[1].replace(/,/g, ""))
      : null;

    // -----------------------------------
    // 2. Detect product keywords
    // -----------------------------------

    const searchWords = [
      "headphones",
      "phone",
      "mobile",
      "laptop",
      "keyboard",
      "mouse",
      "watch",
      "camera",
      "speaker",
      "earphones",
      "tablet",
    ];

    const lowerMessage = message.toLowerCase();

    const matchedKeyword = searchWords.find((word) =>
      lowerMessage.includes(word)
    );

    console.log("Budget:", budget);
    console.log("Product keyword:", matchedKeyword);

    // -----------------------------------
    // 3. Build PostgreSQL query
    // -----------------------------------

    let query = `
      SELECT id, name, description, price, image
      FROM products
    `;

    const values = [];
    const conditions = [];

    if (budget !== null) {
      values.push(budget);

      conditions.push(`price <= $${values.length}`);
    }

    if (matchedKeyword) {
      values.push(`%${matchedKeyword}%`);

      conditions.push(`
        (
          LOWER(name) LIKE LOWER($${values.length})
          OR LOWER(description) LIKE LOWER($${values.length})
        )
      `);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY price ASC";

    // -----------------------------------
    // 4. Search PostgreSQL
    // -----------------------------------

    console.log("SQL query:", query);
    console.log("SQL values:", values);

    const result = await db.query(query, values);

    const products = result.rows;

    console.log("Matching products:", products);
    // -----------------------------------
// Product comparison
// -----------------------------------

const comparisonRequest =
  /\b(compare|comparison|versus|vs|which is better|which one should i buy|better between)\b/i.test(
    message
  );

if (comparisonRequest) {
  // Get all products from the database
  const comparisonResult = await db.query(`
    SELECT id, name, description, price
    FROM products
    ORDER BY price ASC
  `);

  const allProducts = comparisonResult.rows;

  // Find products mentioned in the user's message
  const mentionedProducts = allProducts.filter((product) => {
    const productName = product.name.toLowerCase();

    // Exact product name
    if (lowerMessage.includes(productName)) {
      return true;
    }

    // Match meaningful words from product name
    const words = productName.split(" ");

    return words.some(
      (word) =>
        word.length > 3 &&
        lowerMessage.includes(word)
    );
  });

  console.log(
    "Products detected for comparison:",
    mentionedProducts
  );

  if (mentionedProducts.length < 2) {
    return res.json({
      reply:
        "Please mention two products that you want me to compare.",
      action: null,
    });
  }

  // Use the first two matching products
  const productsToCompare = mentionedProducts.slice(0, 2);

  const comparisonContext = productsToCompare
    .map(
      (product) =>
        `ID: ${product.id}
Name: ${product.name}
Description: ${product.description}
Price: ₹${product.price}`
    )
    .join("\n\n");

  const comparisonResponse = await client.responses.create({
    model: "openrouter/free",

    instructions: `
You are SmartCart AI, a helpful shopping assistant.

Compare the products using ONLY the database information provided below.

Rules:

1. Never invent specifications.
2. Never invent prices.
3. Use the exact product names.
4. Use the exact prices.
5. Compare the available descriptions.
6. Clearly mention which product is cheaper.
7. Give a concise recommendation based only on the available information.
8. If the available information is insufficient to determine a winner, say so.
9. Keep the response friendly and easy to read.

DATABASE PRODUCTS:

${comparisonContext}
`,

    input: message,
  });

  return res.json({
    reply: comparisonResponse.output_text,
    action: null,
  });
}

    // -----------------------------------
// 5. Detect cart management requests
// -----------------------------------

const cart = Array.isArray(req.body.cart)
  ? req.body.cart
  : [];


// -----------------------------------
// Clear cart
// -----------------------------------

const clearCartRequest =
  /\b(clear|empty|delete|remove)\b.*\b(cart|basket)\b/i.test(
    message
  );

if (clearCartRequest) {
  if (cart.length === 0) {
    return res.json({
      reply: "Your cart is already empty.",
      action: null,
    });
  }

  return res.json({
    reply: "Your cart has been cleared. 🗑️",
    action: "clear_cart",
  });
}

// -----------------------------------
// View cart
// -----------------------------------

const viewCartRequest =
  /\b(show|view|see|check|what('s| is| are))\b.*\b(cart|basket)\b/i.test(
    message
  );

if (
  viewCartRequest ||
  /\bwhat('s| is)\s+in\s+(my\s+)?(cart|basket)\b/i.test(message)
) {
  if (cart.length === 0) {
    return res.json({
      reply: "Your cart is currently empty. 🛒",
      action: null,
    });
  }

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const cartDetails = cart
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} — ₹${(
          Number(item.price) * Number(item.quantity)
        ).toLocaleString("en-IN")}`
    )
    .join("\n");

  return res.json({
    reply:
      `Here is your current cart:\n\n${cartDetails}\n\n` +
      `Total: ₹${cartTotal.toLocaleString("en-IN")} 🛒`,
    action: null,
  });
}

// -----------------------------------
// Find product inside cart
// -----------------------------------

function findCartProduct() {
  return cart.find((item) => {
    const productName = item.name.toLowerCase();

    if (lowerMessage.includes(productName)) {
      return true;
    }

    const words = productName.split(" ");

    return words.some(
      (word) =>
        word.length > 3 &&
        lowerMessage.includes(word)
    );
  });
}

// -----------------------------------
// Remove product
// -----------------------------------

const removeRequest =
  /\b(remove|delete)\b.*\b(from|out of)\b.*\b(cart|basket)\b/i.test(
    message
  );

if (removeRequest) {
  const product = findCartProduct();

  if (!product) {
    return res.json({
      reply:
        "I couldn't find that product in your cart.",
      action: null,
    });
  }

  return res.json({
    reply: `${product.name} has been removed from your cart. 🗑️`,
    action: "remove_from_cart",
    productId: product.id,
  });
}

// -----------------------------------
// Increase quantity
// -----------------------------------

const increaseRequest =
  /\b(increase|add one more|more|increment)\b/i.test(
    message
  );

if (increaseRequest) {
  const product = findCartProduct();

  if (!product) {
    return res.json({
      reply:
        "I couldn't find that product in your cart.",
      action: null,
    });
  }

  return res.json({
    reply:
      `${product.name} quantity has been increased. ➕`,
    action: "increase_quantity",
    productId: product.id,
  });
}

// -----------------------------------
// Decrease quantity
// -----------------------------------

const decreaseRequest =
  /\b(decrease|reduce|remove one|less)\b/i.test(
    message
  );

if (decreaseRequest) {
  const product = findCartProduct();

  if (!product) {
    return res.json({
      reply:
        "I couldn't find that product in your cart.",
      action: null,
    });
  }

  return res.json({
    reply:
      `${product.name} quantity has been decreased. ➖`,
    action: "decrease_quantity",
    productId: product.id,
  });
}

// -----------------------------------
// Add-to-cart request
// -----------------------------------

const addToCartRequest =
  /\b(add|put|buy)\b.*\b(cart|basket)\b/i.test(
    message
  );

if (addToCartRequest) {
  const product = products.find((item) => {
    const searchText = lowerMessage;

    return (
      searchText.includes(item.name.toLowerCase()) ||
      item.name
        .toLowerCase()
        .split(" ")
        .some(
          (word) =>
            word.length > 3 &&
            searchText.includes(word)
        )
    );
  });

  if (!product) {
    return res.json({
      reply:
        "I couldn't find that product in the SmartCart catalog.",
      action: null,
    });
  }

  return res.json({
    reply:
      `${product.name} has been added to your cart. 🛒`,
    action: "add_to_cart",
    product: product,
  });
}

    // -----------------------------------
    // 6. Create product context for AI
    // -----------------------------------

    let productContext;

    if (products.length === 0) {
      productContext = "No matching products were found.";
    } else {
      productContext = products
        .map(
          (product) =>
            `ID: ${product.id}
Name: ${product.name}
Description: ${product.description}
Price: ₹${product.price}`
        )
        .join("\n\n");
    }

    // -----------------------------------
    // 7. Ask OpenRouter AI
    // -----------------------------------

    const response = await client.responses.create({
      model: "openrouter/free",

      instructions: `
You are SmartCart AI, a helpful shopping assistant.

Your job is to help users:

- discover products
- compare products
- understand product features
- make shopping decisions
- stay within a requested budget

IMPORTANT RULES:

1. Only recommend products from the database results.
2. Never invent products.
3. Never invent prices.
4. If no matching products were found, tell the user clearly.
5. Use the exact product name and price provided.
6. Respect the user's budget.
7. Keep responses concise and friendly.
8. When recommending a product, mention its name, price,
   and why it matches the user's request.
9. If multiple products match, mention the best relevant options.

DATABASE RESULTS:

${productContext}
      `,

      input: message,
    });

    // -----------------------------------
    // 8. Send AI response
    // -----------------------------------

    res.json({
      reply: response.output_text,
      action: null,
    });

  } catch (error) {
    console.error("AI error:", error);

    res.status(500).json({
      message: "Unable to get a response from SmartCart AI.",
    });
  }
});

module.exports = router;