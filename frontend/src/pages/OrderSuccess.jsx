import { Link, useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId;
  const total = location.state?.total;

  // Prevent showing undefined / NaN when page is opened directly
  if (!orderId || total === undefined) {
    return (
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 text-center p-5">
              <div className="display-4 mb-3">📦</div>

              <h1 className="fw-bold mb-3">
                Order Information Unavailable
              </h1>

              <p className="text-secondary mb-4">
                This page can only be viewed immediately after
                successfully placing an order.
              </p>

              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <button
                  className="btn btn-dark px-4"
                  onClick={() => navigate("/orders")}
                >
                  View My Orders
                </button>

                <Link
                  to="/products"
                  className="btn btn-outline-dark px-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          <div className="card border-0 shadow-sm rounded-4 text-center p-4 p-md-5">

            {/* Success Icon */}
            <div
              className="bg-success text-white rounded-circle
                         d-flex align-items-center justify-content-center
                         mx-auto mb-4"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "36px",
              }}
            >
              ✓
            </div>

            <span
              className="text-secondary fw-bold"
              style={{
                fontSize: "12px",
                letterSpacing: "3px",
              }}
            >
              ORDER CONFIRMED
            </span>

            <h1 className="fw-bold mt-2 mb-2">
              Thank You!
            </h1>

            <p className="text-secondary fs-5 mb-4">
              Your order has been placed successfully.
            </p>

            {/* Order Details */}
            <div className="bg-light rounded-3 p-3 p-md-4 mb-4">

              <div className="d-flex justify-content-between
                              align-items-center mb-3">
                <span className="text-secondary">
                  Order ID
                </span>

                <strong>
                  #{orderId}
                </strong>
              </div>

              <div className="d-flex justify-content-between
                              align-items-center">
                <span className="text-secondary">
                  Total Amount
                </span>

                <strong>
                  ₹{Number(total).toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

            <div className="d-flex justify-content-center gap-2 flex-wrap">

              <Link
                to="/orders"
                className="btn btn-dark px-4"
              >
                View My Orders
              </Link>

              <Link
                to="/products"
                className="btn btn-outline-dark px-4"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;