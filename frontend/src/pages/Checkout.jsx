import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: formData.name,
          email: formData.email,
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
      <main>
        <section className="checkout-section">
          <div className="section-heading">
            <span>CHECKOUT</span>

            <h1>Your Cart is Empty</h1>

            <p>
              Add some products before proceeding to checkout.
            </p>

            <button
              className="primary-btn"
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
    <main>
      <section className="checkout-section">

        {/* PAGE HEADING */}

        <div className="section-heading">
          <span>CHECKOUT</span>

          <h1>Complete Your Order</h1>

          <p>
            Enter your details to place your order.
          </p>
        </div>


        <div className="checkout-container">

          {/* CUSTOMER DETAILS */}

          <div className="checkout-form-card">

            <h2>Shipping Details</h2>

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />

              </div>


              {/* ADDRESS */}

              <div className="form-group">

                <label>Address</label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  required
                />

              </div>


              {/* CITY + STATE */}

              <div className="form-row">

                <div className="form-group">

                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />

                </div>

              </div>


              {/* PINCODE */}

              <div className="form-group">

                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />

              </div>


              {/* PLACE ORDER */}

              <button
                type="submit"
                className="checkout-btn"
              >
                Place Order
              </button>

            </form>

          </div>


          {/* ORDER SUMMARY */}

          <div className="checkout-summary">

            <h2>Order Summary</h2>

            {cart.map((item) => (

              <div
                className="checkout-item"
                key={item.id}
              >

                <div>

                  <h3>{item.name}</h3>

                  <p>
                    ₹{Number(item.price).toLocaleString("en-IN")}
                    {" × "}
                    {item.quantity}
                  </p>

                </div>


                <strong>
                  ₹
                  {(
                    Number(item.price) * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            ))}


            <hr />


            <div className="checkout-total">

              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>

            </div>

          </div>

        </div>

      </section>
    </main>
  );
}

export default Checkout;