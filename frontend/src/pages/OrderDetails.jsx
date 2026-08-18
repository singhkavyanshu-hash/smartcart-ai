import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL, getAuthHeaders } from "../api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/orders/${id}`,
          { headers: getAuthHeaders(token) }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order.");
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Order details error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, token]);

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <div className="container text-center py-5">
          <span className="text-uppercase text-secondary fw-semibold small">
            Order Details
          </span>

          <h1 className="display-5 fw-bold mt-2">
            Loading...
          </h1>

          <div
            className="spinner-border mt-4"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR STATE
  // =========================

  if (error) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <div className="container text-center py-5">

          <span className="text-uppercase text-secondary fw-semibold small">
            Order Details
          </span>

          <h1 className="display-6 fw-bold mt-2">
            Unable to load order
          </h1>

          <p className="text-secondary mt-3">
            {error}
          </p>

          <button
            className="btn btn-dark mt-3 px-4 py-2"
            onClick={() => navigate("/orders")}
          >
            ← Back to My Orders
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="bg-light min-vh-100 py-5">

      <section className="container">

        {/* =========================
            PAGE HEADING
        ========================== */}

        <div className="text-center mb-5">

          <span className="text-uppercase text-secondary fw-semibold small">
            Order Details
          </span>

          <h1 className="display-5 fw-bold mt-2">
            Order #{order.id}
          </h1>

          <p className="text-secondary fs-5">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </p>

        </div>

        {/* =========================
            ORDER DETAILS CONTAINER
        ========================== */}

        <div className="row g-4">

          {/* =========================
              ORDER ITEMS
          ========================== */}

          <div className="col-lg-7">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4 p-md-5">

                <h2 className="h3 fw-bold mb-4">
                  Items Ordered
                </h2>

                {order.items.map((item) => (
                  <div
                    className="d-flex justify-content-between align-items-center py-3 border-bottom"
                    key={item.product_id}
                  >

                    <div>
                      <h3 className="h5 fw-semibold mb-2">
                        {item.product_name}
                      </h3>

                      <p className="text-secondary mb-0">
                        ₹
                        {Number(item.price).toLocaleString(
                          "en-IN"
                        )}
                        {" × "}
                        {item.quantity}
                      </p>
                    </div>

                    <strong className="fs-5">
                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>
                ))}

                {/* TOTAL */}

                <div className="d-flex justify-content-between align-items-center pt-4">

                  <span className="text-secondary fs-5">
                    Total Amount
                  </span>

                  <strong className="fs-4">
                    ₹
                    {Number(order.total_amount).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              SHIPPING DETAILS
          ========================== */}

          <div className="col-lg-5">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4 p-md-5">

                <h2 className="h3 fw-bold mb-4">
                  Shipping Details
                </h2>

                <div className="mb-3">
                  <span className="text-secondary">
                    Name
                  </span>

                  <p className="fw-semibold mb-0 mt-1">
                    {order.customer_name}
                  </p>
                </div>

                <div className="mb-3">
                  <span className="text-secondary">
                    Email
                  </span>

                  <p className="fw-semibold mb-0 mt-1">
                    {order.email}
                  </p>
                </div>

                <div className="mb-3">
                  <span className="text-secondary">
                    Phone
                  </span>

                  <p className="fw-semibold mb-0 mt-1">
                    {order.phone}
                  </p>
                </div>

                <div className="mb-3">
                  <span className="text-secondary">
                    Address
                  </span>

                  <p className="fw-semibold mb-0 mt-1">
                    {order.address}
                  </p>
                </div>

                <div className="row">

                  <div className="col-sm-6 mb-3">

                    <span className="text-secondary">
                      City
                    </span>

                    <p className="fw-semibold mb-0 mt-1">
                      {order.city}
                    </p>

                  </div>

                  <div className="col-sm-6 mb-3">

                    <span className="text-secondary">
                      State
                    </span>

                    <p className="fw-semibold mb-0 mt-1">
                      {order.state}
                    </p>

                  </div>

                </div>

                <div>

                  <span className="text-secondary">
                    Pincode
                  </span>

                  <p className="fw-semibold mb-0 mt-1">
                    {order.pincode}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            BACK BUTTON
        ========================== */}

        <div className="mt-4">

          <button
            className="btn btn-dark px-4 py-2"
            onClick={() => navigate("/orders")}
          >
            ← Back to My Orders
          </button>

        </div>

      </section>

    </main>
  );
}

export default OrderDetails;