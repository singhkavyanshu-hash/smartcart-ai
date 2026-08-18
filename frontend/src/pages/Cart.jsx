import { useCart } from "../context/useCart";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const navigate = useNavigate();

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="bg-light min-vh-100">
        <section className="container py-5">
          <div className="text-center py-5">
            <div className="text-uppercase fw-bold text-secondary small mb-2">
              CART
            </div>

            <h1 className="display-5 fw-bold mb-3">
              Your Cart
            </h1>

            <p className="text-secondary fs-5">
              Your shopping cart is currently empty.
            </p>

            <button
              className="btn btn-dark mt-3 px-4 py-2"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="bg-light min-vh-100">
      <section className="container py-5">

        {/* Page Heading */}
        <div className="text-center mb-5">
          <div className="text-uppercase fw-bold text-secondary small mb-2">
            CART
          </div>

          <h1 className="display-5 fw-bold mb-3">
            Your Cart
          </h1>

          <p className="text-secondary fs-5">
            Review your selected products.
          </p>
        </div>

        {/* Cart Content */}
        <div className="row g-4">

          {/* Cart Items */}
          <div className="col-lg-8">

            {cart.map((item) => (
              <div
                className="card border-0 shadow-sm rounded-4 mb-4"
                key={item.id}
              >
                <div className="card-body p-4">

                  <div className="row align-items-center g-4">

                    {/* Product Image */}
                    <div className="col-md-3">
                      <div
                        className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                        style={{
                          height: "180px",
                          fontSize: "90px",
                        }}
                      >
                        {item.image}
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="col-md-9">

                      <h3 className="fw-bold mb-2">
                        {item.name}
                      </h3>

                      <p className="text-secondary mb-3">
                        {item.description}
                      </p>

                      <h5 className="fw-bold mb-3">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </h5>
                      <p className="text-secondary small mb-3">
                        {item.stock > 0
                          ? `${item.stock} available`
                          : "Out of stock"}
                      </p>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2 mb-3">

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          −
                        </button>

                        <span
                          className="fw-bold px-3"
                          style={{ minWidth: "40px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => increaseQuantity(item.id)}
                          disabled={item.quantity >= Number(item.stock)}
                        >
                          +
                        </button>

                      </div>

                      {/* Remove Button */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            ))}

          </div>

          {/* Order Summary */}
          <div className="col-lg-4">

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">

                <h2 className="fw-bold mb-4">
                  Order Summary
                </h2>

                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <span className="text-secondary">
                    Total
                  </span>

                  <strong className="fs-4">
                    ₹{total.toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="btn btn-dark w-100 py-3 fw-bold"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>

                <button
                  className="btn btn-outline-dark w-100 mt-2"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </button>

              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}

export default Cart;