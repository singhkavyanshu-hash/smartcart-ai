import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { API_BASE_URL } from "../api";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Product not found");
        }

        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  function handleAddToCart() {
    if (!product || product.stock === 0) return;

    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  if (loading) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <div className="container text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary mt-3 mb-0">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <div className="container text-center py-5">
          <h1 className="display-6 fw-bold">{error || "Product not found"}</h1>
          <Link to="/products" className="btn btn-dark mt-3">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-light min-vh-100 py-5">
      <section className="container py-3 py-md-5">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="row g-0 align-items-stretch">
            <div className="col-lg-6 bg-white d-flex align-items-center justify-content-center p-5" style={{ minHeight: 420 }}>
              <div className="display-1" aria-label={product.name}>
                {product.image}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card-body p-4 p-md-5 h-100 d-flex flex-column">
                <span className="badge text-bg-light align-self-start text-uppercase mb-3">
                  {product.category}
                </span>

                <h1 className="display-6 fw-bold mb-3">{product.name}</h1>

                <p className="text-secondary fs-5">{product.description}</p>

                <div className="display-6 fw-bold my-3">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </div>

                <p className={`fw-semibold ${product.stock > 0 ? "text-success" : "text-danger"}`}>
                  {product.stock > 0
                    ? `${product.stock} items available`
                    : "Out of stock"}
                </p>

                <div className="mt-auto pt-3">
                  <button
                    type="button"
                    className={`btn ${added ? "btn-success" : "btn-dark"} btn-lg w-100 fw-semibold`}
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    {added ? "✓ Added to Cart" : "Add to Cart"}
                  </button>

                  <Link to="/products" className="btn btn-outline-dark btn-lg w-100 mt-3">
                    ← Back to Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
