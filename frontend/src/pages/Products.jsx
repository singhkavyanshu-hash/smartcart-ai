import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search, filter and sort states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

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
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Unable to load products.");
        setLoading(false);
      });
  }, []);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter products
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Sort products
  if (sort === "price-low") {
    filteredProducts.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (sort === "price-high") {
    filteredProducts.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  if (sort === "name-az") {
    filteredProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sort === "name-za") {
    filteredProducts.sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  return (
    <main className="bg-light min-vh-100">

      <section className="py-5">

        <div className="container">

          {/* Page heading */}
          <div className="text-center mb-5">

            <span className="text-uppercase fw-bold text-secondary small">
              Shop
            </span>

            <h1 className="display-5 fw-bold mt-2">
              All Products
            </h1>

            <p className="text-secondary fs-5">
              Find products that match your needs.
            </p>

          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <div
                className="spinner-border text-dark"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-3 text-secondary">
                Loading products...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          {/* Controls */}
          {!loading && !error && (
            <>

              <div className="row g-3 mb-4">

                {/* Search */}
                <div className="col-lg-6">

                  <label className="form-label fw-semibold">
                    Search
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>

                {/* Category */}
                <div className="col-md-6 col-lg-3">

                  <label className="form-label fw-semibold">
                    Category
                  </label>

                  <select
                    className="form-select form-select-lg"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                      >
                        {cat === "All"
                          ? "All Categories"
                          : cat}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Sort */}
                <div className="col-md-6 col-lg-3">

                  <label className="form-label fw-semibold">
                    Sort
                  </label>

                  <select
                    className="form-select form-select-lg"
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value)
                    }
                  >
                    <option value="default">
                      Default
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="name-az">
                      Name: A to Z
                    </option>

                    <option value="name-za">
                      Name: Z to A
                    </option>
                  </select>

                </div>

              </div>

              {/* Results count */}
              <p className="text-secondary mb-4">
                Showing{" "}
                <strong>
                  {filteredProducts.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {products.length}
                </strong>{" "}
                products
              </p>

              {/* Products */}
              {filteredProducts.length > 0 ? (

                <div className="row g-4">

                  {filteredProducts.map((product) => (

                    <div
                      className="col-sm-6 col-lg-4 col-xl-3"
                      key={product.id}
                    >
                      <ProductCard
                        product={product}
                      />
                    </div>

                  ))}

                </div>

              ) : (

                <div className="text-center py-5">

                  <h2 className="fw-bold">
                    No products found
                  </h2>

                  <p className="text-secondary">
                    Try changing your search or filter.
                  </p>

                </div>

              )}

            </>
          )}

        </div>

      </section>

    </main>
  );
}

export default Products;
