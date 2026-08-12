import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main>
        <section className="cart-section">
          <div className="section-heading">
            <span>CART</span>
            <h1>Your Cart</h1>
            <p>Your shopping cart is currently empty.</p>
          </div>
        </section>
      </main>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main>
      <section className="cart-section">
        <div className="section-heading">
          <span>CART</span>
          <h1>Your Cart</h1>
          <p>Review your selected products.</p>
        </div>

        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  {item.image}
                </div>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>{item.description}</p>

                  <strong>
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </strong>

                  <div className="quantity-controls">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-cart-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-total">
              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
  className="checkout-btn"
  onClick={() => navigate("/checkout")}
>
  Proceed to Checkout
</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cart;