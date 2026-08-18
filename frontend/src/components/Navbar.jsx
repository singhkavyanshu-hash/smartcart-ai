import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sc-navbar">
      <div className="container py-2">

        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand fw-bold fs-4 text-dark text-decoration-none"
        >
          🛒 SmartCart
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#smartCartNavbar"
          aria-controls="smartCartNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="smartCartNavbar"
        >

          {/* Navigation links */}
          <div className="navbar-nav mx-auto gap-lg-3">

            <Link
              to="/"
              className="nav-link text-dark"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="nav-link text-dark"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="nav-link text-dark"
            >
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>

            {user && (
              <Link
                to="/orders"
                className="nav-link text-dark"
              >
                My Orders
              </Link>
            )}

          </div>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">

            {user ? (
              <>
                <span className="text-dark">
                  Hi, {user.name}
                </span>

                <button
                  onClick={logout}
                  className="btn btn-outline-dark btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-dark"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-dark"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;