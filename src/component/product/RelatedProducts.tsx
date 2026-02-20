import React from "react";

const RelatedProduct = () => {
  return (
    <div className="related">
      <h2>Related Products</h2>

      <div className="related-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="related-card">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
              alt="related"
            />
            <h4>Casual Hoodie</h4>
            <p>$299.00</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;