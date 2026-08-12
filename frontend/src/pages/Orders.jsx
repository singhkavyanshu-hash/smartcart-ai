import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary email until authentication is added
  const email = "singhkavyanshu@gmail.com";

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders?email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders.");
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Orders error:", error);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main>
        <section className="orders-section">
          <div className="section-heading">
            <span>ORDERS</span>
            <h1>My Orders</h1>
            <p>Loading your orders...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="orders-section">
          <div className="section-heading">
            <span>ORDERS</span>
            <h1>My Orders</h1>
            <p>{error}</p>
          </div>
        </section>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main>
        <section className="orders-section">
          <div className="section-heading">
            <span>ORDERS</span>
            <h1>No Orders Yet</h1>
            <p>
              You haven't placed any orders yet.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="orders-section">

        <div className="section-heading">
          <span>ORDERS</span>

          <h1>My Orders</h1>

          <p>
            View your previous purchases and order details.
          </p>
        </div>

        <div className="orders-container">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              {/* ORDER HEADER */}

              <div className="order-header">

                <div>
                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>
                    #{order.id}
                  </h2>
                </div>

                <div className="order-date">
                  {new Date(
                    order.created_at
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

              </div>


              <hr />


              {/* ORDER ITEMS */}

              <div className="order-items">

                {order.items?.map((item) => (

                  <div
                    className="order-item"
                    key={`${order.id}-${item.product_id}`}
                  >

                    <div>

                      <h3>
                        {item.product_name}
                      </h3>

                      <p>
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString("en-IN")}
                        {" × "}
                        {item.quantity}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                ))}

              </div>


              <hr />


              {/* ORDER TOTAL */}

              <div className="order-footer">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹
                  {Number(
                    order.total_amount
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            </div>

          ))}

        </div>

      </section>
    </main>
  );
}

export default Orders;