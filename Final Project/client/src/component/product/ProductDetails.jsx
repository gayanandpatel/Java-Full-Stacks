import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart, FaStar, FaArrowLeft, FaTruck, FaShieldAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

import { getProductById, setQuantity } from "../../store/features/productSlice";
import { addToCart } from "../../store/features/cartSlice";

import ImageZoomify from "../common/ImageZoomify";
import QuantityUpdater from "../utils/QuantityUpdater";
import ProductImage from "../utils/ProductImage";
import LoadSpinner from "../common/LoadSpinner";

import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useSelector((state) => state.auth);
  const { product, quantity, isLoading } = useSelector((state) => state.product);
  
  const [activeImageId, setActiveImageId] = useState(null);

  useEffect(() => {
    dispatch(getProductById(productId));
    dispatch(setQuantity(1));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImageId(product.images[0].id);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue");
      return;
    }
    await handleAddToCart();
    if (userId) {
      navigate("/cart");
    } else {
      toast.error("User ID missing. Please login again.");
    }
  };

  if (isLoading) return <LoadSpinner />;
  if (!product) return <div className="text-center mt-5">Product not found</div>;

  const productOutOfStock = product.inventory <= 0;

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer position="top-right" />
      
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Results
      </button>

      <div className={styles.mainCard}>
        <div className={styles.grid}>
          
          {/* --- Left: Gallery --- */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImage}>
              {activeImageId ? (
                <ImageZoomify productId={activeImageId} />
              ) : (
                <div className={styles.placeholderImg}>No Image</div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className={styles.thumbGrid}>
                {product.images.map((img) => (
                  <div 
                    key={img.id}
                    className={`${styles.thumb} ${activeImageId === img.id ? styles.activeThumb : ''}`}
                    onMouseEnter={() => setActiveImageId(img.id)}
                  >
                    <ProductImage productId={img.id} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Right: Details --- */}
          <div className={styles.detailsCol}>
            <div className={styles.header}>
              <span className={styles.brand}>{product.brand}</span>
              <h1 className={styles.title}>{product.name}</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < 4 ? "#ffc107" : "#e4e5e9"} />
                  ))}
                </div>
                <span className={styles.reviewCount}>128 ratings</span>
              </div>
            </div>

            <div className={styles.priceSection}>
              <h2 className={styles.price}>₹{product.price?.toFixed(2)}</h2>
              <span className={styles.taxNote}>Inclusive of all taxes</span>
            </div>

            <div className={styles.stockWrapper}>
                {product.inventory > 0 ? (
                  <span style={{ color: "#28a745", fontWeight: "600", fontSize: "0.85rem" }}>
                    In Stock
                  </span>
                ):(
                    <span style={{ color: "#dc3545", fontWeight: "600", fontSize: "0.85rem" }}>
                      Out of Stock
                    </span>
                  )
                }
            </div>

            <div className={styles.features}>
              <div className={styles.featureItem}>
                <FaTruck className={styles.featureIcon}/>
                <span>Free Delivery</span>
              </div>
              <div className={styles.featureItem}>
                <FaShieldAlt className={styles.featureIcon}/>
                <span>1 Year Warranty</span>
              </div>
            </div>

            <div className={styles.description}>
              <h3>About this item</h3>
              <p>{product.description}</p>
            </div>

            {/* Buy Box Area */}
            <div className={styles.buyBox}>
              <div className={styles.qtyRow}>
                <span className={styles.label}>Quantity:</span>
                <QuantityUpdater
                  quantity={quantity}
                  onDecrease={() => dispatch(setQuantity(Math.max(1, quantity - 1)))}
                  onIncrease={() => dispatch(setQuantity(quantity + 1))}
                  disabled={productOutOfStock}
                />
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={styles.cartBtn}
                  onClick={handleAddToCart}
                  disabled={productOutOfStock}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  className={styles.buyBtn}
                  onClick={handleBuyNow}
                  disabled={productOutOfStock}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;