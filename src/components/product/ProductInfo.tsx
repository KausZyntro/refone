"use client";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsCreditCard2Front } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { FaRegCreditCard, FaRupeeSign, FaTruck } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart, clearCartMessage, fetchCartSummary } from "@/redux/features/cartSlice";
import Toast from "@/components/ui/Toast";
import "../../styles/Toast.css";
import { useRouter } from "next/navigation";
interface Pricing {
  mrp: string;
  selling_price: string;
  id?: number;
}

interface Variant {
  id: number;
  pricing: Pricing;
  inventory: { total_stock: number };
  images: { id: number; image_url: string }[];
}

interface ProductInfoProps {
  product: {
    id: number;
    name: string;
    screen_size?: string;
    battery_capacity?: string;
    front_camera?: string;
    back_camera?: string;
    network_support?: string;
    sim_slots?: string;
    fingerprint_scanner?: number;
    face_unlock?: number;
    brand?: { id: number; name: string };
    variants: Variant[];
  };
}

/* ── Star renderer ─────────────────────────────────────── */
const StarRating = ({
  rating = 4.2,
  count = 289,
}: {
  rating?: number;
  count?: number;
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return "full";
    if (i < rating) return "half";
    return "empty";
  });
  return (
    <div className="pi-rating">
      <div className="pi-stars">
        {stars.map((s, i) =>
          s === "full" ? (
            <FaStar key={i} />
          ) : s === "half" ? (
            <FaStarHalfAlt key={i} />
          ) : (
            <FaRegStar key={i} />
          ),
        )}
      </div>
      <span className="pi-reviews">{count} reviews</span>
    </div>
  );
};

/* ── Main component ─────────────────────────────────────── */
const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants?.[0],
  );
  const [quantity, setQuantity] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoading: isCartLoading,
    successMessage,
    error: cartError,
  } = useSelector((state: RootState) => state.cart);
  // Read customer_id from authenticated user stored in Redux auth state
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(false);

  const pricing = selectedVariant?.pricing;
  const mrp = pricing ? parseFloat(pricing.mrp) : 0;
  const price = pricing ? parseFloat(pricing.selling_price) : 0;
  const discount = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = selectedVariant?.inventory?.total_stock ?? 0;
  const isOutOfStock = stock <= 0;

  // const handleAddToCart = async () => {
  //   // Guard: user must be logged in
  //   if (!user?.id) {
  //     alert("Please log in to add items to your cart.");
  //     return;
  //   }

  //   const priceId = pricing?.id;
  //   if (!priceId) return;
  //   try{
  //     dispatch(
  //     addToCart({
  //       user_id: userId,
  //       product_id: product.id,
  //       variant_id: selectedVariant.id,
  //       quantity: 1,
  //     })
  //   );
  //     setQuantity(1);
  //     setAddedToCart(true);
  //   }catch (err) {
  //   console.log(err);
  // }
  // };
  const handleAddToCart = async () => {
    if (!userId) {
      alert("Login required");
      return;
    }
    const priceId = pricing?.id;
    if (!priceId) return;

    try {
      await dispatch(
        addToCart({
          user_id: userId,
          product_id: product.id,
          variant_id: selectedVariant.id,
          quantity: 1,
        }),
      ).unwrap();

      // Sync the cart summary
      dispatch(fetchCartSummary(userId));

      setAddedToCart(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseToast = useCallback(() => {
    dispatch(clearCartMessage());
  }, [dispatch]);

  return (
    <div className="product-info">
      {/* Toast notifications */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={handleCloseToast}
        />
      )}
      {cartError && (
        <Toast message={cartError} type="error" onClose={handleCloseToast} />
      )}

      {/* Brand / category */}
      <p className="category">
        {product.brand?.name} &bull; {product.network_support ?? ""}
      </p>

      {/* Product name */}
      <h1 className="title">{product.name}</h1>

      {/* Price row + rating side by side */}
      <div className="pi-price-rating-row">
        <div className="price-row">
          {mrp > price && (
            <span className="old-price">₹{mrp.toLocaleString("en-IN")}</span>
          )}
          <span className="new-price">₹{price.toLocaleString("en-IN")}</span>
          {discount > 0 && (
            <span className="discount-badge">{discount}% off</span>
          )}
        </div>
        <StarRating rating={4.2} count={289} />
      </div>

      {/* Description */}
      <div className="pi-description">
        <p className="pi-desc-label">Description:</p>
        <p className="pi-desc-text">
          {product.name} — a powerful device by{" "}
          {product.brand?.name ?? "the brand"}. Featuring a{" "}
          {product.screen_size ?? "large"} display,{" "}
          {product.battery_capacity ?? "long-lasting"} battery, and{" "}
          {product.back_camera ?? "high-quality"} rear camera system. Supports{" "}
          {product.network_support ?? "fast"} connectivity with{" "}
          {product.sim_slots ?? "dual SIM"} support.
        </p>
      </div>

      {/* Variant selector (if multiple variants) */}
      {product.variants.length > 1 && (
        <div className="storage-section">
          <div className="storage-header">
            <p>
              Variant: <b>#{selectedVariant?.id}</b>
            </p>
          </div>
          <div className="storages">
            {product.variants.map((v) => (
              <button
                key={v.id}
                className={
                  selectedVariant?.id === v.id ? "storage active" : "storage"
                }
                onClick={() => setSelectedVariant(v)}
              >
                Variant {v.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart / Buy Now */}
      <div className="button-row">
        {addedToCart ? (
          <button className="go-to-cart" onClick={() => router.push("/cart")}>
            Go to Cart
          </button>
        ) : (
          <button
            className={`add-cart ${isOutOfStock || isCartLoading ? "disabled" : ""}`}
            disabled={isOutOfStock || isCartLoading}
            onClick={handleAddToCart}
          >
            {isCartLoading
              ? "Adding…"
              : isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
          </button>
        )}

        <button
          className={`buy-now ${isOutOfStock ? "disabled" : ""}`}
          disabled={isOutOfStock}
        >
          Buy Now
        </button>
      </div>

      {/* Payment Methods */}
      <section className="payment-section">
        <h3 className="payment-title">Available Payment Methods</h3>
        <div className="payment-wrapper">
          <div className="payment-item">
            <div className="icon-box">
              <MdPayment />
            </div>
            <span>EMI</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <img
                src="https://s3ng.cashify.in/estore/08af477c2db941be8ba3c9848418acbb.webp"
                alt="UPI"
              />
            </div>
            <span>UPI</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <BsCreditCard2Front />
            </div>
            <span>Credit Card</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <FaTruck />
            </div>
            <span>COD Available</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <FaRupeeSign />
            </div>
            <span>Split Payment</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <FaRegCreditCard />
            </div>
            <span>Debit Card</span>
          </div>
          <div className="payment-item">
            <div className="icon-box">
              <CiBank />
            </div>
            <span>Net Banking</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductInfo;
