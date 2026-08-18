import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL } from "../api";

function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      // Automatically log in after registration
      login(data.user, data.token);

      navigate("/");
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
                    Get Started
                  </span>

                  <h1 className="h2 fw-bold mt-2 mb-2">
                    Create Account
                  </h1>

                  <p className="text-secondary mb-0">
                    Join SmartCart today
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
                    REGISTER FORM
                ========================== */}

                <form onSubmit={handleSubmit}>

                  {/* NAME */}

                  <div className="mb-3">

                    <label
                      htmlFor="name"
                      className="form-label fw-semibold"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                  </div>

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
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
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
                      className="form-control form-control-lg"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      minLength={6}
                      required
                    />

                    <div className="form-text">
                      Password must be at least 6 characters.
                    </div>

                  </div>

                  {/* CREATE ACCOUNT BUTTON */}

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

                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                </form>

                {/* =========================
                    FOOTER
                ========================== */}

                <div className="text-center mt-4">

                  <span className="text-secondary">
                    Already have an account?{" "}
                  </span>

                  <Link
                    to="/login"
                    className="text-decoration-none fw-semibold"
                  >
                    Login
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

export default Register;
