import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const orderId = location.state?.orderId;
  const total = location.state?.total;

  return (
    <main>
      <section className="success-page">
        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <span className="section-label">
            ORDER CONFIRMED
          </span>

          <h1>Thank You!</h1>

          <p className="success-message">
            Your order has been placed successfully.
          </p>

          <div className="order-details">
            <p>
              <strong>Order ID:</strong> #{orderId}
            </p>

            <p>
              <strong>Total Amount:</strong>{" "}
              ₹{Number(total).toLocaleString("en-IN")}
            </p>
          </div>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>

        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;