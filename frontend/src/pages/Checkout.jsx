import { useState } from "react";
import { useCart } from "../context/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL, getAuthHeaders } from "../api";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Convert cart format to the format expected by backend
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      console.log("Order created:", data);

      // Clear cart after successful order
      clearCart();

      // Go to success page
      navigate("/order-success", {
        state: {
          orderId: data.order.id,
          total: Number(data.order.total_amount),
        },
      });
    } catch (error) {
      console.error("Order error:", error);
      alert(error.message || "Failed to place order. Please try again.");
    }
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <main className="bg-light min-vh-100">
        <section className="container py-5">
          <div className="text-center py-5">

            <div className="text-uppercase fw-bold text-secondary small mb-2">
              CHECKOUT
            </div>

            <h1 className="display-5 fw-bold mb-3">
              Your Cart is Empty
            </h1>

            <p className="text-secondary fs-5 mb-4">
              Add some products before proceeding to checkout.
            </p>

            <button
              className="btn btn-dark px-4 py-2 fw-semibold"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>

          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-light min-vh-100">
      <section className="container py-5">

        {/* PAGE HEADING */}
        <div className="text-center mb-5">

          <div className="text-uppercase fw-bold text-secondary small mb-2">
            CHECKOUT
          </div>

          <h1 className="display-5 fw-bold mb-3">
            Complete Your Order
          </h1>

          <p className="text-secondary fs-5">
            Enter your details to place your order.
          </p>

        </div>

        <div className="row g-4">

          {/* CUSTOMER DETAILS */}
          <div className="col-lg-8">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4 p-md-5">

                <h2 className="fw-bold mb-4">
                  Shipping Details
                </h2>

                <form onSubmit={handleSubmit}>

                  {/* NAME */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />

                  </div>

                  {/* EMAIL */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      readOnly={Boolean(user?.email)}
                      required
                    />

                  </div>

                  {/* PHONE */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-lg"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />

                  </div>

                  {/* ADDRESS */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Address
                    </label>

                    <textarea
                      name="address"
                      className="form-control"
                      rows="4"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                      required
                    />

                  </div>

                  {/* CITY + STATE */}
                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-semibold">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        className="form-control form-control-lg"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label className="form-label fw-semibold">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        className="form-control form-control-lg"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                      />

                    </div>

                  </div>

                  {/* PINCODE */}
                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      className="form-control form-control-lg"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      required
                    />

                  </div>

                  {/* PLACE ORDER */}
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100 fw-bold"
                  >
                    Place Order
                  </button>

                </form>

              </div>

            </div>

          </div>

          {/* ORDER SUMMARY */}
          <div className="col-lg-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <h2 className="fw-bold mb-4">
                  Order Summary
                </h2>

                {/* PRODUCTS */}
                {cart.map((item) => (

                  <div
                    className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3"
                    key={item.id}
                  >

                    <div className="pe-3">

                      <h5 className="fw-semibold mb-1">
                        {item.name}
                      </h5>

                      <p className="text-secondary mb-0">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                        {" × "}
                        {item.quantity}
                      </p>

                    </div>

                    <strong className="text-nowrap">
                      ₹
                      {(
                        Number(item.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                ))}

                {/* TOTAL */}
                <div className="d-flex justify-content-between align-items-center pt-2">

                  <span className="fs-5">
                    Total
                  </span>

                  <strong className="fs-3">
                    ₹{total.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
    </main>
  );
}

export default Checkout;