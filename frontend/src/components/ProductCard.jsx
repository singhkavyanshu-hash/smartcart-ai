import { useCart } from "../context/useCart";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card h-100 border shadow-sm product-bootstrap-card">

      {/* Product image */}
      <div
        className="bg-light d-flex align-items-center justify-content-center"
        style={{
          height: "250px",
          fontSize: "90px",
        }}
      >
        {product.image}
      </div>

      {/* Product information */}
      <div className="card-body d-flex flex-column">

        <h5 className="card-title fw-bold">
          {product.name}
        </h5>

        <p className="card-text text-secondary">
          {product.description}
        </p>

        {/* Bottom section */}
        <div className="mt-auto pt-3">

          <div className="d-flex justify-content-between align-items-center gap-2">

            <strong className="fs-5">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </strong>

            <button
              type="button"
              className="btn btn-dark"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;