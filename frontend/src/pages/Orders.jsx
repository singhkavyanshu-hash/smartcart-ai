import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL, getAuthHeaders } from "../api";

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  let cancelled = false;

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          headers: getAuthHeaders(token),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders."
        );
      }

      if (!cancelled) {
        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : []
        );
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err.message || "Failed to fetch orders."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  fetchOrders();

  return () => {
    cancelled = true;
  };
}, [token]);

  if (loading) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <section className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary mt-3">Loading your orders...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <section className="container py-5 text-center">
          <h1 className="display-6 fw-bold">Unable to load orders</h1>
          <p className="text-danger mt-3">{error}</p>
          <Link to="/products" className="btn btn-dark mt-3">Start Shopping</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-light min-vh-100 py-5">
      <section className="container py-3 py-md-5">
        <div className="text-center mb-5">
          <span className="text-uppercase text-secondary fw-bold small">Orders</span>
          <h1 className="display-5 fw-bold mt-2">My Orders</h1>
          <p className="text-secondary fs-5">View your previous purchases and order details.</p>
        </div>

        <div className="mx-auto" style={{ maxWidth: "1000px" }}>
          {orders.length === 0 ? (
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body p-5">
                <div className="fs-1 mb-3">🛍️</div>
                <h2 className="fw-bold">No orders found</h2>
                <p className="text-secondary mb-4">You haven't placed any orders yet.</p>
                <Link to="/products" className="btn btn-dark px-4">Start Shopping</Link>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div className="card border-0 shadow-sm mb-4" key={order.id}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4 gap-3">
                    <div>
                      <span className="text-uppercase text-secondary fw-bold small">Order</span>
                      <h2 className="fw-bold mb-0 mt-1">#{order.id}</h2>
                    </div>
                    <span className="text-secondary text-nowrap">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>

                  <div className="mb-4">
                    {(Array.isArray(order.items) ? order.items : []).map((item) => (
                      <div
                        className="d-flex justify-content-between align-items-center py-3 border-bottom gap-3"
                        key={`${order.id}-${item.product_id}`}
                      >
                        <div>
                          <h5 className="fw-semibold mb-1">{item.product_name}</h5>
                          <p className="text-secondary mb-0">
                            ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}
                          </p>
                        </div>
                        <strong className="text-nowrap">
                          ₹{(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <div>
                      <span className="text-secondary me-2">Total Amount</span>
                      <strong className="fs-5">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <Link to={`/orders/${order.id}`} className="btn btn-outline-dark">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Orders;
