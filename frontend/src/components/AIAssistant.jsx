import { useState } from "react";
import { useCart } from "../context/CartContext";

function AIAssistant() {
 const {
  cart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm SmartCart AI. I can help you find products, compare prices, and choose products within your budget.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  message: userMessage,
  cart,
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get AI response"
        );
      }

   if (data.action === "add_to_cart" && data.product) {
  addToCart(data.product);
}

if (data.action === "remove_from_cart" && data.productId) {
  removeFromCart(data.productId);
}

if (data.action === "increase_quantity" && data.productId) {
  increaseQuantity(data.productId);
}

if (data.action === "decrease_quantity" && data.productId) {
  decreaseQuantity(data.productId);
}

if (data.action === "clear_cart") {
  clearCart();
}

setMessages((currentMessages) => [
  ...currentMessages,
  {
    role: "assistant",
    content: data.reply,
  },
]);
    } catch (error) {
      console.error("AI Assistant error:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {isOpen && (
        <div className="ai-chat-window">

          <div className="ai-chat-header">
            <div>
              <strong>🤖 SmartCart AI</strong>
              <span>Shopping Assistant</span>
            </div>

            <button
              className="ai-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-chat-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`ai-message ${
                  msg.role === "user"
                    ? "ai-user-message"
                    : "ai-bot-message"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="ai-message ai-bot-message ai-loading">
                SmartCart AI is typing...
              </div>
            )}

          </div>

          <form
            className="ai-chat-input"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about products..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
            >
              ➤
            </button>
          </form>

        </div>
      )}

      <button
        className="ai-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open SmartCart AI"
      >
        🤖
      </button>
    </>
  );
}

export default AIAssistant;