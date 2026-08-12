import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Product received:", data);
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setError("Unable to load product.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main>
        <div className="product-details-page">
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="product-details-page">
          <h2>{error}</h2>

          <Link to="/products" className="primary-btn">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="product-details-page">

        <div className="product-details-card">

          <div className="product-details-image">
            {product.image}
          </div>

          <div className="product-details-info">

            <span className="product-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <p className="product-details-description">
              {product.description}
            </p>

            <div className="product-details-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>

            <p className="product-stock">
              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </p>

            <button
              className="add-cart-btn"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>

            <br />

            <Link to="/products" className="back-products">
              ← Back to Products
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}

export default ProductDetails;