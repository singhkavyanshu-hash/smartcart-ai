import { useState } from "react";
import { useCart } from "../context/useCart";
import { API_BASE_URL } from "../api";

function AIAssistant({ isOpen, setIsOpen }) {

  const {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

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

    // Add user's message
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
        `${API_BASE_URL}/api/ai/chat`,
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


      /* ================= AI CART ACTIONS ================= */

      if (
        data.action === "add_to_cart" &&
        data.product
      ) {
        addToCart(data.product);
      }


      if (
        data.action === "remove_from_cart" &&
        data.productId
      ) {
        removeFromCart(data.productId);
      }


      if (
        data.action === "increase_quantity" &&
        data.productId
      ) {
        increaseQuantity(data.productId);
      }


      if (
        data.action === "decrease_quantity" &&
        data.productId
      ) {
        decreaseQuantity(data.productId);
      }


      if (data.action === "clear_cart") {
        clearCart();
      }


      /* ================= AI RESPONSE ================= */

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

    } catch (error) {

      console.error(
        "AI Assistant error:",
        error
      );

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

      {/* ================= CHAT WINDOW ================= */}

      {isOpen && (

        <div className="ai-chat-window">

          {/* HEADER */}

          <div className="ai-chat-header">

            <div>

              <strong>
                🤖 SmartCart AI
              </strong>

              <span>
                Shopping Assistant
              </span>

            </div>


            <button
              className="ai-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close SmartCart AI"
            >
              ×
            </button>

          </div>


          {/* ================= MESSAGES ================= */}

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


          {/* ================= INPUT ================= */}

          <form
            className="ai-chat-input"
            onSubmit={sendMessage}
          >

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask about products..."
              disabled={loading}
            />


            <button
              type="submit"
              disabled={
                loading ||
                !message.trim()
              }
              aria-label="Send message"
            >
              ➤
            </button>

          </form>

        </div>

      )}


      {/* ================= FLOATING BUTTON ================= */}

      <button
        className="ai-floating-btn"
        onClick={() =>
          setIsOpen(!isOpen)
        }
        aria-label="Open SmartCart AI"
      >
        🤖
      </button>

    </>
  );
}

export default AIAssistant;
