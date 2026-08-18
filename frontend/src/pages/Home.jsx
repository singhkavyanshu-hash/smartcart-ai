import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../api";

function Home({ openAIChat }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products received:", data);

        // Show only a few products on homepage
        setFeaturedProducts(data.slice(0, 4));
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <main>

      {/* ================= HERO SECTION ================= */}

      <section className="bg-light py-5">
        <div className="container py-5">
          <div className="row justify-content-center text-center">

            <div className="col-lg-9">

              {/* Badge */}
              <span className="badge bg-white text-dark border rounded-pill px-4 py-3 mb-4 shadow-sm">
                ✨ AI-powered shopping
              </span>

              {/* Heading */}
              <h1 className="display-1 fw-bold text-dark mb-4">
                Shop smarter.
                <br />
                Choose better.
              </h1>

              {/* Description */}
              <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: "750px" }}>
                Discover products that match your needs with
                intelligent recommendations and personalized shopping.
              </p>

              {/* Buttons */}
              <div className="d-flex justify-content-center gap-3 flex-wrap">

                <Link
                  to="/products"
                  className="btn btn-dark btn-lg px-4"
                >
                  Explore Products
                </Link>

                <button
                  className="btn btn-outline-dark btn-lg px-4"
                  onClick={openAIChat}
                >
                  ✨ Ask SmartCart AI
                </button>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ================= CATEGORIES ================= */}

      <section className="py-5">
        <div className="container py-5">

          {/* Section Heading */}

          <div className="text-center mb-5">

            <span className="text-secondary fw-semibold">
              EXPLORE
            </span>

            <h2 className="display-5 fw-bold mt-2">
              Shop by Category
            </h2>

            <p className="text-secondary fs-5">
              Find exactly what you're looking for.
            </p>

          </div>


          {/* Category Cards */}

          <div className="row g-4">

            {/* Electronics */}

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4">

                <div className="display-4 mb-3">
                  💻
                </div>

                <h3 className="h5 fw-bold">
                  Electronics
                </h3>

                <p className="text-secondary mb-0">
                  Latest gadgets & technology
                </p>

              </div>
            </div>


            {/* Fashion */}

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4">

                <div className="display-4 mb-3">
                  👕
                </div>

                <h3 className="h5 fw-bold">
                  Fashion
                </h3>

                <p className="text-secondary mb-0">
                  Style for every occasion
                </p>

              </div>
            </div>


            {/* Footwear */}

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4">

                <div className="display-4 mb-3">
                  👟
                </div>

                <h3 className="h5 fw-bold">
                  Footwear
                </h3>

                <p className="text-secondary mb-0">
                  Walk in your own style
                </p>

              </div>
            </div>


            {/* Home */}

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4">

                <div className="display-4 mb-3">
                  🏠
                </div>

                <h3 className="h5 fw-bold">
                  Home
                </h3>

                <p className="text-secondary mb-0">
                  Make your space better
                </p>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="bg-light py-5">

        <div className="container py-5">

          {/* Section Heading */}

          <div className="text-center mb-5">

            <span className="text-secondary fw-semibold">
              TRENDING
            </span>

            <h2 className="display-5 fw-bold mt-2">
              Featured Products
            </h2>

            <p className="text-secondary fs-5">
              Popular products picked for you.
            </p>

          </div>


          {/* Products */}

          <div className="row g-4">

            {featuredProducts.map((product) => (
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={product.id}
              >
                <ProductCard product={product} />
              </div>
            ))}

          </div>


          {/* View All */}

          <div className="text-center mt-5">

            <Link
              to="/products"
              className="btn btn-outline-dark btn-lg px-4"
            >
              View All Products →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= AI SECTION ================= */}

      <section className="py-5">

        <div className="container py-5">

          <div className="row justify-content-center">

            <div className="col-lg-9">

              <div className="bg-dark text-white rounded-4 p-5 text-center">

                <span className="text-light fw-semibold">
                  ✨ SMARTCART AI
                </span>

                <h2 className="display-5 fw-bold mt-3">
                  Don't know what to buy?
                  <br />
                  Just ask.
                </h2>

                <p className="lead text-white-50 mx-auto my-4" style={{ maxWidth: "700px" }}>
                  Tell SmartCart what you need, your budget and your
                  preferences. Our AI assistant will help you find
                  the right products.
                </p>

                <button
                  className="btn btn-light btn-lg px-4"
                  onClick={openAIChat}
                >
                  Start Shopping with AI →
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
