import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL } from "../api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      // Save user + token in AuthContext
      login(data.user, data.token);

      // Go to home after successful login
      const destination =
  location.state?.from?.pathname || "/";

navigate(destination, {
  replace: true,
});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4 p-md-5">

                {/* =========================
                    HEADER
                ========================== */}

                <div className="text-center mb-4">

                  <span className="text-uppercase text-secondary fw-semibold small">
                    Welcome Back
                  </span>

                  <h1 className="h2 fw-bold mt-2 mb-2">
                    Welcome Back
                  </h1>

                  <p className="text-secondary mb-0">
                    Login to your SmartCart account
                  </p>

                </div>

                {/* =========================
                    ERROR
                ========================== */}

                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* =========================
                    LOGIN FORM
                ========================== */}

                <form onSubmit={handleSubmit}>

                  {/* EMAIL */}

                  <div className="mb-3">

                    <label
                      htmlFor="email"
                      className="form-label fw-semibold"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* PASSWORD */}

                  <div className="mb-4">

                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* LOGIN BUTTON */}

                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>

                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                </form>

                {/* =========================
                    FOOTER
                ========================== */}

                <div className="text-center mt-4">

                  <span className="text-secondary">
                    Don't have an account?{" "}
                  </span>

                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold"
                  >
                    Create Account
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;
