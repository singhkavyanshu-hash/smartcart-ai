import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products received:", data);
        setFeaturedProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <main>

      {/* ================= HERO SECTION ================= */}

      <section className="hero">
        <div className="hero-content">

          <span className="hero-badge">
            ✨ AI-powered shopping
          </span>

          <h1>
            Shop smarter.
            <br />
            Choose better.
          </h1>

          <p>
            Discover products that match your needs with
            intelligent recommendations and personalized shopping.
          </p>

          <div className="hero-buttons">

            <Link to="/products" className="primary-btn">
              Explore Products
            </Link>

            <button className="ai-btn">
              ✨ Ask SmartCart AI
            </button>

          </div>
        </div>
      </section>


      {/* ================= CATEGORIES ================= */}

      <section className="categories-section">

        <div className="section-heading">

          <span>EXPLORE</span>

          <h2>Shop by Category</h2>

          <p>
            Find exactly what you're looking for.
          </p>

        </div>

        <div className="categories">

          <div className="category-card">
            <span>💻</span>
            <h3>Electronics</h3>
            <p>Latest gadgets & technology</p>
          </div>

          <div className="category-card">
            <span>👕</span>
            <h3>Fashion</h3>
            <p>Style for every occasion</p>
          </div>

          <div className="category-card">
            <span>👟</span>
            <h3>Footwear</h3>
            <p>Walk in your own style</p>
          </div>

          <div className="category-card">
            <span>🏠</span>
            <h3>Home</h3>
            <p>Make your space better</p>
          </div>

        </div>

      </section>


      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="products-section">

        <div className="section-heading">

          <span>TRENDING</span>

          <h2>Featured Products</h2>

          <p>
            Popular products picked for you.
          </p>

        </div>

        <div className="product-grid">

          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </section>


      {/* ================= AI SECTION ================= */}

      <section className="ai-section">

        <div className="ai-content">

          <span>✨ SMARTCART AI</span>

          <h2>
            Don't know what to buy?
            <br />
            Just ask.
          </h2>

          <p>
            Tell SmartCart what you need, your budget and your
            preferences. Our AI assistant will help you find
            the right products.
          </p>

          <button className="ai-large-btn">
            Start Shopping with AI →
          </button>

        </div>

      </section>

    </main>
  );
}

export default Home;